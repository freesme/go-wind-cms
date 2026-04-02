# App Service

`app-service` 是前台应用的 API 门面层，服务对象是 React/Vue3/Taro 等前台客户端。它向前台暴露统一的 REST 和 SSE 接口，把用户中心、导航、内容、评论、文件等请求聚合到 `core-service`。

相关文档：

- [项目总体架构说明](/C:/Users/WIN10/GolandProjects/go-wind-cms/docs/project-architecture.md)

## 服务定位

- 面向对象：前台 Web、多端应用、小程序风格客户端
- 主要协议：HTTP REST、SSE
- 运行角色：前台 BFF / API 门面层
- 数据职责：不拥有核心业务数据，主要通过 gRPC 调 `core-service`

它和 `admin-service` 的关系类似，只是服务对象从“后台管理端”变成了“前台用户与站点端”。

## 端口与协议

配置见 [configs/server.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/app/service/configs/server.yaml)。

- REST：`0.0.0.0:6700`
- SSE：`:6701`
- gRPC：`0.0.0.0:0`

说明：

- 前台客户端主要访问 `6700`
- SSE 用于前台实时推送场景
- 和 `admin-service` 一样，本服务会初始化 gRPC server，但当前业务接口主体仍然是 REST 门面

## 对外暴露的前台能力

注册点见 [internal/server/rest_server.go](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/app/service/internal/server/rest_server.go)。

### 认证

- `AuthenticationService`
  - 登录
  - 退出
  - 刷新令牌

### 用户中心

- `UserProfileService`
  - 获取当前用户
  - 更新资料
  - 修改密码
  - 上传头像
  - 删除头像
  - 绑定联系方式
  - 验证联系方式

### 站点导航

- `NavigationService`

### 内容访问

- `PostService`
- `CategoryService`
- `TagService`
- `PageService`

### 互动能力

- `CommentService`

### 文件能力

- `FileTransferService`
  - 文件下载
  - PUT 上传
  - POST 上传

## 本服务内部做了什么

从 [cmd/server/wire_gen.go](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/app/service/cmd/server/wire_gen.go) 可以看出，`app-service` 的职责比较聚焦：

- 对前台请求做 token 校验
- 暴露前台风格的接口协议和请求路径
- 调用 `core-service` 的认证、用户、内容、导航、评论、文件能力
- 对前台用户资料接口做上下文补写，例如“当前登录用户是谁”
- 在文件上传下载场景里直接配合 MinIO 处理对象流，同时把文件元数据委托给核心服务

典型链路例如前台“获取当前用户”：

- 前台调用 `app-service`
- `UserProfileService` 从 token 中取出当前用户 ID
- 再通过 gRPC 调 `core-service` 的 `UserService.Get`

## 依赖关系

### 上游调用方

- React 前台
- Vue3 前台
- Taro 前台

### 下游依赖

- `core-service`
  - 通过 Etcd 服务发现 + gRPC 调用
  - 认证、用户资料、内容、评论、导航、文件元数据等都来自这里
- MinIO
  - 前台文件传输直接依赖对象存储
- DTM / workflow
  - gRPC server 初始化时接入 workflow

### 基础设施配置

- 服务发现：Etcd，见 [configs/registry.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/app/service/configs/registry.yaml)
- Trace：Jaeger / OTel，见 [configs/trace.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/app/service/configs/trace.yaml)
- 对象存储：MinIO，见 [configs/oss.yaml](/C:/Users/WIN10/GolandProjects/go-wind-cms/backend/app/app/service/configs/oss.yaml)

## 目录结构

```text
app/service/
├─ cmd/server/         # 启动入口、Wire 装配结果、OpenAPI 静态资源
├─ configs/            # server / registry / client / oss / trace 等配置
├─ internal/data/      # gRPC client、服务发现、MinIO、鉴权器等依赖
├─ internal/server/    # REST/SSE/gRPC server 及中间件
└─ internal/service/   # 前台用例层 service
```

重点说明：

- 这里的 `internal/service` 不是核心领域实现，而是前台接口适配层
- 内容、用户、评论等多数 service 只是把请求转发给 `core-service`
- 前台特殊上下文逻辑，例如“当前登录用户”的推导，适合放这里

## 适合放在这里的逻辑

- 前台专属接口路径与协议
- 当前用户上下文处理
- 前台页面需要的轻聚合结果
- 文件传输、头像上传之类靠近客户端交互的编排逻辑

## 不适合放在这里的逻辑

- 用户、内容、评论、导航等实体的底层规则与持久化
- 跨后台与前台都要复用的领域逻辑
- 权限、认证、内容模型等核心规则

这些应该继续留在 `core-service`。

## 开发建议

- 如果需求只影响前台接口形状、认证上下文、前台聚合展示，优先改这里
- 如果需求会影响数据模型、实体规则、多个门面层共享能力，应改 `core-service`
- 前台接口变更时，记得关注 `backend/api/protos/app/service/v1` 和前端生成的 SDK
