// @flow
// external imports
import * as React from 'react'

type Props = {
    children: () => React.Element<*>
}

const Auth = ({ children }: Props) => children()

export default Auth
