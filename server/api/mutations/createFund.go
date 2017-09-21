package mutations

import (
	"github.com/alecaivazis/bazr/server/api/objectTypes"
	"github.com/graphql-go/graphql"
)

var createFund = &graphql.Field{
	Type:        objectTypes.FundDefinition.EdgeType,
	Description: "Create a new fund for the specified user",
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		return nil, nil
	},
}
