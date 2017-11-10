exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('users', function(table) {
        table.increments()
        table.string('name')
        table.timestamps()
    })
}

exports.down = function(knex, Promise) {
    knex.schema.dropTable('users')
}
