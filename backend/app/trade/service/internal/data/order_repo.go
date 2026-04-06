package data

import (
	"context"

	"github.com/go-kratos/kratos/v2/log"
	paginationv1 "github.com/tx7do/go-crud/api/gen/go/pagination/v1"
	"github.com/tx7do/go-utils/trans"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	entCrud "github.com/tx7do/go-crud/entgo"

	tradev1 "go-wind-cms/api/gen/go/trade/service/v1"
	entModel "go-wind-cms/app/trade/service/internal/data/ent"
	orderEnt "go-wind-cms/app/trade/service/internal/data/ent/order"
)

type OrderRepo struct {
	log       *log.Helper
	entClient *entCrud.EntClient[*entModel.Client]
}

func NewOrderRepo(logger log.Logger, client *entCrud.EntClient[*entModel.Client]) *OrderRepo {
	repo := &OrderRepo{log: log.NewHelper(logger), entClient: client}
	if repo.entClient == nil {
		repo.log.Warn("trade ent client is nil, order repo init skipped")
	}
	return repo
}

func toOrderPB(item *entModel.Order) *tradev1.Order {
	if item == nil {
		return nil
	}

	return &tradev1.Order{
		Id:         trans.Ptr(item.ID),
		BookId:     trans.Ptr(item.BookID),
		BookTitle:  trans.Ptr(item.BookTitle),
		Quantity:   trans.Ptr(item.Quantity),
		UnitPrice:  trans.Ptr(float32(item.UnitPrice)),
		TotalPrice: trans.Ptr(float32(item.TotalPrice)),
		UserId:     trans.Ptr(item.UserID),
		Status:     trans.Ptr(tradev1.OrderStatus(item.Status)),
	}
}

// List 列出订单（分页并返回总数）。
func (r *OrderRepo) List(ctx context.Context, req *paginationv1.PagingRequest) (*tradev1.ListOrdersResponse, error) {
	if r.entClient == nil {
		return nil, status.Error(codes.Internal, "trade ent client not ready")
	}

	if req == nil {
		req = &paginationv1.PagingRequest{}
	}

	pageNum := int(req.GetPage())
	pageSize := int(req.GetPageSize())
	if pageNum <= 0 {
		pageNum = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	offset := (pageNum - 1) * pageSize

	// 1) 按创建顺序做分页查询。
	entities, err := r.entClient.Client().Order.
		Query().
		Order(entModel.Asc(orderEnt.FieldID)).
		Limit(pageSize).
		Offset(offset).
		All(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	items := make([]*tradev1.Order, 0, len(entities))
	for _, item := range entities {
		items = append(items, toOrderPB(item))
	}

	// 2) 同时查询总记录数，供分页前端计算总页数。
	total, err := r.entClient.Client().Order.Query().Count(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &tradev1.ListOrdersResponse{Items: items, Total: uint64(total)}, nil
}

// Get 获取单条订单。
func (r *OrderRepo) Get(ctx context.Context, req *tradev1.GetOrderRequest) (*tradev1.Order, error) {
	if r.entClient == nil {
		return nil, status.Error(codes.Internal, "trade ent client not ready")
	}

	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "request is required")
	}

	item, err := r.entClient.Client().Order.Get(ctx, req.GetId())
	if entModel.IsNotFound(err) {
		return nil, status.Errorf(codes.NotFound, "order %d not found", req.GetId())
	}
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return toOrderPB(item), nil
}

// Save 新增订单记录。
func (r *OrderRepo) Save(ctx context.Context, order *tradev1.Order) (*tradev1.Order, error) {
	if r.entClient == nil {
		return nil, status.Error(codes.Internal, "trade ent client not ready")
	}
	if order == nil {
		return nil, status.Error(codes.InvalidArgument, "order is required")
	}

	statusCode := order.GetStatus()
	if statusCode == tradev1.OrderStatus_ORDER_STATUS_UNSPECIFIED {
		statusCode = tradev1.OrderStatus_ORDER_STATUS_PENDING
	}

	// 1) 将下游 book 快照信息和金额计算值持久化到 trade_orders。
	item, err := r.entClient.Client().Order.Create().
		SetBookID(order.GetBookId()).
		SetBookTitle(order.GetBookTitle()).
		SetQuantity(order.GetQuantity()).
		SetUnitPrice(float64(order.GetUnitPrice())).
		SetTotalPrice(float64(order.GetTotalPrice())).
		SetUserID(order.GetUserId()).
		SetStatus(int32(statusCode)).
		Save(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return toOrderPB(item), nil
}

// Cancel 将订单状态更新为 CANCELED。
func (r *OrderRepo) Cancel(ctx context.Context, req *tradev1.CancelOrderRequest) error {
	if r.entClient == nil {
		return status.Error(codes.Internal, "trade ent client not ready")
	}
	if req == nil {
		return status.Error(codes.InvalidArgument, "request is required")
	}

	// 1) 条件更新：只允许从未取消状态变更为取消，避免重复取消无意义更新。
	updated, err := r.entClient.Client().Order.
		Update().
		Where(
			orderEnt.IDEQ(req.GetId()),
			orderEnt.StatusNEQ(int32(tradev1.OrderStatus_ORDER_STATUS_CANCELLED)),
		).
		SetStatus(int32(tradev1.OrderStatus_ORDER_STATUS_CANCELLED)).
		Save(ctx)
	if err != nil {
		return status.Error(codes.Internal, err.Error())
	}
	if updated == 0 {
		return status.Errorf(codes.NotFound, "order %d not found or already cancelled", req.GetId())
	}

	return nil
}
