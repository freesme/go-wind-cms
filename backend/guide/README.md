# GoWind Backend 新手教程

这套文档面向第一次接触 `backend/` 仓库的开发者，目标不是只让你“把服务跑起来”，而是让你逐步达到下面这几个层次：

1. 能看懂这个仓库的真实结构
2. 能独立启动和调试项目
3. 知道一个需求应该改哪一层
4. 能独立新增一个接口
5. 能判断一个新能力应该放进现有核心域，还是拆成新服务

本教程以当前代码真实结构为准，不按理想化架构图写，也不会把旧文档里的历史说法当作唯一事实。

## 先记住两个关键事实

### 1. 当前真正的核心后端在 `app/user/service`

很多旧文档会把核心后端叫做 `core-service`，这在概念上没错，但当前仓库里真正承载核心业务逻辑的源码目录是：

```text
app/user/service
```

你会在这里看到：

- gRPC 核心业务服务
- 领域逻辑
- Ent 数据访问
- 认证、权限、内容、站点、审计、任务等主能力

也就是说：

- 文档里提到“core-service”时，当前多数情况下应该映射到 `app/user/service`
- 不要直接把 `app/core/service` 当成主开发入口

### 2. `admin-service` 和 `app-service` 主要是 BFF 层

这两个服务更多负责：

- 对外暴露 HTTP / SSE
- 鉴权和上下文补写
- 参数整理
- 请求编排
- 调核心 gRPC 服务

所以当你做需求时，第一判断通常不是“我要改哪个页面对应的服务”，而是：

- 这是核心领域能力吗
- 这是后台专属接口吗
- 这是前台专属接口吗

## 推荐阅读顺序

如果你是第一次接手这个项目，建议按下面顺序读：

1. [01-quick-start.md](01-quick-start.md)
2. [02-project-map.md](02-project-map.md)
3. [03-runtime-architecture.md](03-runtime-architecture.md)
4. [04-core-components.md](04-core-components.md)
5. [05-api-and-codegen.md](05-api-and-codegen.md)
6. [06-how-to-add-an-endpoint.md](06-how-to-add-an-endpoint.md)
7. [07-how-to-add-a-service.md](07-how-to-add-a-service.md)
8. [08-debugging-and-faq.md](08-debugging-and-faq.md)
9. [09-learning-path.md](09-learning-path.md)

如果你已经能跑起来项目，只想尽快开发功能，推荐最短路线：

1. [02-project-map.md](02-project-map.md)
2. [03-runtime-architecture.md](03-runtime-architecture.md)
3. [05-api-and-codegen.md](05-api-and-codegen.md)
4. [06-how-to-add-an-endpoint.md](06-how-to-add-an-endpoint.md)

## 这套教程覆盖什么

这套教程会重点覆盖：

- 仓库顶层目录和每一层的职责
- 当前服务之间的真实协作关系
- 常见基础组件和共享包的用途
- `api`、`buf`、`wire`、`ent`、`openapi`、`ts` 的关系
- 新增接口和新增服务的标准流程
- 新手最常见的构建、配置、注册、服务发现问题

这套教程不会展开讲：

- 前端工程内部实现
- 业务需求本身的产品设计
- 所有底层库的完整 API 手册

## 章节说明

| 文档 | 解决的问题 |
|---|---|
| [01-quick-start.md](01-quick-start.md) | 第一次怎么启动和验证项目 |
| [02-project-map.md](02-project-map.md) | 仓库结构怎么看，哪些目录该改，哪些不能手改 |
| [03-runtime-architecture.md](03-runtime-architecture.md) | 服务之间怎么协作，哪层该放什么逻辑 |
| [04-core-components.md](04-core-components.md) | 常见基础组件和共享包该怎么理解和使用 |
| [05-api-and-codegen.md](05-api-and-codegen.md) | proto、代码生成、OpenAPI、TS SDK、Ent、Wire 是怎么串起来的 |
| [06-how-to-add-an-endpoint.md](06-how-to-add-an-endpoint.md) | 新增一个接口该按什么顺序做 |
| [07-how-to-add-a-service.md](07-how-to-add-a-service.md) | 什么时候该新建服务，怎么新建 |
| [08-debugging-and-faq.md](08-debugging-and-faq.md) | 常见问题怎么排查 |
| [09-learning-path.md](09-learning-path.md) | 不同目标下应该怎么学这个项目 |

## 使用方式

建议把这套文档当作“主入口”，把旧文档当作“参考资料”：

- 第一次看项目，从这里开始
- 遇到具体问题，再跳到旧文档和对应源码
- 不要一开始就陷入多个 README 来回跳转

## 参考资料

这些旧文档仍然有价值，但在新手阅读顺序上应该排在 `guide/` 之后：

- [../README.md](../README.md)
  - 仓库根简介
- [../STARTUP.md](../STARTUP.md)
  - 当前启动说明
- [../SERVICE_API_PLAYBOOK.md](../SERVICE_API_PLAYBOOK.md)
  - 新服务 / 新 API 的专题型开发手册
- [../app/user/service/README.md](../app/user/service/README.md)
  - 当前核心后端说明
- [../app/admin/service/README.md](../app/admin/service/README.md)
  - 后台 BFF 说明
- [../app/app/service/README.md](../app/app/service/README.md)
  - 前台 BFF 说明
- [../scripts/README.md](../scripts/README.md)
  - 脚本总览
- [../scripts/proto/README.md](../scripts/proto/README.md)
  - GoLand / Buf 远程 proto 依赖说明

## 读完后你应该能做到什么

完成这套文档后，你应该能够：

- 说清楚 `api/`、`app/`、`pkg/`、`scripts/` 分别负责什么
- 知道“需求应该放到 user-service、admin-service 还是 app-service”
- 知道改 proto 后要执行什么生成命令
- 能独立增加一个新的 HTTP / gRPC 接口
- 能判断一个新能力是否应该拆成独立服务

下一步先读 [01-quick-start.md](01-quick-start.md)。
