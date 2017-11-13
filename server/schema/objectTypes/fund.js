// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { globalIdField } from 'graphql-relay'
// local imports
import { nodeInterface } from '../nodeDefinition'

export default new GraphQLObjectType({
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
