// external imports
import { GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import { connectionDefinitions, globalIdField } from 'graphql-relay'
// local imports
import { Fund, ProjectType, User } from '.'
import { nodeInterface } from '../nodeDefinition'

const ProjectMembershipType = new GraphQLObjectType({
    name: 'ProjectMembership',
    interfaces: [nodeInterface],
    sqlTable: 'project_membership',
    uniqueKey: ['projectId', 'userId'],
    fields: () => ({
        id: {
            ...globalIdField('ProjectMembership', obj => `${obj.projectId}:${obj.userId}`),
            sqlDeps: ['projectId', 'userId']
        },
        role: { type: new GraphQLNonNull(GraphQLString) },
        user: {
            type: new GraphQLNonNull(User),
            sqlJoin: (membershipTable, userTable) => `${membershipTable}.userId = ${userTable}.id`,
            resolve: root => {
                return root.user
            }
        },
        project: {
            type: new GraphQLNonNull(ProjectType),
            sqlJoin: (membershipTable, projectTable) =>
                `${membershipTable}.projectId = ${projectTable}.id`
        }
    })
})

export const { connectionType: ProjectMembershipConnection } = connectionDefinitions({
    nodeType: ProjectMembershipType,
    connectionFields: () => ({
        count: { type: GraphQLInt }
    })
})
