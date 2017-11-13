// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql'
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
