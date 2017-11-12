// external imports
import { GraphQLSchema } from 'graphql'
import { introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'graphql-tools'
import { createApolloFetch } from 'apollo-fetch'
// local imports
import { Query } from './objectTypes'

// our local schema
export default new GraphQLSchema({
    description: 'The BazR project API',
    query: Query
})
