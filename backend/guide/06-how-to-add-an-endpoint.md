# 06. 如何新增一个接口

这一篇解决的问题是：

- 新增一个接口时，应该先改哪层
- 后台接口、前台接口、核心领域接口分别怎么做
- 从 proto 到实现到注册到生成，正确顺序是什么

如果你经常不知道“这个接口该写在 admin-service、app-service 还是 user-service”，这一篇就是给你的固定流程。

## 先做判断：这个接口属于哪一层

新增接口之前，先回答下面三个问题：

### 1. 它是不是领域能力

如果这个接口：

- 会落库
- 涉及实体规则
- 会被多个入口复用
- 不应该依赖某个页面的展示形式

优先放到：

```text
app/user/service
```

### 2. 它是不是后台专属接口

如果这个接口只服务于管理后台，比如：

- 后台表格查询
- 后台门户聚合
- 后台 operator 字段补写
- 后台专属上传编排

优先放到：

```text
app/admin/service
```

### 3. 它是不是前台专属接口

如果这个接口只服务于前台客户端，比如：

- 当前用户资料
- 前台导航
- 前台内容聚合
- 前台文件上传下载

优先放到：

```text
app/app/service
```

## 三种最常见的新增接口场景

## 场景 A：在 `user-service(core)` 新增一个领域 gRPC 接口

这类接口的特点是：

- 它是真正的业务能力
- 会操作实体或规则
- 会被 BFF 层复用

### 标准流程

#### 第 1 步：找到对应领域 proto

例如：

- 用户相关：`api/protos/identity/service/v1`
- 内容相关：`api/protos/content/service/v1`
- 站点相关：`api/protos/site/service/v1`
- 交易相关：`api/protos/trade/service/v1`

在对应 proto 里新增 RPC、message、字段。

#### 第 2 步：生成 Go 代码

在仓库根目录执行：

```bash
make api
```

#### 第 3 步：在核心后端实现 service

通常要改：

- `app/user/service/internal/service/*.go`

如果是新 service 文件，就新增一个。

#### 第 4 步：如果涉及数据访问，补 repo 或 data 层

通常要改：

- `app/user/service/internal/data/*.go`

如果涉及新实体或字段，先改：

- `app/user/service/internal/data/ent/schema/*`

然后执行：

```bash
cd app/user/service
make ent
```

#### 第 5 步：注册 gRPC server

检查或修改：

```text
app/user/service/internal/server/grpc_server.go
```

确保新的 service 被真正注册。

#### 第 6 步：如果新增了构造函数，更新 provider set 并重新生成 wire

通常要看：

- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`
- `internal/server/providers/wire_set.go`

然后执行：

```bash
cd app/user/service
make wire
```

#### 第 7 步：编译验证

```bash
cd app/user/service
make build
```

### 什么时候到这里还不够

如果这个能力还要被浏览器直接访问，你还需要继续做 BFF 入口，也就是场景 B 或场景 C。

## 场景 B：在 `admin-service` 新增一个后台 HTTP 接口

这类接口的特点是：

- 面向后台页面
- 可能会调用一个或多个核心 gRPC 接口
- 可能要补 `tenantId`、`createdBy`、`updatedBy`

### 标准流程

#### 第 1 步：定义后台入口 proto

位置通常是：

```text
api/protos/admin/service/v1/i_xxx.proto
```

这里定义的是后台 HTTP 接口，不是核心领域能力本身。

#### 第 2 步：生成代码

在仓库根目录执行：

```bash
make api
make openapi
make ts
```

为什么要三个都跑：

- `make api` 生成 Go 绑定
- `make openapi` 更新 Swagger
- `make ts` 更新前端 SDK

#### 第 3 步：如果需要下游 gRPC client，先补 data 层

通常要改：

```text
app/admin/service/internal/data/data.go
```

如果你新增了一个新的下游 gRPC client，别忘了把构造函数放进：

```text
app/admin/service/internal/data/providers/wire_set.go
```

#### 第 4 步：实现后台 service

通常要改：

```text
app/admin/service/internal/service/*.go
```

这里常做的事情包括：

- 读 operator 上下文
- 补请求字段
- 调下游 gRPC client
- 做后台专属校验
- 组合后台返回模型

#### 第 5 步：注册 HTTP server

检查或修改：

```text
app/admin/service/internal/server/rest_server.go
```

#### 第 6 步：如果新增构造函数，更新 provider set 和 wire

然后执行：

```bash
cd app/admin/service
make wire
make build
```

## 场景 C：在 `app-service` 新增一个前台 HTTP 接口

这类接口和后台接口很像，但更强调：

- 当前用户上下文
- 前台协议形状
- 前台专属聚合

### 标准流程

#### 第 1 步：定义前台入口 proto

位置通常是：

```text
api/protos/app/service/v1/i_xxx.proto
```

#### 第 2 步：生成代码

在仓库根目录执行：

```bash
make api
make openapi
make ts
```

#### 第 3 步：补 data 层下游 client

通常要改：

```text
app/app/service/internal/data/data.go
```

#### 第 4 步：实现前台 service

通常要改：

```text
app/app/service/internal/service/*.go
```

这里常做的事情包括：

- 从 token 上下文中取当前用户
- 调核心后端
- 做前台协议适配

#### 第 5 步：注册 HTTP server

检查或修改：

```text
app/app/service/internal/server/rest_server.go
```

#### 第 6 步：更新 provider set / wire 并编译

```bash
cd app/app/service
make wire
make build
```

## 一个固定的新增接口顺序

不管是哪种接口，推荐顺序都尽量固定：

1. 先判断接口属于哪一层
2. 先改 proto
3. 先生成代码
4. 再写 data / repo / service 逻辑
5. 再补 provider set 和 wire
6. 再补 server register
7. 最后 build 和验证

## 多下游编排接口该怎么写

有些接口不是只调一个下游，而是需要编排多个下游。

常见场景：

- 先查用户，再查角色，再返回组合结果
- 先上传对象存储，再登记文件元数据
- 先查主实体，再查关联资源，再拼装页面结构

这种接口通常更适合放在：

- `admin-service`
- `app-service`

而不是直接塞进共享包。

### 推荐编排顺序

1. 参数校验
2. 上下文解析
3. 前置依赖查询
4. 主操作
5. 关联操作
6. 聚合返回

## 返回模型怎么选

### 能复用下游模型时

优先复用，不要重复造一份。

### 需要聚合多个来源时

定义新的 response，更清晰。

比如：

- 后台门户首页
- 当前用户 + 角色 + 菜单
- 前台订单详情 + 商品摘要

## 最容易漏掉的几个环节

### 1. 改了 proto，但没执行 `make api`

表现：

- 找不到方法
- 新字段不生效

### 2. 写了 service，但没注册 server

表现：

- 编译通过
- 实际访问 404 或 gRPC 方法不存在

### 3. 写了构造函数，但没加进 provider set

表现：

- `wire` 生成失败
- 缺 provider

### 4. admin/app 接口改了，但 Swagger 和前端 SDK 没更新

表现：

- Go 代码已经变了
- Swagger 还是旧的
- 前端调用类型还是旧的

## 新增接口的最小检查清单

每次新增接口，交付前至少自查：

- proto 改了吗
- `make api` 跑了吗
- 如果是 admin/app，对应的 `make openapi` 和 `make ts` 跑了吗
- service 实现写了吗
- 需要的 client / repo 注入了吗
- provider set 补了吗
- server register 补了吗
- `make build` 通过了吗

## 这一步完成后你应该掌握什么

读完本篇，你应该已经可以：

- 判断一个接口该加在哪一层
- 按固定顺序新增一个领域 gRPC 或前后台 HTTP 接口
- 知道每一步应该改 proto、data、service、provider、server 的哪一类文件

下一篇请读 [07-how-to-add-a-service.md](07-how-to-add-a-service.md)。
