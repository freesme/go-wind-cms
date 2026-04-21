# 05. API 与代码生成链路

这一篇解决的问题是：

- `api/protos`、`api/gen/go`、OpenAPI、TS SDK、Ent、Wire 之间是什么关系
- 改了接口后到底要执行哪些命令
- 哪些文件是生成物，哪些是设计源头

如果你经常遇到这些问题：

- “我明明加了 proto，为什么 Go 里没有方法”
- “我新增了字段，为什么编译还是旧的”
- “为什么 Swagger 里没出现新接口”

大概率都和这条链路有关。

## 一张图理解整个生成链

你可以先把这个仓库理解成两条生成链：

### 1. 接口合同链

```text
api/protos
  -> make api
  -> api/gen/go
  -> 服务实现 / gRPC client / HTTP 注册
  -> make openapi
  -> Swagger 文档
  -> make ts
  -> 前端 TypeScript SDK
```

### 2. 数据模型链

```text
internal/data/ent/schema
  -> make ent
  -> internal/data/ent
  -> repo / data 层使用
```

另外还有一条装配链：

```text
provider set / constructor
  -> make wire
  -> cmd/server/wire_gen.go
  -> main.go 启动时完成依赖装配
```

## 1. `api/protos` 是接口设计源头

你在这里定义：

- gRPC service
- HTTP service
- request / response message
- error proto
- 文档和注解

当前常见结构如下：

| 路径 | 含义 |
|---|---|
| `api/protos/identity/service/v1` | 核心领域 gRPC，例如用户、组织、岗位等 |
| `api/protos/trade/service/v1` | 交易领域 gRPC |
| `api/protos/book/service/v1` | 图书领域 gRPC |
| `api/protos/admin/service/v1` | 后台 HTTP 接口 |
| `api/protos/app/service/v1` | 前台 HTTP 接口 |

### 一个很实用的理解方式

- 领域 proto：定义真正的后端能力
- admin/app proto：定义面向终端的 HTTP 接口

也就是说：

- 核心能力先定义在领域 proto
- 如果前台或后台要对外暴露 HTTP，再定义各自的入口 proto

## 2. `api/gen/go` 是生成结果

这里是 `make api` 生成出来的 Go 代码。

包括：

- message
- gRPC client / server
- HTTP handler / client
- validate
- redact
- error 枚举

原则只有一个：

- 不手改

如果你发现这里和预期不一致，应该回头检查：

- proto 是否改对了
- `make api` 是否执行了

## 3. 最重要的生成命令分别干什么

### `make api`

作用：

- 根据 `api/protos` 生成 Go 侧 protobuf / gRPC / HTTP 绑定代码

适用场景：

- 改了 proto
- 新增了 service
- 新增了 message / 字段 / RPC

### `make openapi`

作用：

- 为 admin 和 app 生成 OpenAPI 文档

适用场景：

- 改了 `api/protos/admin/service/v1`
- 改了 `api/protos/app/service/v1`
- 想让 Swagger 文档出现新接口

### `make ts`

作用：

- 生成前端 TypeScript SDK

适用场景：

- 改了 admin/app 对外接口，前端要同步调用

### `make ent`

作用：

- 根据 `internal/data/ent/schema` 生成 Ent 代码

适用场景：

- 新增实体
- 新增字段
- 改 Ent schema

### `make wire`

作用：

- 根据 provider set 和 constructor 生成依赖注入装配代码

适用场景：

- 新增构造函数
- 新增 service / repo / client
- provider set 改了

## 4. 根目录命令和服务目录命令怎么配合

### 在根目录最常用的命令

```bash
make api
make openapi
make ts
make wire
make ent
make build
```

适合：

- 多服务统一生成
- 合同层变更
- 准备提交前整体检查

### 在单个服务目录最常用的命令

```bash
cd app/<service>/service
make ent
make wire
make build
make run
```

适合：

- 单服务局部开发
- 本地快速迭代

## 5. 不同改动场景下该执行什么

### 场景 1：只改了 Go 业务逻辑

通常只需要：

```bash
cd app/<service>/service
make build
```

### 场景 2：改了 proto

至少执行：

```bash
make api
```

如果改的是 admin/app 对外接口，再补：

```bash
make openapi
make ts
```

### 场景 3：改了 Ent schema

至少执行：

```bash
cd app/<service>/service
make ent
make build
```

### 场景 4：新增构造函数或 provider

至少执行：

```bash
cd app/<service>/service
make wire
make build
```

## 6. 新增接口时的典型执行顺序

推荐固定顺序：

1. 先改 proto
2. 执行 `make api`
3. 如果是 admin/app 对外接口，再执行 `make openapi` 和 `make ts`
4. 写 service / repo / data 逻辑
5. 如果新增了构造函数，执行 `make wire`
6. 如果改了 Ent schema，执行 `make ent`
7. 最后 `make build`

不要反过来。

最常见的低效做法是：

- 先写一堆 Go 代码
- 最后才发现 proto 设计不对

## 7. 新增实体时的典型执行顺序

如果你新增一个数据实体，建议顺序是：

1. 先确定它属于哪个服务
2. 改 `internal/data/ent/schema`
3. 执行 `make ent`
4. 写 repo
5. 写 service
6. 如果需要对外接口，再补 proto 和 `make api`
7. 最后 `make wire` 和 `make build`

## 8. `Wire` 在这里扮演什么角色

你在每个服务里都会看到：

- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`
- `internal/server/providers/wire_set.go`
- `cmd/server/wire.go`
- `cmd/server/wire_gen.go`

可以这样理解：

- 你写构造函数和 provider set
- `wire` 帮你把整棵依赖树串起来
- `wire_gen.go` 是装配结果

### 你什么时候会碰到 `wire`

- 新增 repo
- 新增 gRPC client
- 新增 service struct
- 新增 server 注册依赖

### 常见错误

- 构造函数写了，但没加进 provider set
- provider set 改了，但没重新跑 `make wire`

## 9. `Ent` 在这里扮演什么角色

`Ent` 是当前仓库重要的数据访问方案之一。

你会看到典型路径：

```text
app/<service>/service/internal/data/ent/schema
```

设计流程是：

- 先定义 schema
- 生成 `ent` 目录
- repo 使用生成后的 client / entity / query builder

### 原则

- 手改 schema
- 不手改生成后的 `ent` 代码

## 10. Swagger 和前端 SDK 为什么会不同步

常见原因有两个：

### 1. 你只执行了 `make api`

这会更新 Go 代码，但不会更新：

- OpenAPI
- TypeScript SDK

### 2. 你改的是领域 proto，不是 admin/app 对外 proto

领域 proto 定义的是后端能力，不等于浏览器直接访问的 HTTP 接口。

如果你希望 Swagger 上出现新接口，通常还要：

- 在 `api/protos/admin/service/v1` 或 `api/protos/app/service/v1` 新增对应入口

## 11. GoLand 为何经常在 proto 上报红

不是 `buf generate` 有问题，而是 IDE 不认识远程依赖。

解决方式：

- 先导出 Buf 依赖到本地
- 把 `api/protos` 和 `api/third_party/buf` 配成 import roots

看这里：

- [../scripts/proto/README.md](../scripts/proto/README.md)

## 12. 这条链路里最重要的纪律

### 1. 设计源头永远优先于生成结果

- proto 是接口源头
- schema 是数据模型源头
- provider set 是装配源头

### 2. 不要手改生成代码

包括：

- `api/gen/go`
- `internal/data/ent`
- `cmd/server/wire_gen.go`

### 3. 每次只定位一个源头

如果问题出在接口层，先看 proto。

如果问题出在数据层，先看 Ent schema。

如果问题出在依赖装配，先看 provider set / constructor。

## 这一步完成后你应该掌握什么

读完本篇，你应该已经知道：

- 改接口后为什么要先 `make api`
- 改 admin/app 对外接口后为什么还要 `make openapi` 和 `make ts`
- 改 Ent schema、provider set 时分别要跑什么

下一篇请读 [06-how-to-add-an-endpoint.md](06-how-to-add-an-endpoint.md)。
