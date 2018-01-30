// external imports
import { GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import { connectionDefinitions, globalIdField, connectionFromArray, connectionArgs } from 'graphql-relay'
// local imports
import { Fund, ProjectType, UserType, TransactionConnection } from '.'
import { nodeInterface } from '../interfaces'
import { MembershipRole } from '../types'

export const ProjectMembershipType = new GraphQLObjectType({
    name: 'ProjectMembership',
    interfaces: [nodeInterface],
    sqlTable: 'project_membership',
    uniqueKey: ['projectId', 'userId'],
    fields: () => ({
        id: {
            ...globalIdField('ProjectMembership', obj => `${obj.projectId}:${obj.userId}`),
            sqlDeps: ['projectId', 'userId']
        },
        user: {
            type: new GraphQLNonNull(UserType),
            sqlJoin: (membershipTable, userTable) => `${membershipTable}.userId = ${userTable}.id`,
            resolve: root => {
                return root.user
            }
        },
        project: {
            type: new GraphQLNonNull(ProjectType),
            sqlJoin: (membershipTable, projectTable) => `${membershipTable}.projectId = ${projectTable}.id`
        },
        transactions: {
            type: new GraphQLNonNull(TransactionConnection),
            args: connectionArgs,
            sqlJoin: (membershipTable, transactionTable) =>
                `(${membershipTable}.projectId = ${transactionTable}.project AND ${membershipTable}.userId = ${transactionTable}.recipientId)`,
            resolve: (root, args) => connectionFromArray(root.transactions, args)
        },
        totalAmountEarned: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The total amount of ethereum earned over the lifetime of this project',
            resolve: root => root.totalAmountEarned || 0,
            sqlExpr: membershipTable =>
                `(SELECT sum(amount) FROM transactions WHERE project = ${membershipTable}.projectId AND recipientId = ${membershipTable}.userId)`
        }
    })
})

export const {
    connectionType: ProjectMembershipConnection,
    edgeType: ProjectMembershipEdgeType
} = connectionDefinitions({
    nodeType: ProjectMembershipType,
    connectionFields: () => ({
        count: { type: GraphQLInt }
    })
})
