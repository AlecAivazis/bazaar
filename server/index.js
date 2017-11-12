// external imports
import express from 'express'
import * as bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { config as configEnv } from 'dotenv'
// local imports
import schema from './schema'

async function run() {
    // load environment variables
    configEnv()

    // an express app to use
    const app = express()

    // attach the graphql endpoint
    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
    // add graphiql
    app.use(
        '/graphiql',
        graphiqlExpress({
            endpointURL: '/graphql'
        })
    )

    app.listen(4000, () => console.log('listening on :4000'))
}

// start the server
run().catch(console.error)
