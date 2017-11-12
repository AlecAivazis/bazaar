// external imports
import { config } from 'dotenv'
import { graphql } from 'graphql'
import { introspectionQuery } from 'graphql/utilities'
import fs from 'fs'
// local imports
import buildSchema from '../src/components/EnvironmentProvider/schema'

async function build() {
    // load the environment
    config()
    process.env.SERVER_ENDPOINT = 'http://localhost:4000/graphql'

    // build the schema we'll use in the client
    const schema = await buildSchema()

    // perform the introspection query
    const introspected = JSON.stringify(await graphql(schema, introspectionQuery), 2)

    // write the schema to a file
    fs.writeFileSync(`${__dirname}/../schema.json`, introspected)

    // notify the user
    console.log('successfully built schema.')
}

build().catch(console.error)
