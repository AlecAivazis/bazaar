// @flow
// external imports
import React from 'react'
import { Text } from 'quark-web'
import { withRouter } from 'react-router-dom'
import { Timeout } from '~/client/quark'

const Finalize = ({ fund, history }) => (
    <React.Fragment>
        <Text>Finished! Redirecting you to your new fund...</Text>
        <Timeout delay={2500}>{() => history.push(`/funds/${fund.address}`)}</Timeout>
    </React.Fragment>
)

export default withRouter(Finalize)
