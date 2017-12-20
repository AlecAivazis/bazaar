// external imports
import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLNonNull } from 'graphql'
import joinMonster from 'join-monster'
import { connectionFromArray, connectionArgs } from 'graphql-relay'
// local imports
import { Project } from '.'
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
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            where: (table, args, context) => `${table}.accountName = "${args.accountName}"`,
            resolve: (_, args, __, resolveInfo) => {
                return joinMonster(resolveInfo, {}, db.raw)
            }
        },
        funds: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Fund))),
            resolve: (_, args, __, resolveInfo) => joinMonster(resolveInfo, {}, db.raw)
        },
        node: nodeField
    })
})
