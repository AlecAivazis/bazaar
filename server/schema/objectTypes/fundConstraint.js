// external imports
import { GraphQLUnionType, GraphQLEnumType, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import { connectionDefinitions } from 'graphql-relay'

const StarConstraint = new GraphQLObjectType({
    name: 'StarConstraint',
    fields: () => ({
        value: { type: GraphQLString },
        bound: {
            type: new GraphQLEnumType({
                name: 'StarConstraintDirection',
                values: {
                    GREATER_THAN: { value: 0 },
                    LESS_THAN: { value: 1 }
                }
            })
        }
    })
})

const LanguageConstraint = new GraphQLObjectType({
    name: 'LanguageConstraint',
    fields: () => ({
        value: { type: GraphQLString }
    })
})

export const FundConstraint = new GraphQLUnionType({
    name: 'FundConstraint',
    types: [StarConstraint, LanguageConstraint],
    sqlTable: 'constraints',
    uniqueKey: 'id',
    resolveType: root => (root.field === 'star' ? 'StarConstraint' : 'LanguageConstraint')
})

export const { edgeType: FundConstraintEdge, connectionType: FundConstraintConnection } = connectionDefinitions({
    nodeType: FundConstraint
})
