// external imports
import React from 'react'
import ReactDOM from 'react-dom'
import GraphiQL from 'graphiql'
import { graphql } from 'graphql'
import { WithPortal } from 'quark-web'
// local imports
import createSchema from '../schema'

let schema

async function graphQLFetcher(graphQLParams) {
    if (!schema) {
        schema = await createSchema()
    }

    return await graphql(schema, graphQLParams.query)
}

export default () => (
    <WithPortal id="graphiql">
        {element =>
            ReactDOM.createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <GraphiQL fetcher={graphQLFetcher} />
                </div>,
                element
            )
        }
    </WithPortal>
)
