// external imports
import { GraphQLSchema } from 'graphql'
import { introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'graphql-tools'
import { createApolloFetch } from 'apollo-fetch'
// local imports
import query from './objectTypes'
import mutation from './mutations'

// our local schema
export default new GraphQLSchema({
    description: 'The BazR project API',
    query,
    mutation
})
