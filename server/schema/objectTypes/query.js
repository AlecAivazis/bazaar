// external imports
import { GraphQLObjectType, GraphQLList } from 'graphql'
import joinMonster from 'join-monster'
import { connectionFromArray } from 'graphql-relay'
// local imports
import { Project } from '.'
import db from '../../database'
import { ProjectConnection } from './project'

export default new GraphQLObjectType({
    name: 'BazrAPI',
    fields: () => ({
        projects: {
            type: ProjectConnection,
            resolve: async (_, args, __, resolveInfo) => {
                const projects = await joinMonster(resolveInfo, {}, async sql => {
                    const result = await db.raw(sql)

                    return result
                })

                return connectionFromArray(projects, args)
            }
        }
    })
})
