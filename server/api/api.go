package api

import (
	"github.com/graphql-go/graphql"

	"github.com/alecaivazis/bazr/server/api/mutations"
	"github.com/alecaivazis/bazr/server/api/objectTypes"
)

// Schema is the graphql schema for the api provided by this service.
var Schema *graphql.Schema

// when this package is loaded
func init() {
	// define the schema
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query:    objectTypes.Query,
		Mutation: mutations.Mutations,
	})
	// if something went wrong
	if err != nil {
		panic(err)
	}

	Schema = &schema
}
