// external imports
import express from 'express'
import * as bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { config as configEnv } from 'dotenv'
// local imports
import schema from './schema'
import gitDecorator from './git'

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

// enable the github integrations
gitDecorator(app)

// start the server
app.listen(4000, () => console.log('listening on :4000'))
