package data

import (
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/registry"
	"github.com/tx7do/kratos-bootstrap/bootstrap"
	bRegistry "github.com/tx7do/kratos-bootstrap/registry"
	"github.com/tx7do/kratos-bootstrap/rpc"

	bookv1 "go-wind-cms/api/gen/go/book/service/v1"
	"go-wind-cms/pkg/serviceid"
)

// NewDiscovery 创建服务发现客户端
func NewDiscovery(ctx *bootstrap.Context) registry.Discovery {
	cfg := ctx.GetConfig()
	if cfg == nil || cfg.Registry == nil {
		return nil
	}
	r, err := bRegistry.NewDiscovery(cfg.Registry)
	if err != nil {
		log.Errorf("create discovery failed: %v", err)
		return nil
	}
	return r
}

// NewBookServiceClient 创建 book-service 的 gRPC 客户端
// trade-service 通过服务发现连接到 book-service，实现跨服务调用
func NewBookServiceClient(ctx *bootstrap.Context, r registry.Discovery) bookv1.BookServiceClient {
	conn, err := rpc.CreateGrpcClient(
		ctx.Context(),
		r,
		serviceid.NewDiscoveryName(serviceid.BookService),
		ctx.GetConfig(),
	)
	if err != nil {
		log.Fatalf("connect to book-service failed: %v", err)
	}
	return bookv1.NewBookServiceClient(conn)
}
