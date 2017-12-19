// local imports
import database from '.'
import { up } from './migrations/20171110123541_init_projects'
import { seed } from './seeds/1_projects_and_transactions'

export async function initDb() {
    await up(database, Promise)
    await seed(database, Promise)
}

export async function migrateDb() {
    await up(database, Promise)
}

export async function cleanDb() {
    await Promise.all([
        database.schema.dropTable('projects'),
        database.schema.dropTable('users'),
        database.schema.dropTable('transactions'),
        database.schema.dropTable('funds'),
        database.schema.dropTable('project_membership')
    ])
}
