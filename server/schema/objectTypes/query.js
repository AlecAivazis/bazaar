// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'

export default new GraphQLObjectType({
    name: 'BazrAPI',
    fields: () => ({
        viewer: {
            type: GraphQLString,
            resolve: () => 'hello' // TODO
        }
    })
})
