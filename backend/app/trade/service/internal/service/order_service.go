package service

import (
	"context"
	"fmt"

	"github.com/go-kratos/kratos/v2/log"
	paginationv1 "github.com/tx7do/go-crud/api/gen/go/pagination/v1"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/tx7do/go-utils/trans"
	bookv1 "go-wind-cms/api/gen/go/book/service/v1"
	tradev1 "go-wind-cms/api/gen/go/trade/service/v1"
	"go-wind-cms/app/trade/service/internal/data"
)

// OrderService 订单服务实现
// 流程：校验参数 -> 调用 book-service 取书籍 -> 扣减库存 -> 入库 order 表。
type OrderService struct {
	tradev1.UnimplementedOrderServiceServer

	log       *log.Helper
	orderRepo *data.OrderRepo

	// bookClient 是 book-service 的 gRPC 客户端，由 trade-service 通过服务发现连接
	bookClient bookv1.BookServiceClient
}

func NewOrderService(
	logger log.Logger,
	orderRepo *data.OrderRepo,
	bookClient bookv1.BookServiceClient,
) *OrderService {
	return &OrderService{
		log:        log.NewHelper(logger),
		orderRepo:  orderRepo,
		bookClient: bookClient,
	}
}

func (s *OrderService) List(ctx context.Context, req *paginationv1.PagingRequest) (*tradev1.ListOrdersResponse, error) {
	return s.orderRepo.List(ctx, req)
}

func (s *OrderService) Get(ctx context.Context, req *tradev1.GetOrderRequest) (*tradev1.Order, error) {
	return s.orderRepo.Get(ctx, req)
}

// CreateOrder 创建订单
// 关键步骤：读取书籍库存、更新库存到 book-service、计算金额并保存订单。
func (s *OrderService) CreateOrder(ctx context.Context, req *tradev1.CreateOrderRequest) (*tradev1.Order, error) {
	if req.GetBookId() == 0 {
		return nil, fmt.Errorf("book_id is required")
	}
	if req.GetQuantity() <= 0 {
		return nil, fmt.Errorf("quantity must be greater than 0")
	}

	// 1) 调用 book-service 获取书籍详情，使用 book-service 的 DB 保证库存/价格一致。
	s.log.Infof("trade-service calls book-service: book_id=%d", req.GetBookId())
	book, err := s.bookClient.Get(ctx, &bookv1.GetBookRequest{Id: req.GetBookId()})
	if err != nil {
		s.log.Errorf("failed to get book from book-service: %v", err)
		return nil, fmt.Errorf("book not found: %w", err)
	}
	if book.GetStock() <= 0 {
		return nil, status.Errorf(codes.FailedPrecondition, "book %d out of stock", req.GetBookId())
	}
	if book.GetStock() < req.GetQuantity() {
		return nil, status.Errorf(codes.FailedPrecondition, "book %d stock not enough: stock=%d, need=%d", req.GetBookId(), book.GetStock(), req.GetQuantity())
	}

	// 2) 在 book-service 侧扣减库存，跨服务链路中的数据库写操作发生在下游服务中。
	remainStock := book.GetStock() - req.GetQuantity()
	if _, err = s.bookClient.Update(ctx, &bookv1.UpdateBookRequest{
		Id: req.GetBookId(),
		Data: &bookv1.Book{
			Title:  book.Title,
			Author: book.Author,
			Price:  book.Price,
			Stock:  trans.Ptr(remainStock),
		},
	}); err != nil {
		return nil, fmt.Errorf("reserve stock failed: %w", err)
	}

	unitPrice := book.GetPrice()
	totalPrice := unitPrice * float32(req.GetQuantity())
	s.log.Infof("book info from book-service: title=%s price=%.2f", book.GetTitle(), unitPrice)

	// 3) 组装订单并持久化到 trade-service 的订单库。
	order := &tradev1.Order{
		BookId:     trans.Ptr(req.GetBookId()),
		BookTitle:  trans.Ptr(book.GetTitle()),
		Quantity:   trans.Ptr(req.GetQuantity()),
		UnitPrice:  trans.Ptr(unitPrice),
		TotalPrice: trans.Ptr(totalPrice),
		UserId:     trans.Ptr(req.GetUserId()),
		Status:     trans.Ptr(tradev1.OrderStatus_ORDER_STATUS_PENDING),
	}

	return s.orderRepo.Save(ctx, order)
}

func (s *OrderService) Cancel(ctx context.Context, req *tradev1.CancelOrderRequest) (*emptypb.Empty, error) {
	// 4) 取消订单只做本服务库内状态变更，便于演示事务边界。
	if err := s.orderRepo.Cancel(ctx, req); err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
