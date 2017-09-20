package main

import (
	"net/http"

	"github.com/graphql-go/handler"

	"github.com/alecaivazis/bazr/server/api"
)

func main() {
	h := handler.New(&handler.Config{
		Schema: api.Schema,
		Pretty: true,
	})

	// serve HTTP
	http.Handle("/graphql", h)
	http.ListenAndServe(":8080", nil)
}
