// external imports
import { GraphQLObjectType, GraphQLList } from 'graphql'
import joinMonster from 'join-monster'
// local imports
import { User } from '.'
import db from '../../database'

export default new GraphQLObjectType({
    name: 'BazrAPI',
    fields: () => ({
        users: {
            type: new GraphQLList(User),
            resolve: (_, __, ___, resolveInfo) => joinMonster(resolveInfo, {}, db.raw)
        }
    })
})
