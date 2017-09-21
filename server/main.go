//go:generate abigen --sol ./contracts/killswitch.sol --pkg contracts --out ./contracts/killswitch.go

package main

import (
	"net/http"

	"github.com/graphql-go/handler"

	"github.com/alecaivazis/bazr/server/api"
)

func main() {
	// the handler for our graphql routes
	h := handler.New(&handler.Config{
		Schema:   api.Schema,
		Pretty:   true,
		GraphiQL: true,
	})

	// serve HTTP
	http.Handle("/graphql", h)
	http.ListenAndServe(":4000", nil)
}
