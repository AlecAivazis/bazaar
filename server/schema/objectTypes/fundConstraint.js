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
                    GREATER_THAN: { value: 'greaterThan' },
                    LESS_THAN: { value: 'lessThan' }
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
    alwaysFetch: 'field',
    resolveType: root => {
        return root.field === 'stars' ? 'StarConstraint' : 'LanguageConstraint'
    }
})

export const { edgeType: FundConstraintEdge, connectionType: FundConstraintConnection } = connectionDefinitions({
    nodeType: FundConstraint
})
