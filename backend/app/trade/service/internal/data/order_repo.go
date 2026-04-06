package data

import (
	"context"
	"sync"
	"sync/atomic"

	"github.com/go-kratos/kratos/v2/log"
	paginationv1 "github.com/tx7do/go-crud/api/gen/go/pagination/v1"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/tx7do/go-utils/trans"
	tradev1 "go-wind-cms/api/gen/go/trade/service/v1"
)

// OrderRepo 订单仓库（内存实现，用于 Demo）
type OrderRepo struct {
	mu      sync.RWMutex
	orders  map[uint32]*tradev1.Order
	counter atomic.Uint32
	log     *log.Helper
}

func NewOrderRepo(logger log.Logger) *OrderRepo {
	return &OrderRepo{
		orders: make(map[uint32]*tradev1.Order),
		log:    log.NewHelper(logger),
	}
}

func (r *OrderRepo) List(_ context.Context, req *paginationv1.PagingRequest) (*tradev1.ListOrdersResponse, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var orders []*tradev1.Order
	for _, o := range r.orders {
		orders = append(orders, o)
	}
	total := uint64(len(orders))

	if req != nil {
		pageNum, pageSize := int(req.GetPage()), int(req.GetPageSize())
		if pageSize <= 0 {
			pageSize = 10
		}
		if pageNum <= 0 {
			pageNum = 1
		}
		start := (pageNum - 1) * pageSize
		if start >= len(orders) {
			orders = nil
		} else {
			end := start + pageSize
			if end > len(orders) {
				end = len(orders)
			}
			orders = orders[start:end]
		}
	}

	return &tradev1.ListOrdersResponse{Items: orders, Total: total}, nil
}

func (r *OrderRepo) Get(_ context.Context, req *tradev1.GetOrderRequest) (*tradev1.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	o, ok := r.orders[req.GetId()]
	if !ok {
		return nil, status.Errorf(codes.NotFound, "order %d not found", req.GetId())
	}
	return o, nil
}

func (r *OrderRepo) Save(_ context.Context, order *tradev1.Order) (*tradev1.Order, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	id := r.counter.Add(1)
	order.Id = trans.Ptr(id)
	r.orders[id] = order
	r.log.Infof("order saved: id=%d book_id=%d quantity=%d total=%.2f",
		id, order.GetBookId(), order.GetQuantity(), order.GetTotalPrice())
	return order, nil
}

func (r *OrderRepo) Cancel(_ context.Context, req *tradev1.CancelOrderRequest) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	o, ok := r.orders[req.GetId()]
	if !ok {
		return status.Errorf(codes.NotFound, "order %d not found", req.GetId())
	}
	if o.GetStatus() == tradev1.OrderStatus_ORDER_STATUS_CANCELLED {
		return status.Error(codes.FailedPrecondition, "order already cancelled")
	}
	o.Status = trans.Ptr(tradev1.OrderStatus_ORDER_STATUS_CANCELLED)
	return nil
}
