# Proto 依赖导出与 GoLand 配置

## 作用

这个目录提供了两个辅助脚本，用来把 Buf 远程依赖导出到本地文件系统，解决 GoLand 在编辑 `api/protos` 时无法解析远程 `proto` 导入的问题。

典型报错包括：

- `Cannot resolve import 'errors/errors.proto'`
- `Cannot resolve import 'google/api/annotations.proto'`
- `Cannot resolve import 'validate/validate.proto'`
- `Cannot resolve import 'gnostic/openapi/v3/annotations.proto'`

原因很简单：

- 项目通过 [api/buf.yaml](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/api/buf.yaml) 和 [api/buf.lock](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/api/buf.lock) 声明并锁定 Buf 远程依赖
- `buf generate` 可以直接解析这些依赖
- GoLand 不会自动读取 `buf.lock` 并把远程模块当作本地 import roots

所以需要先把这些远程依赖导出到本地，再告诉 GoLand 去哪里找。

## 导出目录

脚本默认把依赖导出到：

```text
api/third_party/buf/
```

这个目录是本地 IDE 辅助目录，可以随时重新生成，已经加入 `.gitignore`。

## 脚本

- Windows PowerShell: [export_buf_deps.ps1](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/scripts/proto/export_buf_deps.ps1)
- Linux/macOS: [export_buf_deps.sh](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/scripts/proto/export_buf_deps.sh)

两个脚本都会：

- 检查 `buf` 是否已安装
- 读取 [api/buf.lock](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/api/buf.lock) 里的依赖名和固定 commit
- 用 `buf export` 导出所有远程依赖
- 先导出到 staging 目录，全部成功后再替换正式目录

## 使用方式

### Windows

在仓库根目录执行：

```powershell
.\scripts\proto\export_buf_deps.ps1
```

只预览将要导出的依赖，不实际下载：

```powershell
.\scripts\proto\export_buf_deps.ps1 -DryRun
```

指定 `api` 目录：

```powershell
.\scripts\proto\export_buf_deps.ps1 -ApiDir .\api
```

指定输出目录：

```powershell
.\scripts\proto\export_buf_deps.ps1 -OutputDir .\api\third_party\buf
```

### Linux/macOS

在仓库根目录执行：

```bash
bash scripts/proto/export_buf_deps.sh
```

只预览将要导出的依赖，不实际下载：

```bash
bash scripts/proto/export_buf_deps.sh --dry-run
```

指定 `api` 目录：

```bash
bash scripts/proto/export_buf_deps.sh --api-dir ./api
```

指定输出目录：

```bash
bash scripts/proto/export_buf_deps.sh --output-dir ./api/third_party/buf
```

## 导出后应看到的文件

脚本执行成功后，本地应至少存在这些文件：

```text
api/third_party/buf/errors/errors.proto
api/third_party/buf/google/api/annotations.proto
api/third_party/buf/validate/validate.proto
api/third_party/buf/gnostic/openapi/v3/annotations.proto
api/third_party/buf/pagination/v1/pagination.proto
```

如果这些文件存在，GoLand 的 import 解析就有了本地基础。

## GoLand 配置步骤

### 1. 安装插件

在 GoLand 中安装 JetBrains 官方的 `Protocol Buffers` 插件。

### 2. 打开正确的项目根目录

建议直接打开：

```text
<repo>/backend
```

不要只单独打开 `api/protos`，否则 IDE 的项目上下文和路径配置会更容易混乱。

### 3. 先执行依赖导出脚本

在配置 GoLand 之前，先确保：

```text
api/third_party/buf
```

已经由脚本生成。

### 4. 配置 Proto import roots

在 GoLand 中打开：

```text
Settings / Preferences
-> Languages & Frameworks
-> Protocol Buffers
```

把下面两个目录加入 import paths：

```text
<repo>/backend/api/protos
<repo>/backend/api/third_party/buf
```

只要这两个根目录在，绝大多数项目内和远程依赖导入都能被解析。

原因是：

- `api/protos` 包含项目自己的 `proto`
- `api/third_party/buf` 包含导出的全部 Buf 远程依赖

### 5. 重新索引

如果配置后还有红线：

1. 关闭当前 `.proto` 文件标签页后重新打开
2. 重启 GoLand
3. 仍然不生效时，执行 `File -> Invalidate Caches`

## 常见导入与来源模块对照

| 导入前缀 | 来源模块 |
|---|---|
| `errors/` | `buf.build/kratos/apis` |
| `google/api/` | `buf.build/googleapis/googleapis` |
| `validate/` | `buf.build/envoyproxy/protoc-gen-validate` |
| `gnostic/openapi/v3/` | `buf.build/gnostic/gnostic` |
| `pagination/v1/` | `buf.build/tx7do/pagination` |
| `redact/v3/` | `buf.build/menta2k-org/redact` |

## 和 `buf generate` 的关系

这个导出脚本只服务于 IDE 解析和跳转，不替代正式代码生成。

项目里的正式生成流程仍然应该使用：

```bash
cd api
buf generate
```

或者在仓库根目录使用现有入口：

```bash
make api
make openapi
```

不要把 GoLand 内置的 `protoc` 生成流程当作项目标准生成方式；这里的标准仍然是 Buf。

## 什么时候需要重跑

以下情况建议重跑一次导出脚本：

- `api/buf.lock` 变了
- `api/buf.yaml` 的 `deps` 变了
- 切换到另一个分支后，GoLand 又开始报 import 无法解析
- 你清理了 `api/third_party/buf`

## 相关文件

- [api/buf.yaml](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/api/buf.yaml)
- [api/buf.lock](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/api/buf.lock)
- [scripts/README.md](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/scripts/README.md)
- [README.md](/C:/Users/CatBread/GolandProjects/go-wind-cms/backend/README.md)
