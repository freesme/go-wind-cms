# Core Service 领域地图

本文聚焦 `backend/app/core/service`，目标是回答三个问题：

- `core-service` 当前到底承载了哪些领域
- 每个领域里有哪些 `service / repo / schema`
- 每个领域的核心实体、关系表和典型调用链是什么

说明：

- 真实“已对外暴露”的能力，以 gRPC 注册点为准，即 [grpc_server.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/server/grpc_server.go#L37)
- 真实依赖装配关系，以 Wire 结果为准，即 [wire_gen.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/cmd/server/wire_gen.go#L25)
- 本文只拆你关心的 7 个领域：用户、权限、内容、站点、审计、文件、媒体

---

## 1. 总体结构

`core-service` 是当前项目的核心领域中心，不是一个简单的转发层。

目录分工：

- [cmd/server](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/cmd/server)
  - 启动入口、Wire 注入结果
- [configs](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/configs)
  - gRPC、Asynq、数据库、注册中心、对象存储、链路追踪等配置
- [internal/service](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service)
  - 领域 service 实现
- [internal/data](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data)
  - repo、Ent client、Redis、MinIO、认证器等
- [internal/data/ent/schema](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema)
  - 实体表和关系表模型

当前对外主要入口：

- gRPC server
- Asynq server

当前直接依赖的基础设施：

- PostgreSQL
- Redis
- ElasticSearch
- MinIO
- Etcd
- Jaeger / OTel

配置见：

- [server.yaml](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/configs/server.yaml#L1)
- [data.yaml](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/configs/data.yaml#L1)

---

## 2. 领域总览表

| 领域 | 已注册 service | 主要 repo | 主要 schema |
|---|---|---|---|
| 用户域 | `AuthenticationService` `LoginPolicyService` `UserService` `TenantService` `OrgUnitService` `PositionService` | `user_repo` `tenant_repo` `org_unit_repo` `position_repo` `user_credential_repo` `user_role_repo` `user_org_unit_repo` `user_position_repo` `membership_*` | `user` `tenant` `org_unit` `position` `user_credential` `user_role` `user_org_unit` `user_position` `membership*` `login_policy` |
| 权限域 | `RoleService` `PermissionService` `PermissionGroupService` `PolicyEvaluationLogService` `ApiService` `MenuService` | `role_repo` `role_metadata_repo` `role_permission_repo` `permission_repo` `permission_group_repo` `permission_api_repo` `permission_menu_repo` `permission_policy_repo` `api_repo` `menu_repo` | `role` `role_metadata` `role_permission` `permission` `permission_group` `permission_api` `permission_menu` `permission_policy` `policy_evaluation_log` `api` `menu` |
| 内容域 | `PostService` `CategoryService` `TagService` `PageService` `CommentService` | `post_repo` `post_translation_repo` `post_category_repo` `post_tag_repo` `category_repo` `category_translation_repo` `tag_repo` `tag_translation_repo` `page_repo` `page_translation_repo` `comment_repo` | `post` `post_translation` `post_category` `post_tag` `category` `category_translation` `tag` `tag_translation` `page` `page_translation` `comment` |
| 站点域 | `SiteService` `SiteSettingService` `NavigationService` `NavigationItemService` | `site_repo` `site_setting_repo` `navigation_repo` `navigation_item_repo` | `site` `site_setting` `navigation` `navigation_item` |
| 审计域 | `LoginAuditLogService` `ApiAuditLogService` `OperationAuditLogService` `DataAccessAuditLogService` `PermissionAuditLogService` | `login_audit_log_repo` `api_audit_log_repo` `operation_audit_log_repo` `data_access_audit_log_repo` `permission_audit_log_repo` | `login_audit_log` `api_audit_log` `operation_audit_log` `data_access_audit_log` `permission_audit_log` |
| 文件域 | `FileService` | `file_repo` | `file` |
| 媒体域 | `MediaAssetService` | `media_asset_repo` `media_variant_repo` | `media_asset` `media_variant` |

补充说明：

- [user_credential_service.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/user_credential_service.go#L16) 已实现，且 [wire_gen.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/cmd/server/wire_gen.go#L40) 也会构造对应 repo，但当前 [grpc_server.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/server/grpc_server.go#L100) 未见 `RegisterUserCredentialServiceServer(...)` 注册
- [file_transfer_service.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/file_transfer_service.go) 也存在实现，并且 [service/providers/wire_set.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/providers/wire_set.go#L47) 已放入 ProviderSet，但当前未在 gRPC 注册点暴露
- 所以“目录里有文件”不等于“当前已对外提供能力”，以后看暴露范围时优先看注册点

---

## 3. 用户域

### 3.1 已注册 service

- `AuthenticationService`
- `LoginPolicyService`
- `UserService`
- `TenantService`
- `OrgUnitService`
- `PositionService`

已实现但当前未注册：

- `UserCredentialService`

### 3.2 核心实体

- `User`
- `Tenant`
- `OrgUnit`
- `Position`
- `UserCredential`
- `LoginPolicy`

对应 schema：

- [user.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/user.go#L14)
- [tenant.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/tenant.go#L14)
- [org_unit.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/org_unit.go#L13)
- [position.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/position.go#L14)
- [user_credential.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/user_credential.go#L1)
- [login_policy.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/login_policy.go#L1)

### 3.3 关系表

一对一 / 传统关系模型：

- `UserRole`
- `UserOrgUnit`
- `UserPosition`

一对多租户成员关系模型：

- `Membership`
- `MembershipRole`
- `MembershipOrgUnit`
- `MembershipPosition`

对应 schema：

- [user_role.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/user_role.go#L13)
- [user_org_unit.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/user_org_unit.go#L14)
- [user_position.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/user_position.go#L14)
- [membership.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/membership.go#L17)
- [membership_role.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/membership_role.go#L14)
- [membership_org_unit.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/membership_org_unit.go#L14)
- [membership_position.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/membership_position.go#L14)

### 3.4 主要 repo

- [user_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/user_repo.go#L35)
- [tenant_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/tenant_repo.go)
- [org_unit_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/org_unit_repo.go)
- [position_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/position_repo.go)
- [user_credential_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/user_credential_repo.go)
- [user_role_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/user_role_repo.go)
- [user_org_unit_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/user_org_unit_repo.go)
- [user_position_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/user_position_repo.go)
- [membership_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/membership_repo.go)

结构特点：

- `UserRepo` 是用户域的中心 repo，它同时依赖 `UserRoleRepo`、`UserOrgUnitRepo`、`UserPositionRepo`、`MembershipRepo`
- 这说明“用户”不是单表实体，而是一个带角色、组织、岗位、租户上下文的聚合根

### 3.5 典型调用链

#### 链路 A：后台创建用户

1. `admin-service.UserService.Create`
2. 后台层补 `createdBy / tenantId`，并校验角色合法性
3. 调 `core-service.UserService.Create`
4. [UserService.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/user_service.go#L405) 调 [UserRepo.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/user_repo.go#L465)
5. `UserRepo.Create` 开事务，写 `user` 主表，再写 `user_role / user_org_unit / user_position` 或 `membership*`
6. `UserService.Create` 再调 `UserCredentialRepo.Create` 建立登录凭证

链路特点：

- 用户创建不是单表 insert
- 用户与角色、组织、岗位、租户关系是同一事务的一部分
- 凭证创建是在用户主记录创建之后接续完成

#### 链路 B：登录认证

1. `admin-service.AuthenticationService.Login` 或 `app-service.AuthenticationService.Login`
2. 调 `core-service.AuthenticationService.Login`
3. [AuthenticationService.Login](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/authentication_service.go#L61) 根据 grant type 分流
4. 密码模式下会校验 `UserCredential`
5. 再通过 `UserRepo`、`RoleRepo`、`TenantRepo`、`PermissionRepo` 解析用户、角色、权限、租户状态
6. 最终由 `Authenticator` 产出 token

链路特点：

- 登录逻辑是“认证 + 授权 + token 丰富”的组合流程
- 不是简单查询用户名密码

#### 链路 C：创建租户并附带管理员

1. 后台调用 `admin-service.TenantService.CreateTenantWithAdminUser`
2. 转调 `core-service.TenantService.CreateTenantWithAdminUser`
3. [TenantService.CreateTenantWithAdminUser](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/tenant_service.go#L179) 开事务
4. 创建租户
5. 从模板复制租户管理员角色
6. 用 `UserRepo.CreateWithTx` 创建管理员用户
7. 用 `UserCredentialRepo.CreateWithTx` 创建管理员凭证
8. 把管理员回填给租户

链路特点：

- 这是用户域里最典型的“聚合事务链”
- 说明租户、管理员、角色模板之间是强耦合的领域规则

---

## 4. 权限域

### 4.1 已注册 service

- `RoleService`
- `PermissionService`
- `PermissionGroupService`
- `PolicyEvaluationLogService`
- `ApiService`
- `MenuService`

### 4.2 核心实体

- `Role`
- `Permission`
- `PermissionGroup`
- `Api`
- `Menu`
- `PolicyEvaluationLog`
- `RoleMetadata`

对应 schema：

- [role.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/role.go#L14)
- [permission.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/permission.go#L13)
- [permission_group.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/permission_group.go#L13)
- [api.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/api.go#L13)
- [menu.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/menu.go#L15)
- [policy_evaluation_log.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/policy_evaluation_log.go#L1)
- [role_metadata.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/role_metadata.go#L1)

### 4.3 关系表

- `RolePermission`
- `PermissionApi`
- `PermissionMenu`
- `PermissionPolicy`
- `UserRole`

对应 schema：

- [role_permission.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/role_permission.go#L14)
- [permission_api.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/permission_api.go#L13)
- [permission_menu.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/permission_menu.go#L13)
- [permission_policy.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/permission_policy.go#L14)
- [user_role.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/user_role.go#L13)

### 4.4 主要 repo

- [role_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/role_repo.go#L23)
- [role_metadata_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/role_metadata_repo.go)
- [role_permission_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/role_permission_repo.go)
- [permission_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/permission_repo.go#L23)
- [permission_group_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/permission_group_repo.go)
- [permission_api_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/permission_api_repo.go)
- [permission_menu_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/permission_menu_repo.go)
- [permission_policy_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/permission_policy_repo.go)
- [api_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/api_repo.go)
- [menu_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/menu_repo.go)

结构特点：

- `RoleRepo` 依赖 `RolePermissionRepo`、`PermissionRepo`、`RoleMetadataRepo`、`UserRoleRepo`
- `PermissionRepo` 依赖 `PermissionApiRepo`、`PermissionMenuRepo`
- `PermissionService` 又额外依赖 `MenuRepo`、`ApiRepo`、`RoleRepo`

这说明权限域本质上分成两层：

- 权限模型层：角色、权限、权限组、策略
- 资源映射层：API 资源、菜单资源，以及权限到资源的映射

### 4.5 典型调用链

#### 链路 A：后台获取菜单与权限码

1. `admin-service.AdminPortalService.GetNavigation / GetMyPermissionCode`
2. 先调 `core-service.RoleService.ListPermissionIds`
3. 再调 `core-service.PermissionService.ListPermissionResources` 或 `ListPermissionCodesByIds`
4. 菜单场景下继续调 `core-service.MenuService.List`

关键代码：

- [admin_portal_service.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/internal/service/admin_portal_service.go#L83)
- [RoleService.ListPermissionIds](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/role_service.go#L246)
- [PermissionService.ListPermissionResources](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/permission_service.go#L337)

链路特点：

- 先由角色求权限，再由权限求资源
- `ApiService` 和 `MenuService` 更像资源字典
- `PermissionService` 是权限模型和资源模型之间的桥梁

#### 链路 B：登录后的授权装配

1. `AuthenticationService.Login`
2. 通过 `UserRepo.ListRoleIDsByUserID` 查角色
3. 通过 `RoleRepo.ListPermissionIDsByRoleIDs` 查权限
4. 再根据权限生成或补全 token 载荷

链路特点：

- 权限域与用户域在登录和鉴权阶段深度协同
- 权限并不独立存在，它最终服务于用户授权上下文

#### 链路 C：权限同步

`PermissionService.SyncPermissions` 负责把资源定义和权限定义做同步整理，适合视作“权限域的模型维护入口”。

---

## 5. 内容域

### 5.1 已注册 service

- `PostService`
- `CategoryService`
- `TagService`
- `PageService`
- `CommentService`

### 5.2 核心实体

- `Post`
- `Category`
- `Tag`
- `Page`
- `Comment`

对应 schema：

- [post.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/post.go#L16)
- [category.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/category.go#L14)
- [tag.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/tag.go#L13)
- [page.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/page.go#L16)
- [comment.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/comment.go#L13)

### 5.3 关系表 / 扩展表

多语言扩展：

- `PostTranslation`
- `CategoryTranslation`
- `TagTranslation`
- `PageTranslation`

内容关系表：

- `PostCategory`
- `PostTag`

对应 schema：

- [post_translation.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/post_translation.go#L14)
- [category_translation.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/category_translation.go#L14)
- [tag_translation.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/tag_translation.go#L14)
- [page_translation.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/page_translation.go#L14)
- [post_category.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/post_category.go#L14)
- [post_tag.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/post_tag.go#L14)

### 5.4 主要 repo

- [post_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/post_repo.go#L28)
- [post_translation_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/post_translation_repo.go)
- [post_category_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/post_category_repo.go)
- [post_tag_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/post_tag_repo.go)
- [category_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/category_repo.go)
- [category_translation_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/category_translation_repo.go)
- [tag_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/tag_repo.go)
- [tag_translation_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/tag_translation_repo.go)
- [page_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/page_repo.go)
- [page_translation_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/page_translation_repo.go)
- [comment_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/comment_repo.go)

结构特点：

- `PostRepo` 同时依赖 `PostTranslationRepo`、`PostCategoryRepo`、`PostTagRepo`
- 文章是内容域最典型的聚合根
- `Category / Tag / Page` 的结构也都有“主表 + translation 表”的模式
- `Comment` 相对独立，没有单独的 translation 关系表

### 5.5 典型调用链

#### 链路 A：后台创建文章

1. `admin-service.PostService.Create`
2. 后台层补操作人上下文
3. 调 `core-service.PostService.Create`
4. [PostService.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/post_service.go#L39) 调 [PostRepo.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/post_repo.go#L415)
5. `PostRepo.Create` 在事务里写：
   - `post`
   - `post_translation`
   - `post_category`
   - `post_tag`

链路特点：

- 内容创建是典型的“主实体 + 多语言 + 关联分类/标签”事务
- 文章比分类、标签、页面更复杂，适合作为内容域样板

#### 链路 B：前台获取文章

1. `app-service.PostService.List / Get`
2. 调 `core-service.PostService.List / Get`
3. `PostRepo` 根据 field mask / filter 决定是否带 translation 信息

链路特点：

- 内容域在查询阶段已经考虑多语言字段的裁剪与拼装

#### 链路 C：分类、标签、页面的多语言维护

`CategoryService`、`TagService`、`PageService` 都暴露了：

- `TranslationExists`
- `GetTranslation`
- `CreateTranslation`
- `UpdateTranslation`
- `DeleteTranslation`

这说明多语言不是附属功能，而是内容域的一等能力。

---

## 6. 站点域

### 6.1 已注册 service

- `SiteService`
- `SiteSettingService`
- `NavigationService`
- `NavigationItemService`

### 6.2 核心实体

- `Site`
- `SiteSetting`
- `Navigation`
- `NavigationItem`

对应 schema：

- [site.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/site.go#L13)
- [site_setting.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/site_setting.go#L13)
- [navigation.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/navigation.go#L13)
- [navigation_item.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/navigation_item.go#L14)

### 6.3 关系表

显式独立关系表不多，核心关系主要体现在：

- `Navigation` 与 `NavigationItem` 的一对多结构
- `Site` 与 `SiteSetting` 的站点配置关系

### 6.4 主要 repo

- [site_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/site_repo.go)
- [site_setting_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/site_setting_repo.go)
- [navigation_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/navigation_repo.go#L20)
- [navigation_item_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/navigation_item_repo.go)

结构特点：

- `NavigationRepo` 依赖 `NavigationItemRepo`
- 导航在模型上不是“单表平铺”，而是“导航头 + 导航项集合”

### 6.5 典型调用链

#### 链路 A：后台创建导航

1. `admin-service.NavigationService.Create`
2. 转调 `core-service.NavigationService.Create`
3. [NavigationService.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/navigation_service.go#L38)
4. [NavigationRepo.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/navigation_repo.go#L176)
5. `NavigationRepo.Create` 在事务里先写 `navigation`，再通过 `NavigationItemRepo.BatchCreate` 写 `navigation_item`

链路特点：

- 导航项是导航聚合的一部分
- 站点域里最明显的“主实体 + 子项集合”模型就在这里

#### 链路 B：前台获取导航

1. `app-service.NavigationService.List`
2. 调 `core-service.NavigationService.List`
3. `NavigationRepo.List` 查询导航，并进一步装配对应的导航项树

链路特点：

- 站点域天然服务于前台展示
- 但真实数据归属仍在 `core-service`

---

## 7. 审计域

### 7.1 已注册 service

- `LoginAuditLogService`
- `ApiAuditLogService`
- `OperationAuditLogService`
- `DataAccessAuditLogService`
- `PermissionAuditLogService`

边界上相邻的记录型能力：

- `PolicyEvaluationLogService`

### 7.2 核心实体

- `LoginAuditLog`
- `ApiAuditLog`
- `OperationAuditLog`
- `DataAccessAuditLog`
- `PermissionAuditLog`

对应 schema：

- [login_audit_log.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/login_audit_log.go#L16)
- [api_audit_log.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/api_audit_log.go#L16)
- [operation_audit_log.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/operation_audit_log.go#L17)
- [data_access_audit_log.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/data_access_audit_log.go#L16)
- [permission_audit_log.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/permission_audit_log.go#L14)

### 7.3 关系表

审计域当前基本没有独立关系表，主要是日志主记录。

例外是 `ApiAuditLog` 在查询时会借助 `ApiRepo` 做接口说明反查，这是查询 enrich，不是关系表。

### 7.4 主要 repo

- [login_audit_log_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/login_audit_log_repo.go)
- [api_audit_log_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/api_audit_log_repo.go)
- [operation_audit_log_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/operation_audit_log_repo.go)
- [data_access_audit_log_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/data_access_audit_log_repo.go)
- [permission_audit_log_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/permission_audit_log_repo.go)

### 7.5 典型调用链

#### 链路 A：后台 HTTP API 审计

1. `admin-service` 的 REST middleware 采集请求
2. 直接调 `core-service.ApiAuditLogService.Create`
3. `ApiAuditLogRepo.Create` 落库

入口见：

- [admin rest middleware](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/internal/server/rest_server.go#L27)
- [ApiAuditLogService.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/api_audit_log_service.go#L93)

#### 链路 B：后台登录日志

1. `admin-service` 的登录审计中间件采集登录行为
2. 调 `core-service.LoginAuditLogService.Create`
3. `LoginAuditLogRepo.Create` 落库

#### 链路 C：查询 API 审计时补接口描述

1. 调 `ApiAuditLogService.List / Get`
2. 先查日志表
3. 再通过 `ApiRepo` 反查 path/method 对应的 API 描述和模块

关键代码：

- [ApiAuditLogService.queryApis](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/api_audit_log_service.go#L39)

链路特点：

- 审计域本身以记录为主
- 但 API 审计查询时会反向依赖权限域中的 API 资源定义

---

## 8. 文件域

### 8.1 已注册 service

- `FileService`

已实现但当前未注册：

- `FileTransferService`

### 8.2 核心实体

- `File`

对应 schema：

- [file.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/file.go#L14)

### 8.3 关系表

当前没有独立关系表，文件域核心是文件元数据表。

### 8.4 主要 repo

- [file_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/file_repo.go#L23)

结构特点：

- `FileService` 同时依赖 `FileRepo` 和 `MinIOClient`
- 这说明文件域不是纯数据库域，而是“对象存储 + 元数据”的双写模型

### 8.5 典型调用链

#### 链路 A：上传文件并登记元数据

1. `admin-service.FileTransferService.UploadFile` 或 `app-service.FileTransferService.UploadFile`
2. 先把文件传到 MinIO
3. 再调 `core-service.FileService.Create`
4. `FileRepo.Create` 写入 `file` 元数据

对应入口：

- [admin file transfer](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/internal/service/file_transfer_service.go#L115)
- [app file transfer](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/app/service/internal/service/file_transfer_service.go#L103)

#### 链路 B：删除文件

1. 调 `core-service.FileService.Delete`
2. 先查文件元数据
3. 删除数据库记录
4. 删除 MinIO 对象

关键代码：

- [FileService.Delete](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/file_service.go#L60)

链路特点：

- 文件删除是“先元数据、再对象存储”的双阶段清理
- 文件域更关注存储对象的登记和生命周期，而不是展示语义

---

## 9. 媒体域

### 9.1 已注册 service

- `MediaAssetService`

### 9.2 核心实体

- `MediaAsset`
- `MediaVariant`

对应 schema：

- [media_asset.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/media_asset.go#L13)
- [media_variant.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/ent/schema/media_variant.go#L14)

### 9.3 关系表

媒体域的核心关系不是独立的 join 表，而是：

- `MediaAsset` 作为媒体主记录
- `MediaVariant` 作为媒体变体记录

可以理解为“一主多变体”的资源模型。

### 9.4 主要 repo

- [media_asset_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/media_asset_repo.go#L18)
- [media_variant_repo.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/media_variant_repo.go)

结构特点：

- `MediaAssetRepo` 构造时依赖 `MediaVariantRepo`
- 但当前暴露出来的 `MediaAssetService` 主要围绕媒体主记录本身做 CRUD

### 9.5 典型调用链

#### 链路 A：后台上传媒体

1. `admin-service.FileTransferService` 先上传文件到 MinIO
2. 调 `core-service.FileService.Create` 记录文件
3. 再调 `core-service.MediaAssetService.Create` 建立媒体资产
4. `MediaAssetRepo.Create` 写入 `media_asset`

关键代码：

- [admin file transfer media create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/admin/service/internal/service/file_transfer_service.go#L487)
- [MediaAssetService.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/media_asset_service.go#L38)
- [MediaAssetRepo.Create](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/media_asset_repo.go#L149)

链路特点：

- 媒体域建立在文件域之上
- 文件域解决“存哪里、怎么删”，媒体域解决“这是什么资源、有哪些展示属性”

#### 链路 B：后台维护媒体属性

1. `admin-service.MediaAssetService.Update`
2. 补 `updatedBy`
3. 调 `core-service.MediaAssetService.Update`
4. `MediaAssetRepo.Update` 更新标题、说明、尺寸、状态等元数据

---

## 10. 跨领域观察

### 10.1 用户域和权限域耦合最深

原因：

- 登录要查角色、权限
- 用户创建要绑定角色
- 租户初始化要复制角色模板

所以凡是“身份 + 授权”的需求，大概率要同时看用户域和权限域。

### 10.2 内容域和站点域是相邻但分开的

- 内容域解决“有什么内容”
- 站点域解决“这些内容怎样在站点中组织和呈现”

不要把站点导航、站点设置直接塞进内容域。

### 10.3 文件域和媒体域是上下层关系

- 文件域偏基础设施，关注对象存储和文件元数据
- 媒体域偏业务资源，关注媒体展示、描述、处理状态和变体

如果以后做“视频转码、图片缩略图、多尺寸裁剪”，优先扩媒体域，而不是继续堆到文件域。

### 10.4 审计域是横切能力

它本身不拥有主业务实体，但会被几乎所有领域写入。

如果你后面做 `trade`：

- 订单、支付本体属于新业务域
- 订单操作日志、支付日志、风控日志是否进入审计域，要单独设计

---

## 11. 对后续新增 trade 的启示

如果未来新增 `trade`，可以先用这张图来判断：

- 如果它像“用户/权限/内容”这样有明确实体、关系表、事务边界，就适合作为独立领域落到 `core-service`
- 如果它只是给后台拼一个聚合接口，就不该放进 `core-service`
- 如果它需要“订单主表 + 订单项 + 支付流水 + 状态流转日志”，那它的形态更接近“用户域”或“内容域”的聚合设计，而不是“文件域”的简单 CRUD

---

## 12. 快速索引

最适合快速了解当前真实依赖面的文件：

- [grpc_server.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/server/grpc_server.go#L37)
- [wire_gen.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/cmd/server/wire_gen.go#L25)
- [service/providers/wire_set.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/service/providers/wire_set.go#L19)
- [data/providers/wire_set.go](C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/core/service/internal/data/providers/wire_set.go#L19)

如果要判断一个新需求放在哪个领域，推荐顺序：

1. 先看它属于哪个核心实体
2. 再看它需不需要新的关系表
3. 再看它是“聚合事务”还是“BFF 编排”
4. 最后决定放 `core-service` 还是 `admin/app-service`
