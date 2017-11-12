// @flow
// external imports
import React from 'react'
import PropTypes from 'prop-types'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { graphql } from 'graphql'
// local imports
import createSchema from '../../schema'

type Props = {
    children: any
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
        const schema = await createSchema()

        // define how queries are performed
        async function fetchQuery(operation, variables, cacheConfig, uploadables) {
            // perform the query
            const result = await graphql(schema, operation.text, variables)

            // return the result
            return result
        }

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
