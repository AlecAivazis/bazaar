// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql'
import { globalIdField, connectionDefinitions, connectionArgs } from 'graphql-relay'
// local imports
import { nodeInterface } from '../interfaces'
import { FundConnection } from '.'

export const UserType = new GraphQLObjectType({
    name: 'BazrUser',
    interfaces: [nodeInterface],
    sqlTable: 'users',
    uniqueKey: 'id',
    fields: () => ({
        id: {
            ...globalIdField(),
            sqlDeps: ['id']
        },
        accountName: { type: new GraphQLNonNull(GraphQLString) },
        funds: {
            type: new GraphQLNonNull(FundConnection),
            args: connectionArgs
        }
    })
})

export const { connectionType: UserConnection } = connectionDefinitions({
    nodeType: UserType
})
