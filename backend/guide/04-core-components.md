# 04. 基础组件与共享包

这一篇解决的问题是：

- `pkg/` 下面那些目录到底是干什么的
- 做需求时常见基础能力应该先看哪里
- 什么时候应该复用共享组件，什么时候不该自己再造一套

你不需要把所有包的源码一次看完，但至少要形成一张“能力地图”。

## 先建立整体印象

`pkg/` 下面放的是跨服务复用的基础能力。它们通常服务于多个运行时服务，而不是某一个业务接口。

当前最重要的包可以先分成 5 类：

| 分类 | 目录 | 作用 |
|---|---|---|
| 服务与发现 | `serviceid` | 统一服务名和服务发现标识 |
| 请求与鉴权 | `middleware`、`jwt`、`metadata`、`authorizer` | 请求链、token、操作者信息、权限判定 |
| 基础设施封装 | `oss`、`crypto`、`entgo` | 对象存储、加解密、Ent 辅助 |
| 业务增强能力 | `content`、`eventbus`、`task` | 内容处理、事件驱动、任务数据 |
| 运行时扩展与工具 | `lua`、`utils`、`constants` | Lua 脚本能力、工具函数、常量定义 |

## 组件速查表

下面这张表可以当成“遇到问题先看哪里”的导航。

| 组件 | 你应该在什么时候想到它 | 典型使用位置 |
|---|---|---|
| `pkg/serviceid` | 新增服务、查服务发现、创建 gRPC client 时 | 各服务 `main.go`、`internal/data/data.go` |
| `pkg/middleware` | 想做 token 校验、日志、上下文透传时 | `internal/server/`、BFF 层 |
| `pkg/jwt` | 想看 token 载荷、解析 JWT 时 | 鉴权相关 service / middleware |
| `pkg/metadata` | 想取 operator、tenant、用户上下文时 | admin/app 的 service 层 |
| `pkg/authorizer` | 想看权限模型和授权数据结构时 | 权限相关逻辑 |
| `pkg/oss` | 想做文件上传、下载、对象存储时 | 文件传输、媒体相关逻辑 |
| `pkg/crypto` | 想做敏感配置加密、AES 工具时 | 任务、密码、敏感数据处理 |
| `pkg/content` | 想做摘要、计数、内容相关通用能力时 | 内容能力扩展 |
| `pkg/eventbus` | 想做事件驱动、订阅发布时 | 异步解耦、系统事件 |
| `pkg/lua` | 想让脚本访问 Go 能力时 | Lua 扩展运行时 |
| `pkg/entgo` | 想看 Ent 和 viewer 之类的基础辅助时 | 数据层 |
| `pkg/utils` | 想找常见转换器、工具方法时 | 多个 service / data 层 |

## 1. `pkg/serviceid`

代码位置：

```text
pkg/serviceid/service_id.go
```

它解决的问题是：

- 不让每个服务在代码里手写一堆字符串常量
- 把服务发现名称收敛到统一入口

你会在这里看到：

- `AdminService`
- `AppService`
- `UserService`
- `BookService`
- `TradeService`
- `DTMService`

### 什么时候应该先看它

- 你新增一个独立服务
- 你创建一个新的 gRPC client
- 你排查“服务注册了但别人调不到”

### 典型用法

- `main.go` 里设置当前服务的 `AppId`
- `internal/data/data.go` 里用 `serviceid.NewDiscoveryName(...)` 连接下游

### 不该怎么用

- 不要在各处写死 `"user-service"` 这类字符串
- 不要绕开它自己拼服务发现名

## 2. `pkg/middleware`

当前你会看到几个主要子目录：

- `pkg/middleware/auth`
- `pkg/middleware/ent`
- `pkg/middleware/logging`

它解决的问题是：

- 把通用请求链逻辑抽出来
- 避免每个服务自己重复实现 token 校验、日志、上下文注入

### `auth`

适合查看场景：

- 当前用户是怎么从上下文里取出来的
- token 校验在哪一层做
- BFF 怎么拿 operator / userId

### `logging`

适合查看场景：

- 请求日志增强
- 想在日志里补更多上下文

### `ent`

适合查看场景：

- Ent 数据访问和上下文之间如何打通

### 不该怎么用

- 不要把业务规则塞进 middleware
- middleware 更适合放通用请求链逻辑，而不是实体规则

## 3. `pkg/jwt`

它解决的问题是：

- token 载荷结构
- JWT 相关的共用处理

适合查看场景：

- 你想知道 token 里到底有哪些字段
- 你在排查用户身份、租户、角色相关的 token 信息

通常和这些位置一起看：

- `pkg/middleware/auth`
- `pkg/metadata`
- `app/user/service/internal/service/authentication_service.go`

## 4. `pkg/metadata`

它解决的问题是：

- 在请求上下文中统一传递操作者信息
- 在 service 层读取 operator、tenant 等上下文数据

适合查看场景：

- `admin-service` 里补 `createdBy`
- `app-service` 里取“当前登录用户”
- 想知道上下文里有哪些用户元数据

这是 BFF 层特别常用的基础包。

## 5. `pkg/authorizer`

它解决的问题是：

- 授权模型和权限判定相关的共用结构

适合查看场景：

- 做权限相关需求
- 想知道授权数据长什么样
- 想看权限引擎接入点

如果你在做：

- 角色
- 权限组
- API 权限
- 策略判定

这个包值得优先看。

## 6. `pkg/oss`

主要文件：

- `pkg/oss/minio.go`
- `pkg/oss/utils.go`

它解决的问题是：

- 对 MinIO / 对象存储能力的统一封装

适合查看场景：

- 文件上传
- 文件下载
- 媒体资源处理
- 想知道对象存储能力应该怎么复用

通常会和这些地方一起出现：

- `app/admin/service/internal/service/file_transfer_service.go`
- `app/app/service/internal/service/file_transfer_service.go`
- 各服务 `configs/oss.yaml`

### 不该怎么用

- 不要在业务 service 里重复创建临时 MinIO client
- 统一通过已有 data/provider 装配注入

## 7. `pkg/crypto`

当前有现成 README：

- [../pkg/crypto/README.md](../pkg/crypto/README.md)

它解决的问题是：

- 敏感配置加密
- AES-256-GCM 加解密

适合查看场景：

- 数据库存储的敏感字段需要加密
- 想复用现成加解密能力

注意点：

- 它是基础能力，不等于认证系统本身
- 需要严格区分“密码哈希”和“可逆加密”

## 8. `pkg/content`

它解决的问题是：

- 内容相关的通用能力，比如摘要、计数等

适合查看场景：

- 内容增强
- 摘要生成
- 内容处理的公共逻辑

如果你的需求只是某个接口自己的返回拼装，通常不需要上升到这个层面。

## 9. `pkg/eventbus`

当前有现成 README：

- [../pkg/eventbus/README.md](../pkg/eventbus/README.md)

它解决的问题是：

- 通过发布 / 订阅做松耦合事件驱动

适合查看场景：

- 某个动作发生后，想通知多个后续处理器
- 不希望业务模块彼此强耦合

### 什么时候适合用

- 非主事务链路
- 异步后处理
- 系统事件广播

### 什么时候不适合用

- 当前请求必须同步拿结果
- 强事务一致性的主链路

## 10. `pkg/lua`

当前有现成入口说明：

- [../pkg/lua/api/README.md](../pkg/lua/api/README.md)

它解决的问题是：

- 通过 Lua 脚本扩展 Go 能力
- 让脚本可以调用日志、缓存、事件、OSS、加密等模块

适合查看场景：

- 你要做可配置脚本扩展
- 你要让某些逻辑可被脚本驱动

这不是新手第一阶段必须掌握的能力，但你至少要知道：

- 仓库里已经有脚本运行时扩展
- 不是所有业务逻辑都只能写死在 Go 代码里

## 11. `pkg/entgo`

它解决的问题是：

- 给 Ent 相关能力提供辅助结构

适合查看场景：

- 你在数据层里看到 viewer、editor、system viewer 之类的概念
- 你想知道 Ent 接入周边的共用抽象

## 12. `pkg/utils`

它解决的问题是：

- 放跨模块复用的小工具和转换器

适合查看场景：

- 想找现成的转换器
- 想知道某类重复转换逻辑有没有现成实现

注意点：

- `utils` 很容易变成“什么都往里塞”的地方
- 如果逻辑已经明显属于某个明确领域，优先放回领域包，而不是一股脑塞进 `utils`

## 13. `pkg/constants`

它解决的问题是：

- 存放跨模块复用的常量定义

适合查看场景：

- 你在多个服务里都需要同一组枚举或常量

不建议：

- 把业务决策塞进常量文件
- 把只在单个地方使用的常量提前抽到全局

## 选型口诀：我应该先看哪个包

如果你要做……

- 服务发现：先看 `serviceid`
- 鉴权和当前用户：先看 `middleware/auth`、`jwt`、`metadata`
- 文件上传下载：先看 `oss`
- 敏感字段加密：先看 `crypto`
- 事件解耦：先看 `eventbus`
- 脚本扩展：先看 `lua`
- 小型共享转换逻辑：先看 `utils`

## 使用共享组件时的三个原则

### 1. 先复用，再新增

写新功能前，先在 `pkg/` 搜一下是否已有类似能力。

### 2. 共享层不负责页面逻辑

共享包应该沉淀通用能力，不应该知道某个后台页面怎么展示。

### 3. 改 `pkg/` 要默认它会影响多个服务

只要改的是共享包，就不要假设影响面只在当前服务。

## 这一步完成后你应该掌握什么

读完本篇，你应该已经知道：

- 常见基础能力该先看哪个共享包
- 哪些能力适合沉淀进 `pkg/`
- 哪些逻辑不应该塞进共享层

下一篇请读 [05-api-and-codegen.md](05-api-and-codegen.md)。
