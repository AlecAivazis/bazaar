// external imports
import { GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLString } from 'graphql'
// local imports
import { Fund, Project } from '.'

export default new GraphQLObjectType({
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
            type: new GraphQLNonNull(Project),
            sqlJoin: (transactionTable, projectTable) =>
                `${transactionTable}.project = ${projectTable}.id`
        }
    })
})
