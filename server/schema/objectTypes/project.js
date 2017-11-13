// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql'
import { connectionDefinitions, connectionFromArray, connectionArgs } from 'graphql-relay'
// local imports
import { TransactionConnection } from '.'

export const ProjectType = new GraphQLObjectType({
    name: 'Project',
    sqlTable: 'projects',
    uniqueKey: 'repoID',
    fields: () => ({
        repoID: { type: new GraphQLNonNull(GraphQLString) },
        transactions: {
            type: TransactionConnection,
            args: connectionArgs,
            sqlJoin: (projectTable, transactionTable) =>
                `${projectTable}.repoID = ${transactionTable}.project`,
            resolve: (root, args) => connectionFromArray(root.transactions, args)
        }
    })
})

export const { connectionType: ProjectConnection } = connectionDefinitions({
    nodeType: ProjectType
})
