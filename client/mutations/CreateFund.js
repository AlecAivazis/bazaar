// @flow
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
    mutation CreateFundMutation($input: CreateClientFundInput!) {
        createFund(input: $input) {
            id
        }
    }
`)
