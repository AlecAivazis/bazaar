// external imports
import { GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import { connectionDefinitions, globalIdField, connectionFromArray } from 'graphql-relay'
// local imports
import { Fund, ProjectType, UserType, TransactionConnection } from '.'
import { nodeInterface } from '../nodeDefinition'
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
        role: { type: new GraphQLNonNull(MembershipRole) },
        user: {
            type: new GraphQLNonNull(UserType),
            sqlJoin: (membershipTable, userTable) => `${membershipTable}.userId = ${userTable}.id`,
            resolve: root => {
                return root.user
            }
        },
        project: {
            type: new GraphQLNonNull(ProjectType),
            sqlJoin: (membershipTable, projectTable) =>
                `${membershipTable}.projectId = ${projectTable}.id`
        },
        transactions: {
            type: new GraphQLNonNull(TransactionConnection),
            sqlJoin: (membershipTable, transactionTable) =>
                `(${membershipTable}.projectId = ${transactionTable}.project AND ${membershipTable}.userId = ${transactionTable}.recipientId)`,
            resolve: (root, args) => connectionFromArray(root.transactions, args)
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
