package data

import (
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/lib/pq"

	"entgo.io/ent/dialect/sql"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/kratos-bootstrap/bootstrap"
	entBootstrap "github.com/tx7do/kratos-bootstrap/database/ent"

	entCrud "github.com/tx7do/go-crud/entgo"

	"go-wind-cms/app/book/service/internal/data/ent"
	"go-wind-cms/app/book/service/internal/data/ent/migrate"
	_ "go-wind-cms/app/book/service/internal/data/ent/runtime"
)

// NewEntClient 创建 book-service 的 Ent ORM 客户端。
// 启动时根据配置自动建表，替代手写 SQL 初始化。
func NewEntClient(ctx *bootstrap.Context) (*entCrud.EntClient[*ent.Client], func(), error) {
	cfg := ctx.GetConfig()
	if cfg == nil || cfg.Data == nil || cfg.Data.Database == nil {
		return nil, func() {}, nil
	}

	l := ctx.NewLoggerHelper("ent/data/book-service")

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
