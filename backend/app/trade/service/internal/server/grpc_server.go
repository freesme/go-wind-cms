package server

import (
	"github.com/go-kratos/kratos/v2/middleware/logging"
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"github.com/tx7do/kratos-bootstrap/bootstrap"
	"github.com/tx7do/kratos-bootstrap/rpc"

	tradev1 "go-wind-cms/api/gen/go/trade/service/v1"
	"go-wind-cms/app/trade/service/internal/service"
)

// NewGrpcServer 创建交易服务 gRPC server
func NewGrpcServer(ctx *bootstrap.Context, orderService *service.OrderService) (*grpc.Server, error) {
	cfg := ctx.GetConfig()
	if cfg == nil || cfg.Server == nil || cfg.Server.Grpc == nil {
		return nil, nil
	}

	srv, err := rpc.CreateGrpcServer(cfg,
		logging.Server(ctx.GetLogger()),
		recovery.Recovery(),
	)
	if err != nil {
		return nil, err
	}

	tradev1.RegisterOrderServiceServer(srv, orderService)

	return srv, nil
}
