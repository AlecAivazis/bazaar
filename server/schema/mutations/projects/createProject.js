// @flow
// external imports
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import joinMonster from 'join-monster'
// local imports
import { ProjectType } from '../../objectTypes'
import database from '../../../database'
import { createProjectFork } from '../../../git/welcome'

export default mutationWithClientMutationId({
    name: 'CreateProject',
    description: 'Add a record in the project database',
    inputFields: () => ({
        repoID: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }),
    outputFields: () => ({
        project: {
            type: new GraphQLNonNull(ProjectType),
            sqlTable: 'projects',
            where: (table, args, { __projectId }) =>
                // grab the ids out of the request context to resolve the appropriate membership object
                `${table}.id = ${__projectId}`,
            resolve: (data, __, _, resolveInfo) =>
                // save the result of mutateAndGetPayload in the context to retrieve later
                // when resolving against join-monster
                joinMonster(resolveInfo, data, database.raw)
        }
    }),
    mutateAndGetPayload: async ({ repoID }) => {
        const projectsCreated = await database('projects').insert({ repoID })

        // pull out the owner and repo from the repoID
        const [owner, repo] = repoID.split('/')
        // fork the repository
        await createProjectFork({ owner, repo })

        // we're done so leave behind the information we need to query for the membership we just modified
        return {
            __projectId: projectsCreated[0]
        }
    }
})
