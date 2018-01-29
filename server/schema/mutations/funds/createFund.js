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
        // create the project with the matching repoID
        const [fundId] = await database('funds').insert({ name, address })
        // if we have to supply constraints to the fund
        if (constraints) {
            // the rows to add to the constraint database
            const rows = []

            // if we have to supply a language constraint
            if (constraints.language) {
                rows.push({
                    field: 'language',
                    bound: 'equals',
                    value: constraints.language,
                    fundId
                })
            }

            // if we have to supply a minimum star constraint
            if (constraints.minStars) {
                rows.push({
                    field: 'stars',
                    bound: 'greaterThan',
                    value: constraints.minStars,
                    fundId
                })
            }

            // if we have to supply a maximum star constraint
            if (constraints.maxStars) {
                rows.push({
                    field: 'stars',
                    bound: 'lessThan',
                    value: constraints.maxStars,
                    fundId
                })
            }

            // add the constraints
            await database.batchInsert('constraints', rows, 3)
        }

        // we're done so leave behind the information we need to query for the membership we just modified
        return {
            __fundId: fundId
        }
    }
})
