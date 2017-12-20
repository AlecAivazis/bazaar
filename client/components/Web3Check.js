// @flow
// external imports
import * as React from 'react'

type Props = {
    children: React.Element<*>
}

const Web3Check = ({ children }: Props) => (window.web3 ? children : 'this application needs web3 to run')

export default Web3Check
