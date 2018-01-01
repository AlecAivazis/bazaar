// @flow
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
    mutation CreateFundMutation($input: CreateFundContractInput!) {
        createFund(input: $input) {
            node {
                id
                address
            }
        }
    }
`)
