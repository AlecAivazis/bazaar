// external imports
import knex from 'knex'
// local imports
import * as configs from './knexfile'
export * from './init'

// create the knex wrapper
const db = knex(configs[process.env.NODE_ENV || 'development'])

// db.on('query', ({ sql }) => console.log(sql))

export default db
