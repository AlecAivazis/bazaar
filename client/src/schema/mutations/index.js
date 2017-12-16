// external imports
import { makeExecutableSchema } from 'graphql-tools'
// local imports
import connectProject from './connectProject'
import deleteProject from './deleteProject'

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

      input DeleteBazrProjectInput {
        owner: String!,
        name: String!,
        accessToken: String!
      }

      type Mutation {
        connectProject(input: ConnectProjectInput!): Boolean
        deleteProject(input: DeleteBazrProjectInput!): Boolean
      }
    `,
    resolvers: {
        Query: {
            bazrClientVersion: () => 1
        },
        Mutation: {
            connectProject,
            deleteProject
        }
    }
})
