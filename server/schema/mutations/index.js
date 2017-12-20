// @flow
// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import * as projects from './projects'
import * as funds from './funds'

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...projects,
        ...funds
    }
})

export default mutation
