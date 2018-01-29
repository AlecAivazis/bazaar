// @flow
// external imports
import { GraphQLNonNull, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import joinMonster from 'join-monster'
// local imports
import { Fund } from '../../objectTypes'
import { ContractAddress } from '../../types'
import database from '../../../database'
import { createProjectFork } from '../../../git/welcome'
import { GraphQLInt } from 'graphql/type/scalars'

export default mutationWithClientMutationId({
    name: 'CreateFund',
    description: 'Register a new fund with the bazr network',
    inputFields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(ContractAddress) },
        constraints: {
            type: new GraphQLInputObjectType({
                name: 'FundConstraintsInput',
                fields: () => ({
                    language: { type: GraphQLString },
                    maxStars: { type: GraphQLInt },
                    minStars: { type: GraphQLInt }
                })
            })
        }
    }),
    outputFields: () => ({
        fund: {
            type: new GraphQLNonNull(Fund),
            sqlTable: 'funds',
            where: (table, args, { __fundId }) =>
                // grab the ids out of the request context to resolve the appropriate membership object
                `${table}.id = ${__fundId}`,
            resolve: (data, __, _, resolveInfo) =>
                // save the result of mutateAndGetPayload in the context to retrieve later
                // when resolving against join-monster
                joinMonster(resolveInfo, data, database.raw)
        }
    }),
    mutateAndGetPayload: async ({ name, address, constraints }) => {
        console.log(constraints)
        // create the project with the matching repoID
        const fundsCreated = await database('funds').insert({ name, address })

        // we're done so leave behind the information we need to query for the membership we just modified
        return {
            __fundId: fundsCreated[0]
        }
    }
})
