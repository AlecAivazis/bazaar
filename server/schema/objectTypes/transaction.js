// external imports
import { GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLString } from 'graphql'
import { connectionDefinitions } from 'graphql-relay'
// local imports
import { Fund, ProjectType } from '.'

const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    sqlTable: 'transactions',
    uniqueKey: 'id',
    fields: () => ({
        amount: { type: new GraphQLNonNull(GraphQLFloat) },
        recipientName: { type: new GraphQLNonNull(GraphQLString) },
        fund: {
            type: new GraphQLNonNull(Fund),
            sqlJoin: (transactionTable, fundTable) => `${transactionTable}.fund = ${fundTable}.id`
        },
        project: {
            type: new GraphQLNonNull(ProjectType),
            sqlJoin: (transactionTable, projectTable) =>
                `${transactionTable}.project = ${projectTable}.repoID`
        }
    })
})

export const { connectionType: TransactionConnection } = connectionDefinitions({
    nodeType: TransactionType
})
