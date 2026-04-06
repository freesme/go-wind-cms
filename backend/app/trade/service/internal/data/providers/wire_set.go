package providers

import (
	"github.com/google/wire"

	"go-wind-cms/app/trade/service/internal/data"
)

// ProviderSet is the Wire provider set for the data layer.
var ProviderSet = wire.NewSet(
	data.NewDiscovery,
	data.NewEntClient,
	data.NewBookServiceClient,
	data.NewOrderRepo,
)
