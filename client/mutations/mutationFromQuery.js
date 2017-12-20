// @flow
// external imports
import * as Relay from 'react-relay'

export default (mutation: any) => ({
    environment,
    input,
    ...rest
}: {
    environment: Relay.Environment,
    input: { [key: string]: any }
} & Relay.MutationConfig<any>): void =>
    // commit the mutation to the environment with the given input
    Relay.commitMutation(environment, {
        mutation,
        variables: { input },
        ...rest
    })
