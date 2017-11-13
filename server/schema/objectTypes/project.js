// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt } from 'graphql'
import {
    connectionDefinitions,
    connectionFromArray,
    connectionArgs,
    globalIdField
} from 'graphql-relay'
// local imports
import { TransactionConnection } from '.'
import { nodeInterface } from '../nodeDefinition'

export const ProjectType = new GraphQLObjectType({
    name: 'Project',
    interfaces: [nodeInterface],
    sqlTable: 'projects',
    uniqueKey: 'id',
    fields: () => ({
        id: {
            ...globalIdField(),
            sqlDeps: ['id']
        },
        repoID: { type: new GraphQLNonNull(GraphQLString) },
        transactions: {
            type: TransactionConnection,
            description: 'The transactions that have benefited this project',
            args: connectionArgs,
            sqlJoin: (projectTable, transactionTable) =>
                `${projectTable}.id = ${transactionTable}.project`,
            resolve: (root, args) => connectionFromArray(root.transactions, args)
        },
        totalEarned: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The total amount of ethereum earned over the lifetime of this project',
            sqlExpr: projects =>
                `(SELECT sum(amount) FROM transactions WHERE project = ${projects}.id)`,
            resolve: root => root.totalEarned || 0
        }
    })
})

export const { connectionType: ProjectConnection } = connectionDefinitions({
    nodeType: ProjectType
})
