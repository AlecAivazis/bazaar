// external imports
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'
import { createApolloFetch } from 'apollo-fetch'

// create an executable wrapper over the server's schema
export default async function createServerSchema() {
    const fetcher = createApolloFetch({
        uri: '/graphql'
    })

    // grab the github schema
    const schema = await introspectSchema(fetcher)

    // create an executable version of the schema
    return await makeRemoteExecutableSchema({
        schema,
        fetcher
    })
}
