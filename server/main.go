package main

import (
	"fmt"
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

	// the port to run the server on
	port := ":4000"

	// add the graphql handlers
	http.Handle("/graphql", h)

	// notify the user
	fmt.Println(fmt.Sprintf("bazr is running on %s", port))
	// start the server
	http.ListenAndServe(port, nil)
}
