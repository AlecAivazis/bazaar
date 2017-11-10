// external imports
import knex from 'knex'

// the path to the database file
const filename = `${__dirname}/../db.sqlite3`

export default knex({
    client: 'sqlite3',
    connection: {
        filename
    }
})
