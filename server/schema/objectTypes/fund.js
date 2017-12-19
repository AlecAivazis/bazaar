// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { globalIdField, connectionDefinitions } from 'graphql-relay'
// local imports
import { nodeInterface } from '../interfaces'

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
        address: { type: new GraphQLNonNull(GraphQLString) }
    })
})

export const { connectionType: FundConnection, edgeType: FundEdge } = connectionDefinitions({
    nodeType: Fund
})
