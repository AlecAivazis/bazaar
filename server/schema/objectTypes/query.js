// external imports
import { GraphQLObjectType, GraphQLList } from 'graphql'
import joinMonster from 'join-monster'
// local imports
import { Project } from '.'
import db from '../../database'

export default new GraphQLObjectType({
    name: 'BazrAPI',
    fields: () => ({
        projects: {
            type: new GraphQLList(Project),
            resolve: (_, __, ___, resolveInfo) => joinMonster(resolveInfo, {}, db.raw)
        }
    })
})
