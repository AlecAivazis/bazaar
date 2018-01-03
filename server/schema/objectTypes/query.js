// external imports
import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLNonNull } from 'graphql'
import joinMonster from 'join-monster'
import { connectionFromArray, connectionFromPromisedArray, connectionArgs } from 'graphql-relay'
// local imports
import { Project, FundConnection } from '.'
import db from '../../database'
import { ProjectType, ProjectConnection } from './project'
import { UserType } from './user'
import { nodeField } from '../interfaces'
import { Fund } from './fund'

export default new GraphQLObjectType({
    name: 'BazrAPI',
    fields: () => ({
        projects: {
            type: ProjectConnection,
            args: connectionArgs,
            resolve: async (_, args, __, resolveInfo) => {
                const projects = await joinMonster(resolveInfo, {}, async sql => {
                    const result = await db.raw(sql)

                    return result
                })

                return connectionFromArray(projects, args)
            }
        },
        project: {
            type: ProjectType,
            args: {
                repoID: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'The name of the repository that the project is tracking'
                }
            },
            where: (table, args, context) => `${table}.repoID = "${args.repoID}"`,
            resolve: (_, args, __, resolveInfo) => {
                return joinMonster(resolveInfo, {}, db.raw)
            }
        },
        bazrUser: {
            type: UserType,
            args: {
                accountName: {
                    type: GraphQLString
                },
                walletAddress: {
                    type: GraphQLString
                }
            },
            where: (table, args, context) =>
                do {
                    if (args.accountName) {
                        ;`${table}.accountName = "${args.accountName}"`
                    } else if (args.walletAddress) {
                        ;`${table}.walletAddress = "${args.walletAddress}"`
                    }
                },
            resolve: (_, args, __, resolveInfo) => {
                return joinMonster(resolveInfo, {}, db.raw)
            }
        },
        funds: {
            type: new GraphQLNonNull(FundConnection),
            resolve: async (_, args, __, resolveInfo) =>
                connectionFromPromisedArray(joinMonster(resolveInfo, {}, db.raw), args)
        },
        fund: {
            type: Fund,
            args: {
                address: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            where: (table, args, context) => `${table}.address = "${args.address}"`,
            resolve: (_, args, __, resolveInfo) => {
                return joinMonster(resolveInfo, {}, db.raw)
            }
        },
        node: nodeField
    })
})
