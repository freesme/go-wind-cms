package data

import (
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/lib/pq"

	"entgo.io/ent/dialect/sql"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/registry"
	entCrud "github.com/tx7do/go-crud/entgo"
	bootstrap "github.com/tx7do/kratos-bootstrap/bootstrap"
	entBootstrap "github.com/tx7do/kratos-bootstrap/database/ent"
	bRegistry "github.com/tx7do/kratos-bootstrap/registry"
	"github.com/tx7do/kratos-bootstrap/rpc"

	bookv1 "go-wind-cms/api/gen/go/book/service/v1"
	"go-wind-cms/app/trade/service/internal/data/ent"
	"go-wind-cms/app/trade/service/internal/data/ent/migrate"
	_ "go-wind-cms/app/trade/service/internal/data/ent/runtime"
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

// NewEntClient 创建 trade-service 的 Ent ORM 客户端。
// 订单落库与更新都通过 ent 实体进行，确保类型安全与迁移一致。
func NewEntClient(ctx *bootstrap.Context) (*entCrud.EntClient[*ent.Client], func(), error) {
	cfg := ctx.GetConfig()
	if cfg == nil || cfg.Data == nil || cfg.Data.Database == nil {
		return nil, func() {}, nil
	}

	l := ctx.NewLoggerHelper("ent/data/trade-service")

	cli, err := entBootstrap.NewEntClient(cfg, func(drv *sql.Driver) *ent.Client {
		client := ent.NewClient(
			ent.Driver(drv),
			ent.Log(func(a ...any) {
				l.Debug(a...)
			}),
		)
		if client == nil {
			l.Fatalf("[ENT] failed creating ent client")
			return nil
		}

		if cfg.Data.Database.GetMigrate() {
			if err := client.Schema.Create(ctx.Context(), migrate.WithForeignKeys(true)); err != nil {
				l.Fatalf("[ENT] failed creating schema resources: %v", err)
			}
		}

		return client
	})
	if err != nil {
		log.Fatalf("[ENT] failed creating ent client: %v", err)
		return nil, func() {}, err
	}

	if cli == nil {
		return nil, func() {}, nil
	}

	return cli, func() {
		if err := cli.Close(); err != nil {
			l.Error(err)
		}
	}, nil
}

// NewBookServiceClient 创建 book-service 的 gRPC 客户端。
// trade-service 通过服务发现连接到 book-service，实现跨服务调用。
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
