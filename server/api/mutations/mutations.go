package mutations

import (
	"github.com/graphql-go/graphql"
)

var Mutations = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"CreateFund": createFund,
	},
})
