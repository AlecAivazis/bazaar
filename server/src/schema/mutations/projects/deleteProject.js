// @flow
// external imports
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import joinMonster from 'join-monster'
// local imports
import { ProjectType } from '../../objectTypes'
import database from '../../../database'

export default mutationWithClientMutationId({
    name: 'DeleteProject',
    description: 'Remove a record from the project database',
    inputFields: () => ({
        repoID: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }),
    outputFields: () => ({
        success: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: (data, __, _, resolveInfo) => true
        }
    }),
    mutateAndGetPayload: async ({ repoID }) => {
        const projectsCreated = await database('projects')
            .where({ repoID })
            .del()

        // we're done so leave behind the information we need to query for the membership we just modified
        return {
            __projectId: projectsCreated[0]
        }
    }
})
