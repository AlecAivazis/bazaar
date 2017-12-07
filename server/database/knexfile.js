// Update with your config settings.
var path = require('path')

const migrations = {
    tableName: 'knex_migrations'
}

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, '..', 'dev.sqlite3')
        },
        migrations,
        useNullAsDefault: true
    },

    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:'
        },
        migrations,
        useNullAsDefault: true
    },

    staging: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations
    }
}
