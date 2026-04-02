# Core Service

`core-service` 是项目的核心领域服务宿主，承担真正的数据拥有、领域规则实现和基础设施接入职责。`admin-service` 与 `app-service` 面向不同客户端暴露接口，而 `core-service` 则向它们提供统一的 gRPC 业务能力。

相关文档：

- [项目总体架构说明](/C:/Users/WIN10/GolandProjects/go-wind-cms/docs/project-architecture.md)
- [CreateUser 字段级调用链泳道图](/C:/Users/WIN10/GolandProjects/go-wind-cms/docs/create-user-sequence.md)

## 服务定位

- 面向对象：内部服务调用方，主要是 `admin-service` 与 `app-service`
- 主要协议：gRPC
- 运行角色：核心领域服务 / 数据拥有者
- 数据职责：直接连接数据库、缓存、对象存储、任务队列和搜索组件

可以把它理解成：

- 一个进程内承载了多个领域 gRPC service
- 这些 gRPC service 包括用户、认证、权限、内容、站点、字典、审计、消息、媒体等模块
- 其它门面层并不是去连一个个独立进程，而是统一去连 `core-service`

## 端口与协议

配置见 [configs/server.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/configs/server.yaml)。

- gRPC：`0.0.0.0:0`
- Asynq：基于 Redis 的后台任务处理

说明：

- `core-service` 当前没有对外 REST 门面
- 主入口是 gRPC server
- 任务系统通过 Redis/Asynq 运行

## 在这里注册的核心业务能力

注册点见 [internal/server/grpc_server.go](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/server/grpc_server.go)。

### 认证与凭证

- `AuthenticationService`
- `LoginPolicyService`
- `UserCredentialService`

### 身份与组织

- `UserService`
- `TenantService`
- `OrgUnitService`
- `PositionService`

### 权限与资源

- `RoleService`
- `PermissionService`
- `PermissionGroupService`
- `PolicyEvaluationLogService`
- `ApiService`
- `MenuService`

### 平台基础能力

- `TaskService`
- `DictTypeService`
- `DictEntryService`
- `LanguageService`
- `FileService`
- `MediaAssetService`

### 审计与消息

- `LoginAuditLogService`
- `ApiAuditLogService`
- `OperationAuditLogService`
- `DataAccessAuditLogService`
- `PermissionAuditLogService`
- `InternalMessageService`
- `InternalMessageCategoryService`
- `InternalMessageRecipientService`

### 内容与站点

- `PostService`
- `CategoryService`
- `TagService`
- `PageService`
- `CommentService`
- `SiteService`
- `SiteSettingService`
- `NavigationService`
- `NavigationItemService`

## 本服务拥有的基础设施

装配入口见 [cmd/server/wire_gen.go](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/cmd/server/wire_gen.go)，数据配置见 [configs/data.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/configs/data.yaml)。

### 数据与缓存

- PostgreSQL
- Redis
- ElasticSearch

### 文件与媒体

- MinIO

### 注册发现与可观测性

- Etcd
- Jaeger / OTel

### 异步任务

- Asynq + Redis

## 本服务内部做了什么

`core-service` 不是简单转发层，它真正承担这些工作：

- 实现用户、租户、角色、权限、内容、站点等实体的业务规则
- 维护主业务表和关系表
- 负责用户凭证生成、密码哈希、认证与 token 校验
- 负责审计日志写入
- 负责文件元数据和媒体资源信息管理
- 负责字典、多语言、站内消息等平台级能力
- 直接操作 Ent ORM 和底层数据库事务

以用户创建为例：

- `admin-service` 只做后台场景校验和字段补写
- 真正的用户主表插入、角色关系写入、组织关系写入、岗位关系写入、凭证创建都发生在 `core-service`

## 依赖关系

### 上游调用方

- `admin-service`
- `app-service`

### 直接依赖的基础设施

- PostgreSQL：主业务数据持久化
- Redis：缓存、token、任务
- MinIO：对象存储
- ElasticSearch：搜索能力预留
- Etcd：服务注册与发现
- Jaeger：链路追踪

### 重要特征

- 这里是“数据拥有者”
- `admin-service` / `app-service` 不应绕过它直接操作主业务数据
- 大多数跨门面层共享规则都应该放在这里

## 目录结构

```text
core/service/
├─ cmd/server/         # 启动入口、Wire 装配结果
├─ configs/            # server / data / registry / oss / trace 等配置
├─ internal/data/      # repo、Ent client、Redis、MinIO、Discovery 等
├─ internal/server/    # gRPC server、中间件、Asynq server
└─ internal/service/   # 真正的领域 service 实现
```

重点说明：

- `internal/service` 里是实际业务实现
- `internal/data` 里是 repo 和基础设施接入
- `cmd/server/wire_gen.go` 能看出每个业务 service 依赖了哪些 repo 和底层组件

## 适合放在这里的逻辑

- 实体的创建、更新、删除、查询规则
- 需要落库或事务控制的逻辑
- 多个门面层共享的领域能力
- 认证、授权、凭证、日志、消息、内容、站点等平台核心逻辑

## 不适合放在这里的逻辑

- 面向后台 UI 的特殊表单校验与字段补写
- 面向前台客户端的接口适配和上下文组装
- 只服务于某个终端展示层的聚合逻辑

这些更适合留在 `admin-service` 或 `app-service`。

## 开发建议

- 新增业务能力时，先判断它是不是“领域规则与数据能力”；如果是，优先放这里
- 如果只是“后台专属接口”或“前台专属接口”，先在门面层实现，再决定是否需要下沉
- 改 `core-service` 之前要评估影响面，因为 `admin-service` 和 `app-service` 都依赖它
