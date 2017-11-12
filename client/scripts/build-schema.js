// external imports
var { config } = require('dotenv')
var { graphql } = require('graphql')
var { introspectionQuery } = require('graphql/utilities')
var fs = require('fs')
// local imports
var buildSchema = require('../src/components/EnvironmentProvider/schema')

async function build() {
    // load the environment
    config()

    // build the schema we'll use in the client
    const schema = await buildSchema()

    // perform the introspection query
    const introspected = JSON.stringify(await graphql(schema, introspectionQuery), 2)

    fs.writeFileSync(`${__dirname}/../schema.json`, introspected)
}

build().catch(console.error)
