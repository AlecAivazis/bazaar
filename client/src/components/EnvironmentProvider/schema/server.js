// external imports
var { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools')
var { createApolloFetch } = require('apollo-fetch')

// create an executable wrapper over the server's schema
module.exports = async function createServerSchema() {
    const fetcher = createApolloFetch({
        uri: 'http://localhost:4000/graphql'
    })

    // grab the github schema
    const schema = await introspectSchema(fetcher)

    // create an executable version of the schema
    return await makeRemoteExecutableSchema({
        schema,
        fetcher
    })
}
