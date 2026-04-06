package service

import (
	"context"

	"github.com/go-kratos/kratos/v2/log"

	appV1 "go-wind-cms/api/gen/go/app/service/v1"
	identityV1 "go-wind-cms/api/gen/go/identity/service/v1"
	tradeV1 "go-wind-cms/api/gen/go/trade/service/v1"

	"go-wind-cms/pkg/middleware/auth"
)

// OrderService 是 app 的订单编排服务。
// 它不直接落库，只负责编排鉴权、用户校验和 trade-service 调用。
type OrderService struct {
	appV1.OrderServiceHTTPServer

	logger      *log.Helper
	userClient  identityV1.UserServiceClient
	tradeClient tradeV1.OrderServiceClient
}

// NewOrderService 构建订单服务实例。
func NewOrderService(
	logger log.Logger,
	userClient identityV1.UserServiceClient,
	tradeClient tradeV1.OrderServiceClient,
) *OrderService {
	return &OrderService{
		logger:      log.NewHelper(logger),
		userClient:  userClient,
		tradeClient: tradeClient,
	}
}

func (s *OrderService) CreateOrder(ctx context.Context, req *appV1.CreateOrderRequest) (*tradeV1.Order, error) {
	// 1) 从鉴权中间件上下文读取操作者信息，避免前端直接传入 userId。
	operator, err := auth.FromContext(ctx)
	if err != nil {
		return nil, err
	}

	// 2) 调用 user-service 做“用户存在性”校验，确保下单人是有效用户。
	//    该校验依赖 user-service 的数据库查询结果。
	if _, err = s.userClient.Get(ctx, &identityV1.GetUserRequest{
		QueryBy: &identityV1.GetUserRequest_Id{
			Id: operator.UserId,
		},
	}); err != nil {
		return nil, err
	}

	// 3) 调用 trade-service 下单，trade-service 会继续调用 book-service 并落库存/订单库。
	order, err := s.tradeClient.CreateOrder(ctx, &tradeV1.CreateOrderRequest{
		BookId:   req.GetBookId(),
		Quantity: req.GetQuantity(),
		UserId:   operator.UserId,
	})
	if err != nil {
		return nil, err
	}

	s.logger.Infof("place order success, user=%d, order=%d", operator.UserId, order.GetId())
	return order, nil
}
