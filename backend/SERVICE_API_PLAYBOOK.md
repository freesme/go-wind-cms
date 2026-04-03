# GoWind Backend 新服务与 API 开发手册

本文基于当前 `backend/` 仓库的真实结构整理，不是假设性的 Kratos 模板文档。

目标：

- 说明在这个仓库里，什么时候应该“新建独立服务”，什么时候应该“继续放在 core-service 里”
- 说明如果你要新增一个 `trade` 领域，完整流程应该怎么走
- 说明新增单个 API 时，单服务调用和多服务编排分别怎么做
- 标出当前仓库里哪些部分可以直接复用，哪些地方必须新增或调整

---

## 1. 先判断：你要的是“新领域”还是“新进程”

当前仓库不是“一个领域一个微服务”的结构，而是：

- `admin-service`
  - 面向后台管理端
  - 对外提供 REST / SSE
  - 本身不持有核心业务数据
  - 主要通过 gRPC 调 `core-service`
- `app-service`
  - 面向前台客户端
  - 对外提供 REST / SSE
  - 本身不持有核心业务数据
  - 主要通过 gRPC 调 `core-service`
- `core-service`
  - 核心领域服务
  - 对内提供 gRPC
  - 真正持有数据库、缓存、对象存储、任务、搜索等能力
  - 绝大部分实体和业务规则都放在这里

这意味着：

- 如果你只是给现有系统增加“订单、交易”业务能力，且它仍属于平台核心域，优先做法通常不是新起一个独立进程，而是先把 `trade` 领域加到 `core-service`
- 只有当 `trade` 需要独立部署、独立扩缩容、独立数据边界、独立演进周期、独立事务边界时，才建议新建 `app/trade/service`

### 推荐判断标准

优先继续放在 `core-service` 的情况：

- 订单/交易只是平台核心业务的一部分
- 读写同一套主库即可
- 不需要独立发布
- 主要调用方仍然是 `admin-service` 和 `app-service`
- 事务大多发生在同一个数据边界内

优先新建 `trade-service` 的情况：

- 交易域复杂度明显高，已经不适合继续塞进 `core-service`
- 需要单独扩容或隔离风险
- 希望和内容、身份、权限等能力解耦
- 有明确的数据拥有权边界
- 后续会有更多服务直接依赖 trade，而不是都经由 core

结论：

- 从当前仓库的架构习惯看，`trade` 第一阶段更适合先做成 `core-service` 下的新领域模块
- 如果你确认未来会独立部署，再按下面“独立 trade-service”流程做

---

## 2. 当前仓库里可直接复用的部分

### 2.1 服务骨架可复用

任何新服务基本都可以复用这套骨架：

- `app/<name>/service/cmd/server/main.go`
- `app/<name>/service/cmd/server/wire.go`
- `app/<name>/service/internal/data/providers/wire_set.go`
- `app/<name>/service/internal/service/providers/wire_set.go`
- `app/<name>/service/internal/server/providers/wire_set.go`
- `app/<name>/service/Makefile`

`Makefile` 直接复用现有模式即可：

```makefile
include ../../../app.mk
```

只要目录是 `app/<name>/service/Makefile`，根目录 `Makefile` 就会自动把它纳入：

- `make wire`
- `make ent`
- `make build`
- `make all`

### 2.2 配置文件模板可复用

常见配置文件：

- `configs/server.yaml`
- `configs/registry.yaml`
- `configs/client.yaml`
- `configs/remote.yaml`
- `configs/trace.yaml`
- `configs/data.yaml`
- `configs/oss.yaml`
- `configs/authenticator.yaml`

复用建议：

- 新的 gRPC 业务服务，至少需要 `server.yaml`、`registry.yaml`、`client.yaml`、`remote.yaml`、`trace.yaml`
- 如果服务自己连数据库/Redis/ES，则加 `data.yaml`
- 如果服务自己处理对象存储，则加 `oss.yaml`
- 如果服务自己签发/校验 token，则才需要 `authenticator.yaml`

### 2.3 代码生成链路可复用

仓库已经有完整生成链路：

- `make api`
  - 生成 Go protobuf / gRPC / HTTP / errors / validate / redact 代码
- `make openapi`
  - 生成 admin/app 的 OpenAPI 文档
- `make ts`
  - 生成前端 TypeScript SDK
- `make ent`
  - 生成 Ent ORM 代码
- `make wire`
  - 生成依赖注入代码

### 2.4 通用基础组件可复用

已经封装好的能力：

- 服务发现：Etcd
- gRPC Client 创建：`rpc.CreateGrpcClient(...)`
- 服务名规范：`pkg/serviceid`
- Redis Client
- Ent Client
- MinIO Client
- Trace
- DTM / workflow
- 统一鉴权中间件
- API / 登录审计中间件
- metadata / operator 注入

### 2.5 最值得参考的样板

#### 新增 core 领域时参考

- `app/core/service/internal/server/grpc_server.go`
- `app/core/service/internal/service/user_service.go`
- `app/core/service/internal/data/user_repo.go`
- `app/core/service/internal/data/ent/schema/user.go`

#### 新增 admin BFF 接口时参考

- 简单透传：`app/admin/service/internal/service/tag_service.go`
- 多服务编排：`app/admin/service/internal/service/user_service.go`
- 聚合接口：`app/admin/service/internal/service/admin_portal_service.go`
- 文件类特殊接口：`app/admin/service/internal/service/file_transfer_service.go`

#### 新增 app BFF 接口时参考

- 简单透传：`app/app/service/internal/service/post_service.go`
- 当前用户上下文接口：`app/app/service/internal/service/user_profile_service.go`

---

## 3. 新建独立 trade-service 的完整流程

这一节适用于你明确要新增一个新进程 `app/trade/service`。

### 3.1 先定边界

先写清楚以下问题，否则后面会越做越乱：

- `trade-service` 是否自己持有订单/交易表
- `trade-service` 是否允许别的服务直接写它的表
- `trade-service` 是否只暴露 gRPC
- 对外 REST 是不是仍然通过 `admin-service` / `app-service`
- 跨服务事务如何处理

建议：

- `trade-service` 自己拥有订单和交易相关表
- 其他服务不直接写 trade 的库表
- 对外 REST 仍然放在 `admin-service` / `app-service`
- `trade-service` 初期只暴露 gRPC

这样最符合当前仓库风格，也最省改动。

### 3.2 新建目录

建议直接对照 `app/core/service` 的骨架创建：

```text
app/trade/service/
├─ Makefile
├─ cmd/server/
│  ├─ main.go
│  └─ wire.go
├─ configs/
│  ├─ server.yaml
│  ├─ registry.yaml
│  ├─ client.yaml
│  ├─ remote.yaml
│  ├─ trace.yaml
│  ├─ data.yaml           # 如果 trade 自己连数据库/Redis
│  └─ oss.yaml            # 如果 trade 自己需要对象存储
├─ internal/
│  ├─ data/
│  │  ├─ providers/wire_set.go
│  │  ├─ data.go
│  │  ├─ ent_client.go    # 如果用 Ent
│  │  ├─ ent/schema/
│  │  └─ *_repo.go
│  ├─ server/
│  │  ├─ providers/wire_set.go
│  │  └─ grpc_server.go
│  └─ service/
│     ├─ providers/wire_set.go
│     └─ *_service.go
```

### 3.3 注册服务 ID

修改 `pkg/serviceid/service_id.go`：

- 新增 `TradeService = "trade-service"`

用途：

- `main.go` 里 `AppId` 要用
- 其他服务调用 trade 时要用
- 服务发现名统一通过 `pkg/serviceid.NewDiscoveryName(...)` 构造

### 3.4 创建 proto

在 `api/protos/trade/service/v1/` 下新增：

- `trade.proto`
- `trade_error.proto`
- 如果拆得更细，也可以用 `order.proto`、`payment.proto`、`refund.proto`

建议：

- “领域服务 proto” 单独放一套，不要混进 `admin/service/v1` 或 `app/service/v1`
- 领域 proto 定义 gRPC 契约，不直接承担前台/后台 REST 风格

一个典型例子：

```proto
syntax = "proto3";

package trade.service.v1;

import "google/protobuf/empty.proto";
import "pagination/v1/pagination.proto";

service OrderService {
  rpc List (pagination.PagingRequest) returns (ListOrderResponse) {}
  rpc Get (GetOrderRequest) returns (Order) {}
  rpc Create (CreateOrderRequest) returns (Order) {}
  rpc Update (UpdateOrderRequest) returns (google.protobuf.Empty) {}
  rpc Cancel (CancelOrderRequest) returns (google.protobuf.Empty) {}
}
```

### 3.5 生成 API 代码

在 `backend/` 根目录执行：

```bash
make api
```

如果 trade 只是 gRPC 内部服务，到这里不需要额外 OpenAPI 模板。

注意：

- 当前仓库只有 `admin` 和 `app` 的 OpenAPI 生成模板
- 如果你让 `trade-service` 自己直接暴露 REST，则还要新增类似 `buf.trade.openapi.gen.yaml` 的模板，并接入自己的 swagger asset 注册逻辑

### 3.6 创建数据层

如果 trade 自己持有数据，按 `core-service` 的模式做：

1. 在 `app/trade/service/internal/data/ent/schema/` 下新增 Ent schema
2. 在 `*_repo.go` 里实现 repo
3. 在 `ent_client.go` 里复用现有 `NewEntClient` 模式
4. 在 `providers/wire_set.go` 里注册 repo 和 client

建议：

- trade 独立服务最好拥有自己的表，至少逻辑上必须由 trade 拥有
- 即使和 core 共用一个数据库实例，也不要让 core 直接写 trade 的表

### 3.7 创建 service 实现

在 `app/trade/service/internal/service/` 下实现 gRPC service：

- 结构体嵌入 `tradeV1.UnimplementedXxxServiceServer`
- 构造函数 `NewXxxService(...)`
- 业务逻辑放 service 层
- repo 访问放 data 层

建议职责划分：

- `service`
  - 业务规则
  - 事务编排
  - DTO 拼装
- `data/repo`
  - 纯数据访问
  - 查询、保存、更新、删除
  - 不要塞太多业务判断

### 3.8 注册 provider

新增构造函数后，记得同步到三个 provider set：

- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`
- `internal/server/providers/wire_set.go`

如果漏了，`wire` 不会把依赖串起来。

### 3.9 注册 gRPC server

在 `app/trade/service/internal/server/grpc_server.go` 中：

- 注入你的 `OrderService` / `TradeService`
- 调用 `tradeV1.RegisterOrderServiceServer(...)`

这是服务真正对外暴露 gRPC 的地方。

### 3.10 生成 ent / wire / build

在 `app/trade/service/` 执行：

```bash
make ent
make wire
make build
```

如果你改了 proto，也可以先在根目录：

```bash
make api
```

### 3.11 如果 admin/app 需要访问 trade

你通常不会直接把 `trade-service` 暴露给浏览器，而是继续走 BFF：

- 后台入口放 `api/protos/admin/service/v1/i_trade.proto`
- 前台入口放 `api/protos/app/service/v1/i_trade.proto`
- 在 `admin-service` / `app-service` 内部创建 gRPC client 调 trade
- 然后通过 HTTP Server 注册出去

### 3.12 接入部署

如果你要让 `docker compose` 启动它，还要补这些：

- `docker-compose.yaml` 增加 `trade-service`
- `build.args.SERVICE_NAME: trade`
- 按需配置端口、依赖、环境变量

好处是当前 `Dockerfile` 已经是通用的，只认：

- `SERVICE_NAME`
- `./app/${SERVICE_NAME}/service/cmd/server/`

所以不需要再写一份新的 Dockerfile。

---

## 4. 更符合当前仓库习惯的做法：把 trade 先加到 core-service

如果你的 `trade` 只是新领域，而不是必须拆成新进程，这一节更值得优先采用。

### 4.1 核心思路

做法不是新建 `app/trade/service`，而是：

1. 在 `api/protos/trade/service/v1/` 定义领域 gRPC
2. 在 `app/core/service/internal/data/` 增加 trade repo 和 ent schema
3. 在 `app/core/service/internal/service/` 增加 trade service
4. 在 `app/core/service/internal/server/grpc_server.go` 注册 trade gRPC
5. 如果后台需要 HTTP 接口，再在 `api/protos/admin/service/v1/` 加 `i_trade.proto`
6. 如果前台需要 HTTP 接口，再在 `api/protos/app/service/v1/` 加 `i_trade.proto`
7. 在 `admin-service` / `app-service` 内注入 trade client 并做 BFF 封装

### 4.2 这一方案的优势

- 最符合当前项目结构
- 不需要新增第四个进程
- 不需要额外维护新的 compose 服务
- admin / app 当前也已经天然依赖 `core-service`
- 绝大多数公共基础设施配置已经在 core 里就绪

### 4.3 你需要新增的地方

#### 在 core-service 中新增

- `api/protos/trade/service/v1/*.proto`
- `app/core/service/internal/data/ent/schema/order.go`
- `app/core/service/internal/data/ent/schema/trade.go`
- `app/core/service/internal/data/order_repo.go`
- `app/core/service/internal/data/trade_repo.go`
- `app/core/service/internal/service/order_service.go`
- `app/core/service/internal/service/trade_service.go`

以及注册点：

- `app/core/service/internal/data/providers/wire_set.go`
- `app/core/service/internal/service/providers/wire_set.go`
- `app/core/service/internal/server/grpc_server.go`

#### 在 admin-service 中新增

- `api/protos/admin/service/v1/i_trade.proto`
- `app/admin/service/internal/data/data.go` 里的 `NewOrderServiceClient` / `NewTradeServiceClient`
- `app/admin/service/internal/data/providers/wire_set.go`
- `app/admin/service/internal/service/trade_service.go`
- `app/admin/service/internal/service/providers/wire_set.go`
- `app/admin/service/internal/server/rest_server.go`

#### 在 app-service 中新增

如果前台需要订单接口，再做同样一套：

- `api/protos/app/service/v1/i_trade.proto`
- `app/app/service/internal/data/data.go`
- `app/app/service/internal/data/providers/wire_set.go`
- `app/app/service/internal/service/trade_service.go`
- `app/app/service/internal/service/providers/wire_set.go`
- `app/app/service/internal/server/rest_server.go`

---

## 5. 新建“单个 API”的流程文档

下面分两类：

- 单个服务调用接口
- 多服务间调用 / 多下游编排接口

---

## 6. 单个服务调用接口：标准流程

这里的“单个服务调用”指的是：

- 一个 HTTP API 最终只调用一个下游 gRPC service
- 或一个 gRPC 方法最终只落到本服务自己的一个 repo / 聚合逻辑

典型样板：

- `app/app/service/internal/service/post_service.go`
- `app/admin/service/internal/service/tag_service.go`

### 6.1 第一步：确定接口属于哪一层

先判断接口放哪：

- 放 `core-service`
  - 当它是领域能力
  - 会直接持久化
  - 会被多个入口复用
- 放 `admin-service`
  - 当它是后台专属 REST 接口
  - 只是包装后台场景参数、鉴权、审计、转发
- 放 `app-service`
  - 当前台专属 REST 接口
  - 当前用户上下文、前台协议、前台聚合逻辑都在这里

### 6.2 第二步：定义 proto

#### 如果是 core 领域接口

在领域 proto 下新增 rpc，例如：

```proto
rpc GetOrder (GetOrderRequest) returns (Order) {}
```

#### 如果是 admin/app HTTP 接口

在 `i_*.proto` 里新增 rpc，并加 `google.api.http`：

```proto
rpc GetOrder (trade.service.v1.GetOrderRequest) returns (trade.service.v1.Order) {
  option (google.api.http) = {
    get: "/admin/v1/orders/{id}"
  };
}
```

建议：

- admin/app 层优先直接复用 core 的 request / response message，避免再造一套 DTO
- 只有前台/后台协议真的不同，才新定义专用 message

### 6.3 第三步：生成代码

```bash
make api
```

如果改了 admin/app proto，还要：

```bash
make openapi
make ts
```

### 6.4 第四步：实现 service

#### core-service 中

在 `internal/service/xxx_service.go` 实现方法：

- 校验参数
- 调 repo
- 必要时做领域规则
- 返回 proto DTO

#### admin/app 中

在 `internal/service/xxx_service.go` 实现方法：

- 读取 operator / token 上下文
- 补齐 `tenantId`、`createdBy`、`updatedBy`
- 调一个下游 gRPC client
- 返回结果

### 6.5 第五步：注册依赖

如果新增了一个新的 service struct 或 client：

- data provider set 注册 client constructor
- service provider set 注册 service constructor

### 6.6 第六步：注册 server

#### core-service

在 `internal/server/grpc_server.go` 里：

- `tradeV1.RegisterOrderServiceServer(srv, orderService)`

#### admin/app

在 `internal/server/rest_server.go` 里：

- `adminV1.RegisterOrderServiceHTTPServer(srv, orderService)`
- 或 `appV1.RegisterOrderServiceHTTPServer(srv, orderService)`

### 6.7 第七步：构建验证

建议最少执行：

```bash
make api
make wire
make build
```

如果 core 的 ent schema 变了，再加：

```bash
make ent
```

---

## 7. 多服务间调用接口：标准流程

这里的“多服务间调用”指的是一个 API 会编排多个下游，例如：

- 先查用户，再查角色，再查权限，再拼菜单
- 先上传 MinIO，再写文件元数据，再写媒体资源
- 先查主实体，再查关联资源，再组合返回

典型样板：

- `app/admin/service/internal/service/user_service.go`
- `app/admin/service/internal/service/admin_portal_service.go`
- `app/admin/service/internal/service/file_transfer_service.go`

### 7.1 什么时候适合做多服务编排

适合放在 BFF 的情况：

- 这是后台专属或前台专属接口
- 不同终端看到的协议不同
- 主要是参数补齐、权限校验、字段裁剪、聚合返回

适合下沉到核心域服务的情况：

- 这是多个入口共享的业务规则
- 需要强事务一致性
- 逻辑不应依赖某个前端页面形态

### 7.2 推荐编排顺序

建议按下面顺序写：

1. 参数校验
2. 获取 operator / tenant / user context
3. 查询前置依赖
4. 主操作
5. 关联操作
6. 副作用操作
7. 返回聚合结果

比如“创建订单”可按这种顺序：

1. 校验商品、价格、库存参数
2. 取当前用户和租户
3. 查询用户状态、商品状态、优惠券状态
4. 创建订单主单
5. 创建订单明细
6. 扣减库存 / 发送事件 / 记录审计
7. 返回订单详情

### 7.3 依赖注入怎么做

如果一个 API 需要调用多个下游：

- 在 service struct 上注入多个 client / repo
- 不要在方法体里临时创建 gRPC client
- 所有 client 都通过 `internal/data/data.go` + provider set 注入

例子：

```go
type TradeService struct {
    orderClient inventoryV1.OrderServiceClient
    couponClient promotionV1.CouponServiceClient
    paymentClient paymentV1.PaymentServiceClient
}
```

### 7.4 事务边界怎么处理

这是最容易做错的地方。

#### 同一服务、同一数据库边界内

用本地事务，参考 `core-service` repo 的做法。

适用：

- trade 自己的订单表
- trade 自己的订单明细表
- trade 自己的交易流水表

#### 跨服务边界

不要试图用一个本地数据库事务包住多个服务。

可选策略：

- 最终一致性
- 事件驱动
- DTM / workflow
- 明确补偿逻辑

当前仓库已经预留了 DTM / workflow 接入能力，但并不是所有接口都需要上分布式事务。

建议：

- 能放在同一数据拥有者里的逻辑，尽量不要拆跨服务
- 跨服务只做真正需要边界隔离的事情

### 7.5 返回模型怎么设计

多服务编排接口有两种做法：

- 直接复用下游模型
- 定义聚合响应模型

建议：

- 如果只是把一个下游原样透出，复用原模型
- 如果是“菜单 + 权限码 + 用户摘要”这类组合结果，定义新 response

### 7.6 错误处理建议

多下游接口要特别注意：

- 哪一步失败直接返回
- 哪一步失败可以降级
- 哪一步失败必须补偿

不要把所有错误都变成统一的 “internal error”。

建议最少区分：

- 参数错误
- 前置校验失败
- 下游依赖失败
- 状态冲突
- 资源不存在

---

## 8. 新建 API 时最容易漏掉的清单

### 8.1 改了 proto，但忘了生成代码

表现：

- 编译找不到新方法
- server register 不存在

处理：

```bash
make api
```

### 8.2 改了 ent schema，但忘了生成 ent

表现：

- `ent` 包里没有新实体或字段

处理：

```bash
make ent
```

### 8.3 新增构造函数，但忘了加进 wire provider set

表现：

- `wire` 无法生成
- 缺 provider

处理：

- 检查三个 `providers/wire_set.go`

### 8.4 实现了 service，但忘了注册 server

表现：

- 编译通过，但接口访问 404 或 gRPC 方法不存在

处理：

- 检查 `internal/server/grpc_server.go`
- 检查 `internal/server/rest_server.go`

### 8.5 admin/app 里新增了 HTTP API，但忘了更新 OpenAPI / TS SDK

处理：

```bash
make openapi
make ts
```

### 8.6 新独立服务建好了，但忘了接 compose

表现：

- 本地依赖都在，但服务没启动

处理：

- 更新 `docker-compose.yaml`

### 8.7 新服务能启动，但别人调不到

重点排查：

- `pkg/serviceid` 是否新增常量
- `main.go` 的 `AppId` 是否正确
- `remote.yaml` 的 etcd key 是否正确
- `registry.yaml` 是否正确
- client 调用时是否用了 `serviceid.NewDiscoveryName(...)`

### 8.8 文件上传类接口直接靠代码生成 HTTP Handler，结果不好用

当前仓库已有明确样板：

- `file_transfer` 这类接口需要手工注册 handler
- 不能完全依赖代码生成出来的标准 handler

如果你的 trade 接口涉及：

- 上传凭证
- 文件直传
- 二进制下载

优先参考 `file_transfer` 的实现方式。

---

## 9. 给 trade 的实际建议

如果你现在要做“订单、交易”能力，建议按下面优先级选：

### 方案 A：优先推荐

先把 `trade` 做成 `core-service` 下的新领域：

- `api/protos/trade/service/v1/*.proto`
- `app/core/service/internal/data/ent/schema/*`
- `app/core/service/internal/data/*_repo.go`
- `app/core/service/internal/service/*_service.go`

然后：

- 后台管理接口加到 `admin-service`
- 前台接口按需加到 `app-service`

适合绝大多数第一阶段需求。

### 方案 B：明确要独立部署时再做

新建 `app/trade/service`

适合：

- 订单交易量大
- 事务链复杂
- 团队想做真正领域拆分
- 交易域要独立演进

---

## 10. 一个最实用的落地顺序

如果你这周就要开干，我建议按这个顺序：

1. 先确认 `trade` 是“core 新领域”还是“独立新服务”
2. 先写 proto，再写实现，不要反过来
3. 先把核心 gRPC 跑通
4. 再补 admin-service 的后台 REST
5. 再补 app-service 的前台 REST
6. 最后再考虑 DTM、事件、异步补偿这些复杂能力

最忌讳的是：

- 一上来就拆独立服务
- 同时改 proto、数据库、BFF、前端 SDK、分布式事务
- 结果很难定位问题

---

## 11. 最小检查清单

### 新增独立服务最小清单

- 新目录 `app/trade/service`
- `pkg/serviceid` 增加常量
- `cmd/server/main.go`
- `wire.go`
- 三个 provider set
- `configs/*.yaml`
- `api/protos/trade/service/v1/*.proto`
- `internal/server/grpc_server.go`
- `make api`
- `make wire`
- `make build`

### 新增 core 领域最小清单

- `api/protos/trade/service/v1/*.proto`
- core repo
- core ent schema
- core service
- core grpc register
- `make api`
- `make ent`
- `make wire`
- `make build`

### 新增 admin/app 单个 HTTP API 最小清单

- `api/protos/admin/service/v1/i_xxx.proto` 或 `api/protos/app/service/v1/i_xxx.proto`
- 对应 service 实现
- 如果需要新下游 client，则加到 `internal/data/data.go`
- provider set 注册
- `rest_server.go` 注册
- `make api`
- `make openapi`
- `make ts`

---

如果后续你已经决定了要走哪条路：

- “trade 先做进 core-service”
- “trade 直接做独立 trade-service”

我可以下一步继续按你选的路线，直接给你拆出一份更具体的文件级改动清单。
