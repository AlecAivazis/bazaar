package objectTypes

import (
	"github.com/graphql-go/graphql"
)

var Query = graphql.NewObject(graphql.ObjectConfig{
	Name:   "BazrAPI",
	Fields: graphql.Fields{},
})
