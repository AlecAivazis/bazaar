// external imports
import { mergeSchemas } from 'graphql-tools'
// local imports
import createGHSchema from './github'
import createServerSchema from './server'
import blockchainSchema from './blockchain'
import mutations from './mutations'
import createFundMutation from './mutations/createFund'

// the type extensions to link schema together
const linkTypes = `
extend type Project {
    repository: Repository
}

extend type BazrUser {
    profile: User
}

extend type User {
    bazrUser: BazrUser
}

extend type Repository {
    bazrProject: Project
}


input CreateClientFundInput {
    name: String!
}

extend type Mutation {
    createFund(input: CreateClientFundInput!): Fund!
}

extend type Fund {
    contract: FundContract!
}
`

// a factory for the api's schema
export default async function createSchema(githubToken) {
    // the remote schema
    const remoteSchemas = await Promise.all([createServerSchema(), createGHSchema(githubToken)])

    // merge the two
    return mergeSchemas({
        schemas: [...remoteSchemas, mutations, blockchainSchema, linkTypes],
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
            },
            User: {
                bazrUser: {
                    fragment: 'fragment UserProfile on User { login }',
                    resolve: (parent, args, context, info) => {
                        // return the repository designated by the ID
                        return mergeInfo.delegate('query', 'bazrUser', { accountName: parent.login }, context, info)
                    }
                }
            },
            Repository: {
                bazrProject: {
                    fragment: `fragment RepositoryBazrProject on Repository { name owner { login } }`,
                    resolve: (parent, args, context, info) => {
                        // return the repository designated by the ID
                        return mergeInfo.delegate(
                            'query',
                            'project',
                            { repoID: `${parent.owner.login}/${parent.name}` },
                            context,
                            info
                        )
                    }
                }
            },
            Fund: {
                contract: {
                    fragment: 'fragment FundContract on Fund { address }',
                    resolve: (parent, args, context, info) => {
                        // return the repository designated by the ID
                        return mergeInfo.delegate('query', 'fundContract', { address: parent.address }, context, info)
                    }
                }
            },
            Mutation: {
                createFund: createFundMutation
            }
        })
    })
}
