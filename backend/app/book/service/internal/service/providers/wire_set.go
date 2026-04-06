package providers

import (
	"github.com/google/wire"

	"go-wind-cms/app/book/service/internal/service"
)

// ProviderSet is the Wire provider set for the service layer.
var ProviderSet = wire.NewSet(
	service.NewBookService,
)
