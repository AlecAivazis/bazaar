// external imports
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt } from 'graphql'
import {
    connectionDefinitions,
    connectionFromArray,
    connectionArgs,
    globalIdField
} from 'graphql-relay'
// local imports
import { TransactionConnection, UserConnection } from '.'
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
        },
        contributors: {
            type: new GraphQLNonNull(UserConnection),
            description: 'The users who are allowed to earn money for this project',
            args: connectionArgs,
            junction: {
                sqlTable: 'project_membership',
                sqlJoins: [
                    (projectTable, membershipTable) =>
                        `${projectTable}.id = ${membershipTable}.project`,
                    (membershipTable, userTable) => `${membershipTable}.user = ${userTable}.id`
                ]
            },
            resolve: (root, args) => {
                // turn the list into a connection
                const connection = connectionFromArray(root.contributors, args)
                // save the length
                connection.count = root.contributors.length
                // return the final connection
                return connection
            }
        },
        sparkLine: {
            type: new GraphQLList(GraphQLInt),
            args: {
                days: { type: GraphQLInt, defaultValue: 365 }
            },
            description:
                'The amount of money earned starting at the specified number of days before today',
            sqlTable: '(SELECT * FROM transactions WHERE project = projects.id)',
            resolve: root => {
                // the transaction
                console.log(root)
            }
        }
    })
})

export const { connectionType: ProjectConnection } = connectionDefinitions({
    nodeType: ProjectType
})
