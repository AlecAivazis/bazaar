// @flow
// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import * as projects from './projects'

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...projects
    }
})

export default mutation
