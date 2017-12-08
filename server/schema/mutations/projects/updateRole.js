// @flow
// external imports
import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import joinMonster from 'join-monster'
// local imports
import db from '../../../database'
import { ProjectMembershipType } from '../../objectTypes'
import { MembershipRole } from '../../types'
import database from '../../../database'

export default mutationWithClientMutationId({
    name: 'UpdateRole',
    description: 'Update the role of the designated user within the designated project',
    inputFields: () => ({
        user: {
            type: new GraphQLNonNull(GraphQLID)
        },
        project: {
            type: new GraphQLNonNull(GraphQLID)
        },
        role: {
            type: new GraphQLNonNull(MembershipRole)
        }
    }),
    outputFields: () => ({
        membership: {
            type: new GraphQLNonNull(ProjectMembershipType),
            where: (table, args, { __userId, __projectId }) =>
                // grab the ids out of the request context to resolve the appropriate membership object
                `${table}.userId = '${__userId}' and ${table}.projectId = ${__projectId}`,
            resolve: (data, __, _, resolveInfo) =>
                // save the result of mutateAndGetPayload in the context to retrieve later
                // when resolving against join-monster
                joinMonster(resolveInfo, data, db.raw)
        }
    }),
    mutateAndGetPayload: async ({ user, project, role }) => {
        // get the ids out of the arguments
        const { id: userId } = fromGlobalId(user)
        const { id: projectId } = fromGlobalId(project)

        // update the corresponding rows and check out many were updated
        const nUpdated = await database('project_membership')
            .where({
                userId,
                projectId
            })
            .update({ role })

        // if no rows were updated
        if (nUpdated === 0) {
            throw new Error("Could not update user's role.")
        }

        // we're done so leave behind the information we need to query for the membership we just modified
        return {
            __userId: userId,
            __projectId: projectId
        }
    }
})
