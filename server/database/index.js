// external imports
import knex from 'knex'
// local imports
import { development } from './knexfile'

// create the knex wrapper
const db = knex(development)

// whenever a query is logged
db.on('query', query => {
    console.log('--- executing query ---')
    console.log(query.sql)
    console.log('-----------------------')
})

export default db
