// @flow
// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import * as projects from './projects'
import * as funds from './funds'
import * as users from './users'

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...projects,
        ...funds,
        ...users
    }
})

export default mutation
