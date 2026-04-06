package server

import (
	"github.com/go-kratos/kratos/v2/middleware/logging"
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"github.com/tx7do/kratos-bootstrap/bootstrap"
	"github.com/tx7do/kratos-bootstrap/rpc"

	bookv1 "go-wind-cms/api/gen/go/book/service/v1"
	"go-wind-cms/app/book/service/internal/service"
)

// NewGrpcServer 创建书籍服务 gRPC server
func NewGrpcServer(ctx *bootstrap.Context, bookService *service.BookService) (*grpc.Server, error) {
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

	bookv1.RegisterBookServiceServer(srv, bookService)

	return srv, nil
}
