// external imports
import { introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'graphql-tools'
import { createApolloFetch } from 'apollo-fetch'

// a factory for the api's schema
export async function createSchema() {
    const githubFetcher = createApolloFetch({
        uri: 'https://api.github.com/graphql'
    })
    // make sure we use our authorization token
    githubFetcher.use(({ request, options }, next) => {
        if (!options.headers) {
            options.headers = {} // Create the headers object if needed.
        }
        options.headers['authorization'] = `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`

        next()
    })

    // grab the universe schema
    const ghSchema = await introspectSchema(githubFetcher)
    const githubSchema = await makeRemoteExecutableSchema({
        schema: ghSchema,
        fetcher: githubFetcher
    })

    // merge the two
    return mergeSchemas({
        schemas: [githubSchema]
    })
}
