// external imports
import React from 'react'
import ReactDOM from 'react-dom'
import GraphiQL from 'graphiql'
import { graphql } from 'graphql'
// local imports
import createSchema from '../schema'

const modalRoot = document.getElementById('portal')
let schema

async function graphQLFetcher(graphQLParams) {
    if (!schema) {
        schema = await createSchema()
    }

    return await graphql(schema, graphQLParams.query)
}

export default () =>
    ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <GraphiQL fetcher={graphQLFetcher} />
        </div>,
        modalRoot
    )
