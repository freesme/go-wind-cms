package service

import (
	"context"
	"fmt"

	"github.com/go-kratos/kratos/v2/log"
	paginationv1 "github.com/tx7do/go-crud/api/gen/go/pagination/v1"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/tx7do/go-utils/trans"
	bookv1 "go-wind-cms/api/gen/go/book/service/v1"
	tradev1 "go-wind-cms/api/gen/go/trade/service/v1"
	"go-wind-cms/app/trade/service/internal/data"
)

// OrderService 订单服务实现
// 演示跨服务调用：CreateOrder 时调用 book-service.Get 获取书籍信息
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
// 跨服务调用演示：通过 gRPC 调用 book-service 获取书籍信息，计算总价后保存订单
func (s *OrderService) CreateOrder(ctx context.Context, req *tradev1.CreateOrderRequest) (*tradev1.Order, error) {
	if req.GetBookId() == 0 {
		return nil, fmt.Errorf("book_id is required")
	}
	if req.GetQuantity() <= 0 {
		return nil, fmt.Errorf("quantity must be greater than 0")
	}

	// 跨服务调用：从 book-service 获取书籍信息
	s.log.Infof("calling book-service to get book info: book_id=%d", req.GetBookId())
	book, err := s.bookClient.Get(ctx, &bookv1.GetBookRequest{Id: req.GetBookId()})
	if err != nil {
		s.log.Errorf("failed to get book from book-service: %v", err)
		return nil, fmt.Errorf("book not found: %w", err)
	}

	unitPrice := book.GetPrice()
	totalPrice := unitPrice * float32(req.GetQuantity())

	s.log.Infof("book info received from book-service: title=%s price=%.2f", book.GetTitle(), unitPrice)

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
	if err := s.orderRepo.Cancel(ctx, req); err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
