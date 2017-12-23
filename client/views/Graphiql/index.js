// external imports
import React from 'react'
import ReactDOM from 'react-dom'
import GraphiQL from 'graphiql'
import { graphql } from 'graphql'
// local imports
import { Portal } from '~/client/quark'
import createSchema from '~/client/schema'
import './styles.css'

let schema

const graphQLFetcher = token => async graphQLParams => {
    if (!schema) {
        schema = await createSchema(token)
    }

    return await graphql(schema, graphQLParams.query)
}

export default ({ githubToken }) => (
    <Portal id="graphiql" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <GraphiQL fetcher={graphQLFetcher(githubToken)} />
    </Portal>
)
