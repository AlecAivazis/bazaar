// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'

export default new GraphQLObjectType({
    name: 'Fund',
    sqlTable: 'funds',
    uniqueKey: 'id',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) }
    })
})
