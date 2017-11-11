// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'

export default new GraphQLObjectType({
    name: 'Project',
    sqlTable: 'projects',
    uniqueKey: 'repoID',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        repoID: { type: new GraphQLNonNull(GraphQLString) }
    })
})
