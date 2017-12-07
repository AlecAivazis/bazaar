// @flow
// external imports
import { commitMutation, graphql } from 'react-relay'
import * as Relay from 'react-relay'

export default (mutation: any) => ({
    environment,
    input,
    onCompleted,
    onError
}: {
    environment: Relay.Environment,
    input: { [key: string]: any },
    onCompleted?: (response: ?Object, errors: ?[Error]) => void,
    onError?: (error: Error) => void
}): void =>
    // commit the mutation to the environment with the given input
    commitMutation(environment, {
        mutation,
        variables: { input },
        onCompleted,
        onError
    })
