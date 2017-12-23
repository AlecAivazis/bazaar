// @flow
// external imports
import * as Relay from 'react-relay'
import { resolve } from 'url'

export default (mutation: any) => ({
    environment,
    input,
    variables,
    onFailure,
    onSuccess,
    ...rest
}: {
    environment: Relay.Environment,
    input: { [key: string]: any },
    variables: { [key: string]: any },
    onSuccess: ({ [key: string]: any }) => void,
    onFailure: (PayloadError[]) => void
} & Relay.MutationConfig<any>): Promise<{ [key: string]: any }> =>
    new Promise((resolve, reject) => {
        // commit the mutation to the environment with the given input
        Relay.commitMutation(environment, {
            mutation,
            variables: variables || { input },
            ...rest,
            onError: reject,
            onCompleted: (data, errs) => {
                // if there are errors
                if (errs) {
                    return reject(errs)
                }

                // there are no errors
                return resolve(data)
            }
        })
    })
