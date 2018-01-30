// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { globalIdField, connectionDefinitions } from 'graphql-relay'
// local imports
import { nodeInterface } from '../interfaces'
import { FundConstraintConnection } from '.'

export const Fund = new GraphQLObjectType({
    name: 'Fund',
    interfaces: [nodeInterface],
    sqlTable: 'funds',
    uniqueKey: 'id',
    fields: () => ({
        id: {
            ...globalIdField(),
            sqlDeps: ['id']
        },
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        constraints: {
            type: FundConstraintConnection,
            sqlJoin: (fundTable, constraintTable) => `${constraintTable}.fundId = ${fundTable}.id`
        }
    })
})

export const { connectionType: FundConnection, edgeType: FundEdge } = connectionDefinitions({
    nodeType: Fund
})
