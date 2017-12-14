import { makeExecutableSchema } from 'graphql-tools'

export const schema = makeExecutableSchema({
    typeDefs: `
      type Query {
        bazrClientVersion: Int!
      }

      input ConnectProjectInput {
        owner: String!,
        name: String!
      }

      type Mutation {
        connectProject(input: ConnectProjectInput!): Boolean
      }
    `,
    resolvers: {
        Mutation: {
            connectProject: (_, { input: { owner, name } }) => {
                console.log('connecting project', owner, name)
                return false
            }
        }
    }
})
