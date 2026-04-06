# gow CLI 使用指南

`gow` 是 GoWind 框架的脚手架 CLI 工具，用于创建项目、添加微服务、管理 Ent Schema、Wire 依赖注入和 Proto 文件。

## 安装

```bash
make cli
# 或者单独安装
go install github.com/tx7do/kratos-cli/gowind/cmd/gow@latest
```

## 命令总览

| 命令 | 用途 | 示例 |
|------|------|------|
| `gow add service` | 在现有项目中添加新微服务 | `gow add service book` |
| `gow ent add` | 为服务添加 Ent Schema | `gow ent add book Book,Chapter` |
| `gow ent generate` | 生成 Ent ORM 代码 | `gow ent generate book` |
| `gow wire generate` | 生成 Wire 依赖注入代码 | `gow wire generate book` |
| `gow run` | 运行服务 | `gow run book` |
| `gow new project` | 创建全新项目 | `gow new project my-app` |

---

## 添加新微服务

### 命令

```bash
gow add service <name> [flags]
```

### 参数

| 参数 | 说明 | 默认值 | 可选值 |
|------|------|--------|--------|
| `--servers`, `-s` | 服务器类型 | `grpc` | `grpc`, `rest`, `asynq`, `sse` |
| `--db-clients`, `-d` | 数据库客户端 | `ent` | `ent`, `redis`, `gorm`, `clickhouse` |

### 示例

```bash
# 仅 gRPC + Ent
gow add service book

# gRPC + Ent + Redis
gow add service book --servers grpc --db-clients ent,redis

# gRPC + REST + Ent + Redis + Asynq 任务队列
gow add service trade --servers grpc,rest,asynq --db-clients ent,redis
```

### 生成的目录结构

以 `gow add service book --servers grpc --db-clients ent,redis` 为例：

```
app/book/service/
├── Makefile                              # include ../../../app.mk
├── cmd/server/
│   ├── main.go                           # 服务入口
│   └── wire.go                           # Wire 注入定义
├── configs/
│   ├── server.yaml                       # gRPC/HTTP 服务配置
│   ├── data.yaml                         # 数据库、Redis 连接配置
│   ├── client.yaml                       # gRPC 客户端配置
│   └── logger.yaml                       # 日志配置
└── internal/
    ├── data/providers/wire_set.go        # data 层 Wire ProviderSet
    ├── server/
    │   ├── grpc_server.go                # gRPC Server 创建与服务注册
    │   └── providers/wire_set.go         # server 层 Wire ProviderSet
    └── service/providers/wire_set.go     # service 层 Wire ProviderSet（空）
```

### 生成后需要手动调整的内容

gow 生成的骨架代码和本项目现有服务存在以下差异，需要手动对齐：

#### 1. 服务 ID：统一到 `pkg/serviceid`

gow 会在 `pkg/service/name.go` 中生成服务常量：

```go
// gow 生成的（不符合项目规范）
package service
const BookService = "goWindCms-book-service"
```

**修正方式：** 删除 `pkg/service/name.go`，改为在 `pkg/serviceid/service_id.go` 中添加：

```go
BookService = "book-service" // 小说服务
```

#### 2. main.go：修正 import 和 conf 引用

gow 生成的 `main.go` 引用了 `go-wind-cms/pkg/service` 包和未导入的 `conf` 包。

**修正方式：** 参照 `app/user/service/cmd/server/main.go`，修改为：

```go
import (
    "context"

    "github.com/go-kratos/kratos/v2"
    "github.com/go-kratos/kratos/v2/transport/grpc"

    conf "github.com/tx7do/kratos-bootstrap/api/gen/go/conf/v1"
    "github.com/tx7do/kratos-bootstrap/bootstrap"

    _ "github.com/tx7do/kratos-bootstrap/registry/etcd"
    _ "github.com/tx7do/kratos-bootstrap/tracer"

    "go-wind-cms/pkg/serviceid"
)

// ...

func runApp() error {
    ctx := bootstrap.NewContext(
        context.Background(),
        &conf.AppInfo{
            Project: serviceid.ProjectName,
            AppId:   serviceid.BookService,
            Version: version,
        },
    )
    return bootstrap.RunApp(ctx, initApp)
}
```

主要改动：
- `conf` 包：从 `github.com/tx7do/kratos-bootstrap/api/gen/go/conf/v1` 导入
- `service.Project` → `serviceid.ProjectName`
- `service.BookService` → `serviceid.BookService`
- 取消注释 `registry/etcd` 和 `tracer` 的 import（启用服务注册和链路追踪）
- 删除 `main.go` 中未使用的 `log`、`registry`、`trans` 等 import

#### 3. 补充缺少的配置文件

gow 不会生成 `registry.yaml`、`trace.yaml`、`oss.yaml` 等。从现有服务复制并按需修改：

```bash
cp app/user/service/configs/registry.yaml app/book/service/configs/
cp app/user/service/configs/trace.yaml    app/book/service/configs/
```

#### 4. data.yaml：填写实际连接信息

生成的 `data.yaml` 中数据库和 Redis 密码是占位符，需要替换为实际值。参照 `app/user/service/configs/data.yaml`。

---

## Ent Schema 管理

### 添加 Schema

```bash
# 为 book 服务添加 Book 和 Chapter 两个 Schema
gow ent add book Book,Chapter
```

生成文件位于 `app/book/service/internal/data/ent/schema/`，每个 Schema 一个文件。

### 生成 Ent 代码

```bash
gow ent generate book
# 等价于在 app/book/service/ 下执行 make ent
```

---

## Wire 依赖注入

### 生成 Wire 代码

```bash
gow wire generate book
# 等价于在 app/book/service/ 下执行 make wire
```

---

## 运行服务

```bash
gow run book
# 等价于在 app/book/service/ 下执行 make run
```

---

## 完整的新服务创建流程

以创建 `book` 服务为例，从零到可运行的完整步骤：

```bash
# 1. 生成服务骨架
gow add service book --servers grpc --db-clients ent,redis

# 2. 手动调整（参照上方"生成后需要手动调整的内容"）
#    - 修改 pkg/serviceid/service_id.go 添加 BookService
#    - 修改 main.go 对齐 import
#    - 补充 registry.yaml、trace.yaml
#    - 填写 data.yaml 实际连接信息
#    - 删除 pkg/service/name.go（如有）

# 3. 定义 Proto 服务契约
#    创建 api/protos/book/service/v1/book.proto
#    然后生成代码：
make api

# 4. 添加 Ent Schema
gow ent add book Book,Chapter

# 5. 编辑 Schema 字段后生成 Ent 代码
gow ent generate book

# 6. 实现 Repository（internal/data/）和 Service（internal/service/）

# 7. 在 Wire ProviderSet 中注册新的 Provider

# 8. 在 grpc_server.go 中注册 gRPC 服务

# 9. 生成 Wire 依赖注入代码
gow wire generate book

# 10. 运行服务
gow run book
```

---

## 使用 make 的等价命令

在各服务目录（`app/<name>/service/`）下，也可以用 `make` 完成相同操作：

| gow 命令 | make 等价命令 | 说明 |
|----------|-------------|------|
| `gow ent generate book` | `cd app/book/service && make ent` | 生成 Ent 代码 |
| `gow wire generate book` | `cd app/book/service && make wire` | 生成 Wire 代码 |
| `gow run book` | `cd app/book/service && make run` | 运行服务 |
| - | `make api` | 在根目录生成全部 Proto 代码 |
| - | `make gen` | 一次性生成 ent + wire + api + openapi |
