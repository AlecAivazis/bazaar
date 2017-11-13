// external imports
import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql'
import joinMonster from 'join-monster'
import { connectionFromArray, connectionArgs } from 'graphql-relay'
// local imports
import { Project } from '.'
import db from '../../database'
import { ProjectType, ProjectConnection } from './project'
import { nodeField } from '../nodeDefinition'

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
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'The name of the repository that the project is tracking'
                }
            },
            where: (table, args, context) => `${table}.repoID = "${args.repoID}"`,
            resolve: (_, args, __, resolveInfo) => {
                return joinMonster(resolveInfo, {}, db.raw)
            }
        },
        node: nodeField
    })
})
