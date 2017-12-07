// @flow
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
    mutation UpdateUserRoleMutation($input: UpdateRoleInput!) {
        UpdateUserRole(input: $input) {
            membership {
                id
                role
            }
        }
    }
`)
