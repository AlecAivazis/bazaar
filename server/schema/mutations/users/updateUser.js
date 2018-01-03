// @flow
// external imports
import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import joinMonster from 'join-monster'
// local imports
import { UserType } from '~/server/schema/objectTypes'
import database from '~/server/database'

export default mutationWithClientMutationId({
    name: 'UpdateUser',
    inputFields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        walletAddress: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }),
    outputFields: () => ({
        user: {
            type: new GraphQLNonNull(UserType),
            sqlTable: 'users',
            where: (table, args, { __userId }) =>
                // grab the ids out of the request context to resolve the appropriate membership object
                `${table}.id = ${__userId}`,
            resolve: (data, __, _, resolveInfo) =>
                // save the result of mutateAndGetPayload in the context to retrieve later
                // when resolving against join-monster
                joinMonster(resolveInfo, data, database.raw)
        }
    }),
    mutateAndGetPayload: async ({ id, walletAddress }) => {
        const { id: userId } = fromGlobalId(id)
        // update the specified user
        const __userId = await database('users')
            .where({ id: userId })
            .update({ walletAddress })

        // we're done so leave behind the information we need to query for the membership we just modified
        return {
            __userId
        }
    }
})
