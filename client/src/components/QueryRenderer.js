// external imports
import React from 'react'
import { QueryRenderer } from 'react-relay'
import { Text } from 'react-native-web'
import PropTypes from 'prop-types'

const QR = ({ render, ...props }, { environment }) =>
    !environment ? (
        <Text>loading</Text>
    ) : (
        <QueryRenderer
            {...props}
            environment={environment}
            render={({ error, props: result }) => {
                // if there is an error
                if (error) {
                    throw new Error(error)
                }
                // if we are still loading
                if (!result) {
                    return <Text>loading</Text>
                }
                // call the render callback
                return render(result)
            }}
        />
    )

QR.contextTypes = {
    environment: PropTypes.any
}

export default QR
