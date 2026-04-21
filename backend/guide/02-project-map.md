# 02. 项目地图

这一篇解决的问题是：

- 这个仓库的顶层目录都是什么
- 哪些目录是手写代码，哪些是生成结果
- 做需求时应该先去哪里找
- 新手最容易看错的目录有哪些

## 先看顶层结构

当前仓库最重要的顶层目录是：

```text
backend/
├─ api/
├─ app/
├─ guide/
├─ pkg/
├─ scripts/
├─ sql/
├─ Makefile
├─ README.md
├─ STARTUP.md
└─ SERVICE_API_PLAYBOOK.md
```

可以按下面方式理解：

| 目录 / 文件 | 主要职责 |
|---|---|
| `api/` | API 合同定义和生成代码 |
| `app/` | 各个运行时服务 |
| `guide/` | 这套新手教程 |
| `pkg/` | 共享组件和基础包 |
| `scripts/` | 环境、Docker、Proto 辅助脚本 |
| `sql/` | SQL 脚本和演示数据 |
| `Makefile` | 根级命令入口 |

## `api/` 是什么

```text
api/
├─ protos/
├─ gen/
└─ third_party/
```

### `api/protos/`

这是 API 合同的源头。

你会在这里看到：

- 领域 gRPC proto
- admin HTTP proto
- app HTTP proto
- 通用 message、错误定义、分页定义等引用

原则：

- 想改接口，先改这里
- 不要先改生成后的 Go 文件

### `api/gen/go/`

这是 `buf generate` 产出的 Go 代码。

包括：

- protobuf message
- gRPC client / server 接口
- HTTP binding
- validate
- redact
- errors

原则：

- 把它当生成物，不当手写代码
- 出现“接口不存在”“方法没生成”，先检查是不是忘了 `make api`

### `api/third_party/`

这是 proto 依赖辅助目录，主要给 IDE 用。

如果 GoLand 报：

- `Cannot resolve import 'google/api/annotations.proto'`
- `Cannot resolve import 'validate/validate.proto'`

优先看：

- [../scripts/proto/README.md](../scripts/proto/README.md)

## `app/` 是什么

`app/` 下面每个一级目录基本代表一个服务域。

当前你会看到：

```text
app/
├─ admin/
├─ app/
├─ book/
├─ core/
├─ trade/
└─ user/
```

但新手最需要记住的是：

- `app/user/service` 才是当前真实的核心后端主目录
- `app/admin/service` 是后台 BFF
- `app/app/service` 是前台 BFF
- `app/book/service` 和 `app/trade/service` 是独立 gRPC 服务扩展
- `app/core/service` 目前不是主源码开发入口

## 一个标准服务目录长什么样

当前仓库的标准服务结构基本是这样：

```text
app/<name>/service/
├─ cmd/server/
├─ configs/
├─ internal/data/
├─ internal/server/
├─ internal/service/
└─ Makefile
```

### `cmd/server/`

这是服务的启动入口。

通常包含：

- `main.go`
- `wire.go`
- `wire_gen.go`

理解方式：

- `main.go` 负责启动应用
- `wire.go` 声明依赖注入
- `wire_gen.go` 是生成出来的装配结果

### `configs/`

放当前服务自己的配置文件。

### `internal/data/`

这是基础设施接入和数据访问层。

通常会放：

- gRPC client
- repo
- Ent client
- Redis / MinIO / Discovery 接入

### `internal/server/`

这是对外 server 注册层。

通常会放：

- gRPC server 注册
- HTTP server 注册
- SSE server 注册

### `internal/service/`

这是服务逻辑层，但不同服务含义不同：

- 在 `user-service(core)` 中，这里是核心领域逻辑
- 在 `admin-service` 和 `app-service` 中，这里更多是接口编排逻辑

这点很重要，不能一概而论。

## `pkg/` 是什么

`pkg/` 放的是共享组件和基础包。

当前重要子目录包括：

| 目录 | 主要作用 |
|---|---|
| `pkg/serviceid` | 服务名与服务发现标识 |
| `pkg/middleware` | 鉴权、日志、上下文等中间件 |
| `pkg/jwt` | JWT 相关 |
| `pkg/metadata` | 操作者、上下文元信息 |
| `pkg/oss` | 对象存储能力 |
| `pkg/content` | 内容相关共用能力 |
| `pkg/crypto` | 加解密能力 |
| `pkg/eventbus` | 事件总线 |
| `pkg/lua` | Lua 扩展运行时 |
| `pkg/utils` | 工具函数 |

你不需要一开始就全会，但要知道：

- 这层是共享包
- 这里的改动通常比你想象的影响面更大

## `scripts/` 是什么

这里放辅助脚本和开发工具链说明。

主要用途：

- 环境安装
- Docker 启停
- Proto 依赖导出
- 部署脚本

新手最常用的是：

- [../scripts/README.md](../scripts/README.md)
- [../scripts/proto/README.md](../scripts/proto/README.md)

## 生成代码与手写代码怎么区分

做需求时，这个判断非常重要。

### 主要手写区域

- `api/protos/`
- `app/*/service/internal/**/*.go`
- `app/*/service/cmd/server/main.go`
- `app/*/service/configs/*.yaml`
- `pkg/**/*.go`

### 主要生成区域

- `api/gen/go/`
- `app/*/service/cmd/server/wire_gen.go`
- `app/*/service/internal/data/ent/`

原则：

- 先改手写源头，再跑生成命令
- 不要把生成文件当成最终维护入口

## 做需求时先去哪里找

### 场景 1：你想加一个后台接口

优先看：

- `api/protos/admin/service/v1/`
- `app/admin/service/internal/service/`
- `app/admin/service/internal/server/rest_server.go`
- `app/admin/service/internal/data/data.go`

### 场景 2：你想加一个前台接口

优先看：

- `api/protos/app/service/v1/`
- `app/app/service/internal/service/`
- `app/app/service/internal/server/rest_server.go`
- `app/app/service/internal/data/data.go`

### 场景 3：你想加一个核心领域能力

优先看：

- 领域 proto
- `app/user/service/internal/service/`
- `app/user/service/internal/data/`
- `app/user/service/internal/server/grpc_server.go`

### 场景 4：你想看服务之间怎么连

优先看：

- `pkg/serviceid/service_id.go`
- 各服务 `internal/data/data.go`
- 各服务 `cmd/server/wire_gen.go`

## 这个仓库最容易看错的几个点

### 1. 被 `core-service` 这个名字误导

概念上是核心服务没错，但当前真实代码主目录是：

```text
app/user/service
```

### 2. 以为 `internal/service` 在所有服务里含义都一样

不是。

- 在核心后端里，它更偏“领域服务实现”
- 在 admin/app 里，它更偏“接口编排层”

### 3. 直接改 `api/gen/go`

这是生成物，不是设计源头。

### 4. 看见 `app/core/service` 就以为应该去那里开发

当前不应该。

## 这一步完成后你应该掌握什么

读完本篇，你应该已经知道：

- 顶层目录和服务目录分别负责什么
- 哪些地方是手写源头，哪些地方是生成结果
- 遇到不同需求时先去哪个目录找

下一篇请读 [03-runtime-architecture.md](03-runtime-architecture.md)。
