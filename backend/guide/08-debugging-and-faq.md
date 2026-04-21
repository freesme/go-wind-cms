# 08. 排错与常见问题

这一篇解决的问题是：

- 项目起不来时先查哪里
- 新增接口不生效时先查哪里
- 生成、注册、服务发现、配置导出这些典型问题怎么定位

本篇不是覆盖所有异常，而是优先覆盖新手最容易遇到、最常见、最影响效率的错误。

## 一条总原则：先判断你卡在哪一层

遇到问题时，先不要盲目翻日志。先判断问题属于哪一层：

| 层 | 常见问题 |
|---|---|
| 依赖层 | PostgreSQL、Redis、etcd、MinIO、Jaeger 没启动 |
| 配置层 | `cfgexp` 没导出、`remote.yaml` / `data.yaml` 不正确 |
| 生成层 | `make api` / `make ent` / `make wire` 没执行 |
| 注册层 | HTTP / gRPC server 没注册 |
| 发现层 | `serviceid` 或 gRPC client 配置不对 |
| 业务层 | 真正的逻辑 bug 或参数问题 |

## 1. 服务启动失败

### 现象：`admin-service` 或 `app-service` 一启动就报错

优先检查：

1. `user-service` 是否已经启动
2. etcd 是否已经启动
3. 是否执行过：

```bash
cfgexp --type=etcd --addr=localhost:2379 --proj=go-wind-cms
```

### 原因

当前后台和前台 BFF 都依赖核心后端的 gRPC 服务发现。

如果核心后端或 etcd 没准备好，BFF 往往先挂。

## 2. 服务能启动，但 Swagger 打不开

优先检查：

1. 对应端口是否真的监听
2. 服务进程是否其实已经退出
3. `rest_server.go` 是否注册了对应 HTTP service

常见端口：

- `admin-service`: `6600`
- `app-service`: `6700`

## 3. 改了 proto，但 Go 代码里没有新方法

先检查：

```bash
make api
```

如果还不对，再检查：

- 你是不是改错了 proto 目录
- 你改的是不是 admin/app 入口 proto，而你却在找领域 gRPC 方法
- 生成文件是不是还没刷新

## 4. Go 代码有了，但 Swagger 没变化

先检查你有没有执行：

```bash
make openapi
```

然后确认：

- 你改的是 admin/app 对外接口 proto
- 不是只改了领域 proto

## 5. 前端 SDK 没更新

先执行：

```bash
make ts
```

如果仍旧没变，检查：

- 你改的是不是 `api/protos/admin/service/v1` 或 `api/protos/app/service/v1`
- 你的接口是不是根本还没暴露成 HTTP 入口

## 6. 新增字段或实体后，Ent 代码没变化

先执行：

```bash
cd app/<service>/service
make ent
```

再确认：

- schema 是否真的改在 `internal/data/ent/schema/`
- 改的是 schema，不是生成后的 `ent` 目录

## 7. `wire` 生成失败

最常见原因：

- 写了构造函数，但没加进 provider set
- 某个依赖没有对应 provider
- 新的 repo / client / service 没有被装配起来

优先检查：

- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`
- `internal/server/providers/wire_set.go`
- `cmd/server/wire.go`

然后重新执行：

```bash
cd app/<service>/service
make wire
```

## 8. 编译通过，但接口访问 404

这通常说明：

- 你实现了 service
- 但没有把它注册到 HTTP 或 gRPC server

优先检查：

- `internal/server/rest_server.go`
- `internal/server/grpc_server.go`

## 9. 编译通过，但 gRPC 提示方法不存在

常见原因：

- proto 已改，但 `make api` 没执行
- server 没注册
- 调用方和被调用方代码版本不一致

## 10. admin/app 调不到下游服务

优先检查三个地方：

1. `pkg/serviceid/service_id.go`
2. `internal/data/data.go`
3. 目标服务是否真的启动并注册到 etcd

最常见错误包括：

- 服务 ID 常量没加
- `serviceid.NewDiscoveryName(...)` 用错服务名
- etcd 没有当前服务配置

## 11. 改了配置但完全不生效

先检查你是否重新导出了配置：

```bash
cfgexp --type=etcd --addr=localhost:2379 --proj=go-wind-cms
```

当前服务很多配置不是直接读本地文件，而是通过远程配置中心读取。

所以“文件改了”不等于“运行时生效了”。

## 12. GoLand 打开 proto 全是红线

这是新手非常常见的问题。

优先看：

- [../scripts/proto/README.md](../scripts/proto/README.md)

核心思路是：

1. 把 Buf 远程依赖导出到 `api/third_party/buf`
2. 在 GoLand 里把 `api/protos` 和 `api/third_party/buf` 配成 import roots

## 13. Docker 依赖起不来

优先检查：

- Docker Desktop 或 Docker daemon 是否运行
- 端口是否冲突
- 本地是否已有占用相同端口的容器

常见冲突端口：

- PostgreSQL
- MinIO
- Jaeger

如果你使用的是当前修订后的本地开发文档，优先以 `docker-compose.libs.yaml` 中的端口为准。

## 14. 登录接口报错

优先检查：

- 演示数据是否已导入
- AES 加密后的密码串是否正确
- `user-service` 是否正常启动
- 数据库连接是否正常

## 15. 不知道该改哪一层

先回到这两个判断：

### 如果它是领域规则

优先看：

- `app/user/service`

### 如果它是后台或前台接口编排

优先看：

- `app/admin/service`
- `app/app/service`

不要一开始就去改共享包或生成代码。

## 16. `app/core/service` 看起来像核心服务，为什么不建议去改

因为当前仓库里：

- 真正的主开发核心后端在 `app/user/service`
- `app/core/service` 目前更像历史残留和运行产物位置

如果你按照旧名字直接去 `app/core/service` 开发，极易走错路。

## 17. 新增服务后 compose 起不来

先检查：

- `docker-compose.yaml` 是否新增了该服务
- `SERVICE_NAME` 是否和目录名一致
- `Dockerfile` 是否能从 `app/${SERVICE_NAME}/service/cmd/server/` 构建

## 最实用的排错顺序

当你不知道问题在哪时，用这个顺序：

1. 看依赖容器是否正常
2. 看配置是否已导出到 etcd
3. 看生成命令是否执行过
4. 看 provider set 和 wire
5. 看 server register
6. 看服务发现配置
7. 最后再看业务逻辑

## 一张最小排错清单

每次改完东西，如果不生效，按顺序问自己：

- Docker 依赖起来了吗
- etcd 配置导出了吗
- `make api` 跑了吗
- `make ent` 跑了吗
- `make wire` 跑了吗
- server 注册了吗
- 服务发现名对了吗
- 当前服务真的重启了吗

## 延伸阅读

- [01-quick-start.md](01-quick-start.md)
- [05-api-and-codegen.md](05-api-and-codegen.md)
- [06-how-to-add-an-endpoint.md](06-how-to-add-an-endpoint.md)
- [../STARTUP.md](../STARTUP.md)
- [../scripts/proto/README.md](../scripts/proto/README.md)

下一篇请读 [09-learning-path.md](09-learning-path.md)。
