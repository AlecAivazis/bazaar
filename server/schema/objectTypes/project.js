// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql'
import { connectionDefinitions } from 'graphql-relay'
// local imports
import { Transaction } from '.'

export const ProjectType = new GraphQLObjectType({
    name: 'Project',
    sqlTable: 'projects',
    uniqueKey: 'repoID',
    fields: () => ({
        repoID: { type: new GraphQLNonNull(GraphQLString) },
        transactions: {
            type: new GraphQLList(Transaction),
            sqlJoin: (projectTable, transactionTable) =>
                `${projectTable}.repoID = ${transactionTable}.project`
        }
    })
})

export const { connectionType: ProjectConnection } = connectionDefinitions({
    nodeType: ProjectType
})
