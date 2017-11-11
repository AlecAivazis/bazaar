// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql'
// local imports
import { Transaction } from '.'

export default new GraphQLObjectType({
    name: 'Project',
    sqlTable: 'projects',
    uniqueKey: 'repoID',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        repoID: { type: new GraphQLNonNull(GraphQLString) },
        transactions: {
            type: new GraphQLList(Transaction),
            sqlJoin: (projectTable, transactionTable) =>
                `${projectTable}.repoID = ${transactionTable}.project`
        }
    })
})
