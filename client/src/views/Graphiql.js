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
        console.log('loading schema')
        schema = await createSchema()
    }

    return await graphql(schema, graphQLParams.query)
}

export default () => ReactDOM.createPortal(<GraphiQL fetcher={graphQLFetcher} />, modalRoot)
