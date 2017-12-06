exports.up = function(knex, Promise) {
    return Promise.all([
        // project table
        knex.schema.createTableIfNotExists('projects', function(table) {
            table.increments()
            table.string('repoID')
        }),

        // project membership table
        knex.schema.createTableIfNotExists('project_membership', function(table) {
            table.string('projectId').references('projects.id')
            table.string('userId').references('users.id')
            table.string('role').notNullable()
        }),

        // user table
        knex.schema.createTableIfNotExists('users', function(table) {
            table.increments()
            table.string('accountName')
        }),

        // transaction table
        knex.schema.createTableIfNotExists('transactions', function(table) {
            table.increments()
            table.float('amount')
            table.string('recipientId').references('users.id')
            table.timestamp('created_at').defaultTo(knex.fn.now())

            // project foreign key
            table.integer('project').unsigned()
            table.foreign('project').references('projects.id')

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
