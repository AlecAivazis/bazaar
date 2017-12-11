// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql'
import { globalIdField, connectionDefinitions } from 'graphql-relay'
// local imports
import { nodeInterface } from '../nodeDefinition'

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
        accountName: { type: new GraphQLNonNull(GraphQLString) }
    })
})

export const { connectionType: UserConnection } = connectionDefinitions({
    nodeType: UserType
})
