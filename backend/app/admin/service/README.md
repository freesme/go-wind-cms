# Admin Service

`admin-service` 是管理后台的 API 门面层，面向后台 Web 管理端提供 HTTP REST 和 SSE 能力。本服务本身不拥有主要业务数据，核心职责是鉴权、参数归一化、页面路由聚合、文件上传编排，以及把后台请求转发到 `core-service` 的各个 gRPC 业务接口。

相关文档：

- [项目总体架构说明](/C:/Users/WIN10/GolandProjects/go-wind-cms/docs/project-architecture.md)
- [CreateUser 字段级调用链泳道图](/C:/Users/WIN10/GolandProjects/go-wind-cms/docs/create-user-sequence.md)

## 服务定位

- 面向对象：后台管理端前端
- 主要协议：HTTP REST、SSE
- 运行角色：BFF / API Gateway 风格的管理后台聚合层
- 数据职责：不直接持有主业务数据，主要通过 gRPC 调用 `core-service`

这意味着：

- 后台页面看到的大部分能力都从这里进来
- 真正的数据落库、认证核心逻辑、权限资源、内容实体等主要由 `core-service` 负责
- `admin-service` 更接近“面向后台场景的接口编排层”

## 端口与协议

配置见 [configs/server.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/configs/server.yaml)。

- REST：`0.0.0.0:6600`
- SSE：`:6601`
- gRPC：`0.0.0.0:0`

说明：

- 管理后台前端主要调用 `6600`
- SSE 用于站内消息等实时推送
- 本服务虽然也启动 gRPC server，但从当前代码看没有注册后台业务 gRPC 接口，gRPC 更像基础设施保留位和 DTM/workflow 集成支撑

## 对外暴露的后台能力

注册点见 [internal/server/rest_server.go](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/internal/server/rest_server.go)。

### 认证与账号

- `AuthenticationService`
- `LoginPolicyService`
- `UserProfileService`
- `UserService`

### 组织与权限

- `RoleService`
- `TenantService`
- `OrgUnitService`
- `PositionService`
- `AdminPortalService`
- `ApiService`
- `MenuService`
- `PermissionGroupService`
- `PermissionService`

### 运维与平台配置

- `TaskService`
- `DictTypeService`
- `DictEntryService`
- `LanguageService`
- `TranslatorService`

### 审计与消息

- `ApiAuditLogService`
- `DataAccessAuditLogService`
- `LoginAuditLogService`
- `OperationAuditLogService`
- `PermissionAuditLogService`
- `PolicyEvaluationLogService`
- `InternalMessageService`
- `InternalMessageCategoryService`
- `InternalMessageRecipientService`

### 内容与站点

- `PostService`
- `CategoryService`
- `TagService`
- `CommentService`
- `PageService`
- `SiteSettingService`
- `SiteService`
- `NavigationService`
- `NavigationItemService`

### 文件与媒体

- `FileService`
- 自定义文件传输处理器 `registerFileTransferServiceHandler`
- `MediaAssetService`

## 本服务内部做了什么

从装配代码看，`admin-service` 的主要工作不是实现底层领域逻辑，而是做以下事情：

- 通过 `auth.TokenChecker` 做后台访问令牌校验
- 基于 operator 上下文补写后台请求字段，例如 `createdBy`、`tenantId`
- 在真正调用核心服务前做后台侧业务校验，例如角色存在性校验、后台菜单路由拼装
- 将后台 HTTP 请求转换为对 `core-service` 的 gRPC 调用
- 通过 SSE 把站内消息推送给管理端
- 对文件上传进行本地编排：对象存储上传 + 元数据服务登记
- 写入 API 审计日志和登录审计日志

`CreateUser` 是一个典型例子：

- 后台请求先进入 `admin-service`
- 这里补写 `createdBy`、`tenantId`
- 校验角色是否合法
- 最终再调 `core-service` 的 `UserService.Create`

## 依赖关系

### 上游调用方

- 管理后台前端

### 下游依赖

- `core-service`
  - 通过 Etcd 服务发现 + gRPC 调用
  - 用户、租户、角色、权限、内容、站点、日志、字典、多语言等绝大多数能力都来自这里
- MinIO
  - 文件传输流程中直接参与对象上传/下载
- SSE Server
  - 后台消息推送
- DTM / workflow
  - gRPC server 初始化时会接入 workflow

### 基础设施配置

- 服务发现：Etcd，见 [configs/registry.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/configs/registry.yaml)
- Trace：Jaeger / OTel，见 [configs/trace.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/configs/trace.yaml)
- 对象存储：MinIO，见 [configs/oss.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/configs/oss.yaml)

## 目录结构

```text
admin/service/
├─ cmd/server/         # 启动入口、Wire 装配结果、静态资源
├─ configs/            # server / registry / client / oss / trace 等配置
├─ internal/data/      # gRPC client、服务发现、MinIO、翻译器等基础依赖
├─ internal/server/    # REST/SSE/gRPC server 及中间件注册
└─ internal/service/   # 面向管理后台场景的 service 编排层
```

重点说明：

- `internal/service` 里的每个 service 大多是“后台用例层”
- `internal/data` 里大量 `NewXxxServiceClient` 都是连到 `core-service`
- `cmd/server/wire_gen.go` 最能反映这个服务的真实依赖面

## 适合放在这里的逻辑

- 后台专属接口
- 后台鉴权与 operator 上下文字段补写
- 后台菜单、路由、权限视图的聚合结果
- 上传、推送、审计等场景编排

## 不适合放在这里的逻辑

- 用户、角色、租户、内容、站点等实体的底层持久化逻辑
- 与前台后台无关的通用领域规则
- 应被多个门面层复用的核心业务规则

这些更适合放到 `core-service`。

## 开发建议

- 如果是“后台独有展示/校验/聚合需求”，优先改这里
- 如果是“实体本身的规则、持久化、通用业务能力”，应下沉到 `core-service`
- 改接口前先看 `cmd/server/wire_gen.go`，它能快速说明当前 service 依赖了哪些核心能力
