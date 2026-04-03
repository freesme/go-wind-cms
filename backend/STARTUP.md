# Go Wind CMS Backend - 本地启动指南

## 前置要求

- Go 1.25+
- Docker & Docker Compose
- Git

## 架构概览

项目包含 3 个微服务：

| 服务 | 职责 | HTTP 端口 | SSE 端口 | gRPC 端口 |
|------|------|-----------|----------|-----------|
| **core-service** | 核心业务逻辑、数据库操作、认证鉴权 | 无 | 无 | 随机分配 |
| **admin-service** | 管理后台 API（用户/角色/权限/内容管理） | 6600 | 6601 | 随机分配 |
| **app-service** | 前台应用 API（文章/评论/页面等） | 6700 | 6701 | 随机分配 |

依赖服务：

| 服务 | 端口 | 用途 |
|------|------|------|
| PostgreSQL | 15432 | 主数据库 |
| Redis | 6379 | 缓存/任务队列 |
| etcd | 2379 | 服务注册与配置中心 |
| MinIO | 19000 (API) / 19001 (Console) | 对象存储 |
| Jaeger | 16686 (UI) / 4317 (OTLP) | 链路追踪 |
| Elasticsearch | 9200 | 日志/搜索（可选） |

> **注意**: PostgreSQL 和 MinIO 使用非标准端口（15432 和 19000），因为标准端口可能被其他服务占用。如果标准端口可用，可在 `docker-compose.libs.yaml` 中改回 5432 和 9000，并同步修改对应的配置文件。

## 启动步骤

### 1. 启动依赖服务

```bash
cd backend

# 启动核心依赖（不含 Elasticsearch）
docker compose -f docker-compose.libs.yaml up -d postgres redis minio etcd jaeger

# 如果需要 Elasticsearch（可选，搜索和日志功能需要）
docker compose -f docker-compose.libs.yaml up -d elasticsearch
```

验证服务状态：

```bash
docker ps --filter "name=backend-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 2. 下载 Go 依赖

```bash
go mod tidy
```

### 3. 导出配置到 etcd

服务启动时会从 etcd 读取配置。需要先安装 cfgexp 工具并导出配置：

```bash
# 安装 cfgexp 工具（仅首次需要）
go install github.com/tx7do/kratos-cli/config-exporter/cmd/cfgexp@latest

# 导出配置到 etcd
cfgexp --type=etcd --addr=localhost:2379 --proj=go-wind-cms
```

成功后会输出所有已导出的配置键。

### 4. 按顺序启动服务

**必须先启动 core-service**，因为 admin-service 和 app-service 通过 gRPC 依赖它。

```bash
# 终端 1：启动 user-service
cd app/user/service
go run ./cmd/server/ -c ./configs

# 终端 2：启动 admin-service（等 user 启动完成后）
cd app/admin/service
go run ./cmd/server/ -c ./configs

# 终端 3：启动 app-service（等 user 启动完成后）
cd app/app/service
go run ./cmd/server/ -c ./configs
```

### 5. 导入演示数据（可选）

```bash
# 在 backend 目录下
docker exec -i backend-postgres-1 env PGPASSWORD='*Abcd123456' psql -U postgres -d gwc < sql/postgresql-demo-data.sql
```

### 6. 验证服务

登录测试（密码需 AES 加密后 base64 编码）：

```bash
# 密码 "admin" 经 AES-CBC 加密后的 base64 值为 h1EAUNtwVm48wiz7iW1sjw==
# AES 密钥: f51d66a73d8a0927（配置在 authenticator.yaml）
curl -s http://localhost:6600/admin/v1/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"grantType":"PASSWORD","username":"admin","password":"h1EAUNtwVm48wiz7iW1sjw=="}'
```

成功会返回 `access_token` 和 `refresh_token`。

使用 token 访问 API：

```bash
curl -s http://localhost:6600/admin/v1/users \
  -H "Authorization: Bearer <access_token>"
```

## 默认账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| admin | admin | platform:admin | 平台超级管理员 |
| tenant_admin | admin | 无（需手动分配） | 租户管理员 |

## 依赖服务凭证

| 服务 | 用户名 | 密码 |
|------|--------|------|
| PostgreSQL | postgres | *Abcd123456 |
| Redis | (无) | *Abcd123456 |
| MinIO | root | *Abcd123456 |
| Elasticsearch | elastic | *Abcd123456 |

## 配置文件说明

每个服务的配置文件位于 `app/{服务}/service/configs/` 目录：

| 文件 | 用途 |
|------|------|
| server.yaml | 服务端口、中间件配置 |
| data.yaml | 数据库、Redis、ES 连接配置 |
| registry.yaml | etcd 服务注册配置 |
| remote.yaml | 远程配置中心（etcd）连接 |
| oss.yaml | MinIO 对象存储配置 |
| trace.yaml | Jaeger 链路追踪配置 |
| logger.yaml | 日志配置 |
| client.yaml | gRPC 客户端中间件配置 |
| authenticator.yaml | JWT 认证配置（仅 core-service） |

## 修改配置后重新导出

修改配置文件后需要重新导出到 etcd：

```bash
cfgexp --type=etcd --addr=localhost:2379 --proj=go-wind-cms
```

然后重启对应服务。

## 启动过程中修复的问题

1. **Elasticsearch 镜像不可用**: `bitnami/elasticsearch:latest` 已不存在，改用官方镜像 `docker.elastic.co/elasticsearch/elasticsearch:8.17.0`，并调整了环境变量格式。

2. **端口冲突**: PostgreSQL (5432) 和 MinIO (9000/9001) 端口被其他容器占用，分别映射到 15432 和 19000/19001。

3. **Docker 主机名不可达**: 配置文件中使用了 Docker 内部主机名（如 `redis`, `postgres`），本地开发时需改为 `localhost`。涉及的配置文件：
   - `app/core/service/configs/data.yaml` - 数据库和 Redis 地址
   - `app/core/service/configs/server.yaml` - Asynq Redis 地址
   - `app/core/service/configs/trace.yaml` - Jaeger 地址
   - `app/admin/service/configs/data.yaml` - Redis 地址
   - `app/app/service/configs/data.yaml` - Redis 地址
   - 所有服务的 `oss.yaml` - MinIO 端口

4. **远程配置类型错误**: `remote.yaml` 配置了 Consul 作为远程配置中心，但实际部署的是 etcd。将所有服务的 `remote.yaml` 改为使用 etcd。

5. **演示数据 SQL 错误**: `postgresql-demo-data.sql` 引用了不存在的表 `sys_dict_type_i18n`（ent schema 中无此表），已注释该段 INSERT 语句。

## 停止服务

```bash
# 停止依赖服务
docker compose -f docker-compose.libs.yaml down

# 停止 Go 服务：在各终端按 Ctrl+C
```
