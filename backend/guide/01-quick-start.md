# 01. 快速上手

这一篇解决的问题是：

- 第一次拿到仓库，怎么把项目跑起来
- 哪几个服务是当前主链路
- 怎么判断自己启动成功了
- 新手最容易卡在哪些地方

本篇以 Windows 开发为主，同时补充 Linux/macOS 的差异。

## 先理解：你到底要启动什么

当前仓库里，真正的主开发链路是这三个服务：

| 服务 | 当前真实代码位置 | 作用 |
|---|---|---|
| 核心后端 | `app/user/service` | 承载核心业务逻辑和数据能力，概念上常被叫做 `core-service` |
| 后台接口层 | `app/admin/service` | 管理后台 HTTP / SSE 入口 |
| 前台接口层 | `app/app/service` | 前台客户端 HTTP / SSE 入口 |

其中最重要的一点是：

- 你必须先启动 `app/user/service`
- 因为 `admin-service` 和 `app-service` 都依赖它的 gRPC 能力

`book-service` 和 `trade-service` 当前已经有代码实现，但不属于新手第一次必须跑通的主链路。

## 启动前准备

至少准备好：

- Go 1.25+
- Docker / Docker Compose
- Git

如果你在 Windows 上开发，推荐优先参考：

- [../scripts/README.md](../scripts/README.md)
- [../scripts/WORKFLOWS_AND_BEST_PRACTICES.md](../scripts/WORKFLOWS_AND_BEST_PRACTICES.md)

## 第一次启动的推荐流程

### 步骤 1：启动依赖服务

在仓库根目录执行。

Windows PowerShell：

```powershell
docker compose -f docker-compose.libs.yaml up -d postgres redis minio etcd jaeger
```

Linux/macOS：

```bash
docker compose -f docker-compose.libs.yaml up -d postgres redis minio etcd jaeger
```

如果你需要 Elasticsearch，再补一条：

```bash
docker compose -f docker-compose.libs.yaml up -d elasticsearch
```

### 步骤 2：下载 Go 依赖

在仓库根目录执行：

```bash
make dep
```

如果你更习惯 Go 原生命令，也可以用：

```bash
go mod tidy
```

### 步骤 3：把配置导出到 etcd

当前服务启动时会从 etcd 读取配置，因此你需要先导出配置。

安装工具：

```bash
go install github.com/tx7do/kratos-cli/config-exporter/cmd/cfgexp@latest
```

导出配置：

```bash
cfgexp --type=etcd --addr=localhost:2379 --proj=go-wind-cms
```

### 步骤 4：按顺序启动三个主服务

终端 1，启动核心后端：

```bash
cd app/user/service
go run ./cmd/server/ -c ./configs
```

终端 2，启动后台接口：

```bash
cd app/admin/service
go run ./cmd/server/ -c ./configs
```

终端 3，启动前台接口：

```bash
cd app/app/service
go run ./cmd/server/ -c ./configs
```

## 启动成功的判定方法

至少检查下面几件事：

### 1. 依赖容器正常

```bash
docker ps --filter "name=backend-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

你应该能看到：

- PostgreSQL
- Redis
- etcd
- MinIO
- Jaeger

### 2. 后台接口可访问

打开：

- `http://localhost:6600/docs/`

如果能看到 Swagger UI，说明 `admin-service` 的 HTTP 层已经起来了。

### 3. 前台接口可访问

打开：

- `http://localhost:6700/docs/`

如果能看到前台 Swagger UI，说明 `app-service` 的 HTTP 层已经起来了。

### 4. 登录接口可用

可以直接用默认账号测试后台登录。

```bash
curl -s http://localhost:6600/admin/v1/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"grantType\":\"PASSWORD\",\"username\":\"admin\",\"password\":\"h1EAUNtwVm48wiz7iW1sjw==\"}"
```

如果返回 `access_token` 和 `refresh_token`，主链路基本已经打通。

## 默认账号和本地依赖

### 默认账号

| 用户名 | 密码 | 说明 |
|---|---|---|
| `admin` | `admin` | 平台超级管理员 |
| `tenant_admin` | `admin` | 租户管理员，默认权限需要后续分配 |

### 本地依赖默认凭证

| 服务 | 用户名 | 密码 |
|---|---|---|
| PostgreSQL | `postgres` | `*Abcd123456` |
| Redis | 无 | `*Abcd123456` |
| MinIO | `root` | `*Abcd123456` |

## 配置文件怎么看

每个服务的配置文件都在：

```text
app/<service>/service/configs/
```

常见配置文件如下：

| 文件 | 作用 |
|---|---|
| `server.yaml` | 端口、服务端中间件 |
| `data.yaml` | 数据库、Redis、ES |
| `registry.yaml` | 服务注册发现 |
| `remote.yaml` | 远程配置中心，当前主要是 etcd |
| `oss.yaml` | MinIO |
| `trace.yaml` | Jaeger / OTel |
| `logger.yaml` | 日志 |
| `client.yaml` | gRPC 客户端中间件 |
| `authenticator.yaml` | JWT 认证配置，当前主要在核心后端使用 |

改完配置后，通常要重新导出：

```bash
cfgexp --type=etcd --addr=localhost:2379 --proj=go-wind-cms
```

## Windows 与 Linux/macOS 的差异

### 在 Windows 上

推荐：

- Docker 依赖用 PowerShell 或 Docker Compose 启动
- Go 服务直接在 GoLand / VS Code 里运行和调试
- 遇到 proto 导入报红，优先看 [../scripts/proto/README.md](../scripts/proto/README.md)

### 在 Linux/macOS 上

总体流程一样，只是命令入口更常用 Bash 脚本，例如：

```bash
bash scripts/docker/libs_only.sh
```

## 第一次上手最常见的坑

### 1. `admin-service` 起不来

通常不是它自己的问题，而是：

- `user-service` 还没起来
- 配置还没导出到 etcd
- etcd 没起来

### 2. 启动日志里连接不到数据库或 Redis

优先检查：

- Docker 依赖是否启动成功
- `data.yaml` 是否还是旧地址
- 本地端口是否冲突

### 3. GoLand 打开 `api/protos` 一片红

通常是 Buf 远程依赖没有导出到本地。

先看：

- [../scripts/proto/README.md](../scripts/proto/README.md)

### 4. Swagger 打不开

优先检查：

- 服务是否真的启动成功
- 对应端口是否被占用
- 终端里是否已经报错退出

## 这一步完成后你应该掌握什么

读完本篇，你应该已经知道：

- 当前主链路要启动哪三个服务
- 为什么 `user-service` 实际上是当前核心后端
- 依赖、配置、服务的启动顺序是什么
- 启动成功后去哪里验证

下一篇请读 [02-project-map.md](02-project-map.md)。
