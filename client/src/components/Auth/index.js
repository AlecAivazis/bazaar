// @flow
// external imports
import * as React from 'react'
import querystring from 'query-string'
import { withRouter } from 'react-router-dom'

type Props = {
    children: () => React.Element<*>
}

type State = {
    accessToken: ?string
}

class Auth extends React.Component<Props> {
    state = {
        accessToken: null
    }

    constructor(...args) {
        super(...args)
        this.state = {
            accessToken: localStorage.getItem('accessToken')
        }
    }

    componentDidMount() {
        // look for a token param in the window location
        const { token } = querystring.parse(window.location.search)

        // if we were redirected here with an access token
        if (token) {
            // write the access token to local storage
            localStorage.setItem('accessToken', token)
            // send the user back to the view they were at without token ugliness
            window.location = `${window.location.origin}${window.location.pathname}`

            // if we don't have an access token in local storage
        } else if (!this.state.accessToken) {
            // we need to generate a new one
            window.location = 'http://localhost:4000/oauth'
        }
    }

    render = () => this.props.children(this.state.accessToken)
}

export default withRouter(Auth)
