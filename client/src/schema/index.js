// external imports
import { mergeSchemas } from 'graphql-tools'
// local imports
import createGHSchema from './github'
import createServerSchema from './server'

// the type extensions to link schema together
const linkTypes = `
extend type Project {
  repository: Repository
}

extend type BazrUser {
  profile: User
}
`

// a factory for the api's schema
export default async function createSchema() {
    // the remote schema
    const remoteSchemas = await Promise.all([createServerSchema(), createGHSchema()])

    // merge the two
    return mergeSchemas({
        schemas: [...remoteSchemas, linkTypes],
        // prefer local types over remote ones
        onTypeConflict: (leftType, rightType) => leftType,
        // implement the links between types
        resolvers: mergeInfo => ({
            Project: {
                repository: {
                    fragment: 'fragment ProjectRepositoryFragment on Project { repoID }',
                    resolve: (parent, args, context, info) => {
                        // assume the id is in the format of <owner>/<name>
                        const [owner, name] = parent.repoID.split('/')

                        // return the repository designated by the ID
                        return mergeInfo.delegate('query', 'repository', { owner, name }, context, info)
                    }
                }
            },
            BazrUser: {
                profile: {
                    fragment: 'fragment BazrUserProfile on BazrUesr { accountName }',
                    resolve: (parent, args, context, info) => {
                        // return the repository designated by the ID
                        return mergeInfo.delegate('query', 'user', { login: parent.accountName }, context, info)
                    }
                }
            }
        })
    })
}
