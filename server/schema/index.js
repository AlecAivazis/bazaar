// external imports
import { GraphQLSchema } from 'graphql'
import { introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'graphql-tools'
import { createApolloFetch } from 'apollo-fetch'
// local imports
import { Query } from './objectTypes'

// our local schema
const localSchema = new GraphQLSchema({
    description: 'The BazR project API',
    query: Query
})

// create an executable wrapper over the remote GH schema
async function createGHSchema() {
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

const linkTypes = `
  extend type Project {
    repository: Repository
  }
`

// a factory for the api's schema
export async function createSchema() {
    // merge the two
    return mergeSchemas({
        schemas: [localSchema, await createGHSchema(), linkTypes],
        // prefer local types over remote ones
        onTypeConflict: (leftType, rightType) => leftType,
        // implement the links between types
        resolvers: mergeInfo => ({
            Project: {
                repository: {
                    fragment: `fragment ProjectRepositoryFragment on Project { repoID }`,
                    resolve: (parent, args, context, info) => {
                        // assume the id is in the format of <owner>/<name>
                        const [owner, name] = parent.repoID.split('/')

                        // return the repository designated by the ID
                        return mergeInfo.delegate(
                            'query',
                            'repository',
                            { owner, name },
                            context,
                            info
                        )
                    }
                }
            }
        })
    })
}
