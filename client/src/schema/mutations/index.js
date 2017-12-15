// external imports
import { makeExecutableSchema } from 'graphql-tools'
// local imports
import connectProject from './connectProject'

export const schema = makeExecutableSchema({
    typeDefs: `
      type Query {
        bazrClientVersion: Int!
      }

      input ConnectProjectInput {
        owner: String!,
        name: String!,
        accessToken: String!
      }

      type Mutation {
        connectProject(input: ConnectProjectInput!): Boolean
      }
    `,
    resolvers: {
        Query: {
            bazrClientVersion: () => 1
        },
        Mutation: {
            connectProject
        }
    }
})
