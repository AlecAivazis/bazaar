exports.up = function(knex, Promise) {
    return Promise.all([
        // project table
        knex.schema.createTableIfNotExists('projects', function(table) {
            table.string('repoID').unique()
        }),

        // transaction table
        knex.schema.createTableIfNotExists('transactions', function(table) {
            table.increments()
            table.float('amount')
            table.string('recipientName')
            table.timestamps()

            // project foreign key
            table.integer('project').unsigned()
            table.foreign('project').references('projects.repoID')

            // fund foreign key
            table.integer('fund').unsigned()
            table.foreign('fund').references('funds.id')
        }),

        // fund table
        knex.schema.createTableIfNotExists('funds', function(table) {
            table.increments()
            table.string('name')
            table.string('address')
        })
    ])
}

exports.down = function(knex, Promise) {
    knex.schema.dropTable('users')
}
