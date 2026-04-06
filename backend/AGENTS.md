# Repository Guidelines

## Project Structure & Module Organization
This is a Go microservices backend built around the `app/` service folders and shared `pkg/` libraries.

- Core service modules: `app/admin/service`, `app/app/service`, `app/user/service`, `app/book/service`, `app/trade/service`.
- Shared utilities and infrastructure adapters: `pkg/`.
- API/protocol contracts: `api/`.
- Runtime assets/config: `Dockerfile`, `docker-compose.yaml`, `docker-compose.libs.yaml`, `sql/`.
- Bootstrap/setup scripts: `scripts/`.

Use `app/<name>/service` as the working directory for service-specific generation/build/run commands.

## Build, Test, and Development Commands
- `make help` — list available top-level targets.
- `make dep` — download Go module dependencies.
- `make api` — regenerate protobuf Go code from `api/` via `buf`.
- `make openapi` — regenerate OpenAPI YAML docs.
- `make ts` — regenerate TypeScript API stubs.
- `make wire` / `make ent` — generate Wire and Ent code.
- `make build` — build all services.
- `make test` — run repository test suite with `go test ./...`.
- `make cover` — run tests with coverage output (`coverage.out`).
- `make lint` — run `golangci-lint`.
- `make compose-up` / `make compose-down` — start or stop backend + dependencies using Docker Compose.
- Per-service loop: `cd app/<service>/service && make run` (for example, `cd app/admin/service && make run`).

## Coding Style & Naming Conventions
- Go 1.25.3 (`go.mod`), standard `gofmt` formatting.
- Use Go idioms: camelCase for variables/functions, PascalCase for exported types/functions, and snake_case file names.
- Keep service layers separated (`cmd/server`, `internal/data`, `internal/server`, `internal/service`).
- Prefer explicit, dependency-injected constructors and keep protobuf/API structs near their transport adapters.
- Run formatter/linter before opening PRs:
  - `gofmt -w .`
  - `make lint`

## Testing Guidelines
- Testing frameworks in use: Go `testing` and `testify`.
- Test files follow `_test.go`; test functions follow `TestXxx`.
- Suggested commands:
  - `go test ./...`
  - `go test -run TestPermissionService ./app/...`
  - `go test -v ./... -coverprofile=coverage.out`

## Commit & Pull Request Guidelines
- Commit history shows mixed Conventional Commit-like prefixes (`feat:`, `fix:`) plus occasional plain text Chinese descriptions.
- Preferred style for new work: concise imperative messages with optional scope, e.g.:
  - `feat(admin): add user permission audit endpoint`
  - `fix: guard nil cache client in user service`
- PRs should include:
  - What changed and why.
  - Services touched (`app/admin/service`, `app/user/service`, etc.).
  - Commands run (`go test`, `make lint`, generated file checks).
  - Any config/env changes and migration impact.

## Security & Configuration Tips
- Do not commit secrets (DB credentials, JWT keys, S3/MinIO keys, etc.). Keep them local via `.env`/`configs/*`.
- Export runtime config to etcd in local dev before launching all services (see `STARTUP.md` for command sequence).
