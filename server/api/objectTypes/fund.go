package objectTypes

import (
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/relay"
)

var Fund = graphql.NewObject(graphql.ObjectConfig{
	Name: "Fund",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.String,
		},
		"address": &graphql.Field{
			Type: graphql.String,
		},
	},
})

var FundDefinition = relay.ConnectionDefinitions(relay.ConnectionConfig{
	Name:     "Fund",
	NodeType: Fund,
})
