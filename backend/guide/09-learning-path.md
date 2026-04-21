# 09. 学习路径

这一篇解决的问题是：

- 如果你时间有限，应该先学什么
- 如果你想尽快能开发功能，应该怎么读
- 如果你要承担接口或服务设计工作，应该补哪些部分

## 路线一：一周内达到“能独立开发功能”

这是最推荐的新手路线。

### 第 1 天

完成：

1. [01-quick-start.md](01-quick-start.md)
2. [02-project-map.md](02-project-map.md)

目标：

- 能把主链路启动起来
- 知道顶层目录和主要服务在哪

### 第 2 天

完成：

1. [03-runtime-architecture.md](03-runtime-architecture.md)
2. [04-core-components.md](04-core-components.md)

目标：

- 能判断逻辑该放 BFF 还是核心后端
- 知道鉴权、上下文、服务发现、对象存储等基础能力大概在哪

### 第 3 天

完成：

1. [05-api-and-codegen.md](05-api-and-codegen.md)

目标：

- 搞清楚 proto、Go 代码、OpenAPI、TS SDK、Ent、Wire 的关系
- 不再乱改生成代码

### 第 4 天到第 5 天

完成：

1. [06-how-to-add-an-endpoint.md](06-how-to-add-an-endpoint.md)

目标：

- 跟着流程实际加一个小接口
- 能独立完成一次从 proto 到 build 的完整闭环

### 第 6 天到第 7 天

完成：

1. [08-debugging-and-faq.md](08-debugging-and-faq.md)
2. 回看你实际改过的代码

目标：

- 遇到问题时知道先排哪一层
- 不再把时间浪费在错误方向上

## 路线二：尽快读懂架构

如果你不是马上写代码，而是先要接手系统、带人、评估改造方案，推荐这样读：

1. [02-project-map.md](02-project-map.md)
2. [03-runtime-architecture.md](03-runtime-architecture.md)
3. [04-core-components.md](04-core-components.md)
4. [07-how-to-add-a-service.md](07-how-to-add-a-service.md)

然后补读：

- [../app/user/service/README.md](../app/user/service/README.md)
- [../app/admin/service/README.md](../app/admin/service/README.md)
- [../app/app/service/README.md](../app/app/service/README.md)
- [../SERVICE_API_PLAYBOOK.md](../SERVICE_API_PLAYBOOK.md)

## 路线三：只想先把一个需求做出来

如果你现在最关心的是“赶紧加功能”，推荐最短路径：

1. [02-project-map.md](02-project-map.md)
2. [03-runtime-architecture.md](03-runtime-architecture.md)
3. [05-api-and-codegen.md](05-api-and-codegen.md)
4. [06-how-to-add-an-endpoint.md](06-how-to-add-an-endpoint.md)
5. [08-debugging-and-faq.md](08-debugging-and-faq.md)

这条路线的目标不是“理解一切”，而是：

- 知道需求该落哪一层
- 知道改完后要跑什么命令
- 出错后知道先排什么

## 路线四：你要设计新服务

如果你的目标是：

- 拆领域
- 设计服务边界
- 引入新的独立服务

建议先完成：

1. [03-runtime-architecture.md](03-runtime-architecture.md)
2. [05-api-and-codegen.md](05-api-and-codegen.md)
3. [07-how-to-add-a-service.md](07-how-to-add-a-service.md)

然后补读：

- [../SERVICE_API_PLAYBOOK.md](../SERVICE_API_PLAYBOOK.md)
- `book-service` 和 `trade-service` 相关源码

## 每个阶段应该达到的能力

### 入门阶段

你应该能：

- 把项目跑起来
- 知道主链路是哪些服务

### 开发阶段

你应该能：

- 判断需求该改哪一层
- 独立新增一个接口
- 看懂生成链

### 设计阶段

你应该能：

- 判断该不该拆新服务
- 设计 proto 和服务边界
- 评估影响面

## 推荐的源码阅读顺序

如果你准备开始读源码，推荐先看：

1. 各服务 `cmd/server/main.go`
2. 各服务 `cmd/server/wire_gen.go`
3. 各服务 `internal/data/data.go`
4. 各服务 `internal/server/rest_server.go` 或 `grpc_server.go`
5. 各服务 `internal/service/*.go`
6. 核心后端 `internal/data/*.go`

这个顺序的好处是：

- 先知道服务怎么启动
- 再知道依赖怎么装配
- 再知道请求怎么进来
- 最后才进入具体业务逻辑

## 学习时的三个建议

### 1. 不要同时想搞懂所有服务

优先抓住主链路：

- `user-service`
- `admin-service`
- `app-service`

### 2. 先理解分层，再理解业务细节

如果连 BFF 和核心域的边界都没搞清楚，越看细节越容易混乱。

### 3. 每读一篇，最好结合一次真实改动

只看文档不落地，很快就会忘。

最好的方式是：

- 读完接口流程文档
- 立刻去加一个小接口

## 最后你应该把这套教程当成什么

你不需要把它背下来。

更实用的方式是：

- 第一次通读一遍，建立地图
- 后续做事时把对应章节当作操作手册反查

## 继续深入的参考资料

- [../README.md](../README.md)
- [../STARTUP.md](../STARTUP.md)
- [../SERVICE_API_PLAYBOOK.md](../SERVICE_API_PLAYBOOK.md)
- [../scripts/README.md](../scripts/README.md)
- [../scripts/proto/README.md](../scripts/proto/README.md)

如果你读到这里，下一步最合理的动作不是继续找更多文档，而是：

- 挑一个小接口
- 按 [06-how-to-add-an-endpoint.md](06-how-to-add-an-endpoint.md) 走一遍完整流程

这时这套教程才真正开始生效。
