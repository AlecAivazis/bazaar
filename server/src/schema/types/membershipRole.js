// @flow
// external imports
import { GraphQLEnumType } from 'graphql'

export default new GraphQLEnumType({
    name: 'MembershipRole',
    values: {
        ADMIN: { value: 'admin' },
        CONTRIBUTOR: { value: 'contributor' }
    }
})
