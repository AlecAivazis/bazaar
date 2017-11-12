// external imports
var { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools')
var { createApolloFetch } = require('apollo-fetch')

// create an executable wrapper over the remote GH schema
module.exports = async function createGHSchema() {
    const fetcher = createApolloFetch({
        uri: 'https://api.github.com/graphql'
    })
    // make sure we use our authorization token
    fetcher.use(({ request, options }, next) => {
        if (!options.headers) {
            options.headers = {} // Create the headers object if needed.
        }
        options.headers['authorization'] = `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`

        next()
    })

    // grab the github schema
    const schema = await introspectSchema(fetcher)

    // create an executable version of the schema
    return await makeRemoteExecutableSchema({
        schema,
        fetcher
    })
}
