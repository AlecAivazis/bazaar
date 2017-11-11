exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('projects', function(table) {
        table.increments()
        table.string('repoID')
    })
}

exports.down = function(knex, Promise) {
    knex.schema.dropTable('users')
}
