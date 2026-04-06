//go:build wireinject
// +build wireinject

//go:generate go run github.com/google/wire/cmd/wire

package main

import (
	"github.com/go-kratos/kratos/v2"
	"github.com/google/wire"
	"github.com/tx7do/kratos-bootstrap/bootstrap"

	dataProviders "go-wind-cms/app/book/service/internal/data/providers"
	serverProviders "go-wind-cms/app/book/service/internal/server/providers"
	serviceProviders "go-wind-cms/app/book/service/internal/service/providers"
)

func initApp(*bootstrap.Context) (*kratos.App, func(), error) {
	panic(
		wire.Build(
			dataProviders.ProviderSet,
			serviceProviders.ProviderSet,
			serverProviders.ProviderSet,
			newApp,
		),
	)
}
