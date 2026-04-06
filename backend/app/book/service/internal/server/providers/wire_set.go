package providers

import (
	"github.com/google/wire"

	"go-wind-cms/app/book/service/internal/server"
)

// ProviderSet is the Wire provider set for the server layer.
var ProviderSet = wire.NewSet(
	server.NewGrpcServer,
)
