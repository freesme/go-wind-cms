# 07. 如何新增一个服务

这一篇解决的问题是：

- 新需求到底该不该拆成独立服务
- 如果不拆，应该怎么放进当前核心后端
- 如果要拆，标准骨架和接入步骤是什么

这一篇最重要的目标不是“教你机械地建目录”，而是先帮你做正确决策。

## 第一原则：不要默认拆新服务

在当前仓库里，最容易犯的一个错误就是：

- 一有新领域，就先想新建 `app/<name>/service`

但当前仓库的真实风格并不是“所有领域都独立成微服务”，而是：

- 主业务能力集中在 `app/user/service`
- `admin-service` 和 `app-service` 作为 BFF
- 少量独立域作为扩展服务存在

所以默认建议是：

- 先考虑把新能力放进 `app/user/service`
- 只有在确实需要独立边界时，再新建独立服务

## 先做判断：你要的是“新领域能力”还是“新运行进程”

### 优先继续放进 `user-service(core)` 的情况

满足下面多数条件时，优先放进 `app/user/service`：

- 它仍然属于平台主业务的一部分
- 仍然可以和主库协同工作
- 暂时不需要独立部署
- 不需要独立扩缩容
- 主要调用方还是后台和前台 BFF
- 事务边界仍然和核心域强耦合

### 更适合拆成独立服务的情况

满足下面多数条件时，才认真考虑新建 `app/<name>/service`：

- 数据拥有权已经非常清晰
- 需要独立部署和发布
- 需要独立扩容
- 业务复杂度已经不适合继续塞进核心后端
- 其他服务会直接依赖它，而不是都经由核心后端
- 它有独立事务边界

## 推荐默认路线：先放进 `user-service(core)`

如果你现在做的是平台内的新业务域，推荐优先按这条路走。

### 你通常需要做什么

1. 在 `api/protos/<domain>/service/v1` 定义领域 gRPC
2. 在 `app/user/service/internal/data/` 增加 repo / schema
3. 在 `app/user/service/internal/service/` 增加 service 实现
4. 在 `app/user/service/internal/server/grpc_server.go` 注册
5. 如果后台需要 HTTP 入口，再去 `admin-service` 做 BFF 封装
6. 如果前台需要 HTTP 入口，再去 `app-service` 做 BFF 封装

### 这条路线的优点

- 最符合当前仓库主结构
- 最少新增部署复杂度
- 最少新增配置和 compose 维护成本
- admin/app 已经天然会调用核心后端

## 真的要拆新服务时，长什么样

当前仓库中 `book-service` 和 `trade-service` 已经给了你可参考骨架。

一个标准的新服务目录通常应该是：

```text
app/<name>/service/
├─ Makefile
├─ cmd/server/
│  ├─ main.go
│  ├─ wire.go
│  └─ wire_gen.go
├─ configs/
│  ├─ server.yaml
│  ├─ registry.yaml
│  ├─ client.yaml
│  ├─ remote.yaml
│  ├─ trace.yaml
│  └─ data.yaml
└─ internal/
   ├─ data/
   ├─ server/
   └─ service/
```

## 新建独立服务的固定流程

下面这套顺序尽量不要打乱。

### 第 1 步：明确服务边界

在动手前先写清楚：

- 这个服务拥有哪些表或数据
- 哪些服务可以调用它
- 它只暴露 gRPC，还是还要自己暴露 HTTP
- 它是否需要独立数据库能力
- 它是否需要独立对象存储、缓存、任务等配置

如果这些问题你还答不上来，通常说明还不该开始建服务。

### 第 2 步：创建目录骨架

最实用的做法不是从零想，而是参照：

- `app/book/service`
- `app/trade/service`

至少补齐：

- `cmd/server`
- `configs`
- `internal/data`
- `internal/server`
- `internal/service`
- `Makefile`

### 第 3 步：注册服务 ID

修改：

```text
pkg/serviceid/service_id.go
```

新增类似：

```go
NewService = "new-service"
```

这个常量会被用于：

- 服务自己的 `main.go`
- 其他服务创建 gRPC client
- 服务发现

### 第 4 步：编写服务入口

参考：

- `app/trade/service/cmd/server/main.go`
- `app/book/service/cmd/server/main.go`

至少要做：

- 设置 `AppId`
- 使用 `bootstrap.RunApp(...)`
- 通过 `wire` 完成装配

### 第 5 步：定义领域 proto

新增目录：

```text
api/protos/<domain>/service/v1/
```

这里定义的是：

- 这个新服务真正对外暴露的 gRPC 能力

如果这个服务还不直接对浏览器暴露 HTTP，那么到这一步不需要先写 admin/app 的入口 proto。

### 第 6 步：执行 `make api`

在根目录执行：

```bash
make api
```

### 第 7 步：实现 data 层

通常包括：

- repo
- Ent client
- 下游 gRPC client
- Redis / MinIO / Discovery 等依赖

如果这个服务自己拥有数据模型，通常还需要：

```text
internal/data/ent/schema/
```

然后执行：

```bash
cd app/<name>/service
make ent
```

### 第 8 步：实现 service 层

在：

```text
app/<name>/service/internal/service/
```

实现真正的 gRPC service。

这里建议保持职责清晰：

- service 层放业务规则和编排
- repo 层放数据访问

### 第 9 步：注册 provider set

至少检查：

- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`
- `internal/server/providers/wire_set.go`

### 第 10 步：注册 gRPC server

在：

```text
app/<name>/service/internal/server/grpc_server.go
```

把新的 service 注册出去。

### 第 11 步：生成 wire 并编译

```bash
cd app/<name>/service
make wire
make build
```

### 第 12 步：按需接入 BFF

如果后台需要访问它：

- 在 `api/protos/admin/service/v1` 增加入口 proto
- 在 `app/admin/service/internal/data/data.go` 增加 gRPC client
- 在 `app/admin/service/internal/service/` 做后台编排
- 在 `rest_server.go` 注册

如果前台需要访问它：

- 在 `api/protos/app/service/v1` 增加入口 proto
- 在 `app/app/service/internal/data/data.go` 增加 gRPC client
- 在 `app/app/service/internal/service/` 做前台编排
- 在 `rest_server.go` 注册

## Docker 和 Compose 怎么接入

当前 `Dockerfile` 已经是通用模板。

它的核心约定是：

- `SERVICE_NAME`
- `./app/${SERVICE_NAME}/service/cmd/server/`

这意味着只要你的目录结构符合约定，就不需要额外写一份新的 Dockerfile。

### 如果要接入 `docker-compose.yaml`

你通常需要：

1. 新增一个 compose service
2. 设置 `build.args.SERVICE_NAME`
3. 配置依赖、环境变量、端口

当前 `docker-compose.yaml` 里已经有：

- `admin-service`
- `app-service`
- `user-service`

如果你的新服务也要被 compose 启动，就照这个模式补一份。

## 新服务最容易漏掉的地方

### 1. `serviceid` 没加

表现：

- 服务能编译
- 但别人根本连不到它

### 2. provider set 没加全

表现：

- `make wire` 失败

### 3. proto 定了，但 server 没注册

表现：

- 代码有接口
- 实际调用说方法不存在

### 4. 新服务有了，但 BFF 没接

表现：

- 后端内部可以调用
- 浏览器端还是没有入口

### 5. 新服务需要 compose，但没补 `docker-compose.yaml`

表现：

- 本地手动运行能用
- 统一环境起不来

## 新服务最小清单

如果你真的决定建新服务，交付前至少确认：

- 新目录骨架完整
- `pkg/serviceid` 已注册
- 领域 proto 已定义
- `make api` 已执行
- 需要的数据层已完成
- `make ent` 已执行（如果有 schema）
- provider set 已补全
- `make wire` 已执行
- server 已注册
- `make build` 已通过
- 如果要对外给浏览器用，admin/app BFF 已接入
- 如果要进统一部署，compose 已补齐

## 最后的建议

新手在这个仓库里新增能力时，默认优先级应该是：

1. 先判断能不能放进 `user-service(core)`
2. 只有明确需要独立边界时才建独立服务
3. 建独立服务后，浏览器入口仍然优先通过 admin/app BFF 暴露

## 参考资料

- [../SERVICE_API_PLAYBOOK.md](../SERVICE_API_PLAYBOOK.md)
- [../app/user/service/README.md](../app/user/service/README.md)
- [../app/trade/service/cmd/server/main.go](../app/trade/service/cmd/server/main.go)
- [../app/book/service/cmd/server/main.go](../app/book/service/cmd/server/main.go)

下一篇请读 [08-debugging-and-faq.md](08-debugging-and-faq.md)。
