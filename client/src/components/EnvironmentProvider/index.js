// @flow
// external imports
import React from 'react'
import PropTypes from 'prop-types'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { graphql } from 'graphql'
// local imports
import createSchema from '../../schema'

type Props = {
    children: any,
    githubToken: string
}

type State = {
    environment: any
}

class EnvironmentProvider extends React.Component<Props, State> {
    state = {
        environment: null
    }

    static childContextTypes = {
        environment: PropTypes.object
    }

    getChildContext() {
        return this.state
    }

    async componentDidMount() {
        // load the client's schema
        const schema = await createSchema(this.props.githubToken)

        const fetchQuery = async (operation, variables) => await graphql(schema, operation.text, null, null, variables)

        // create an environment stored in state
        this.setState({
            environment: new Environment({
                network: Network.create(fetchQuery),
                store: new Store(new RecordSource())
            })
        })
    }

    render = () => this.props.children
}

export default EnvironmentProvider
