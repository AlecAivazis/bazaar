// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { globalIdField } from 'graphql-relay'
// local imports
import { nodeInterface } from '../nodeDefinition'

export default new GraphQLObjectType({
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
