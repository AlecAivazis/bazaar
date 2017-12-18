// local imports
import database, { migrateDb, cleanDb } from '../database'
import { recieveContribution } from './welcome'

describe('Git Integration', () => {
    describe('Welcome PR Flow', () => {
        describe('Recieving the first contribution', () => {
            beforeEach(migrateDb)
            afterEach(cleanDb)

            test('it will create the user the first time a contribution is encountered', async () => {
                // sanity check
                expect(
                    (await database('users')
                        .where({ accountName: 'testAccount' })
                        .count())[0]['count(*)']
                ).toEqual(0)

                // mock a transaction recieved
                await recieveContribution({ repoID: 'AlecAivazis/survey', user: 'testAccount' })

                // make sure we created the user
                expect(
                    (await database('users')
                        .where({ accountName: 'testAccount' })
                        .count())[0]['count(*)']
                ).toEqual(1)
            })

            test("doesn't explode if the user does already exist", async () => {
                // creat the user we are about to transact with
                await database('users').insert({ accountName: 'AlecAivazis' })
                // mock a transaction recieved
                await recieveContribution({ repoID: 'AlecAivazis/survey', user: 'AlecAivazis' })
            })

            test('creates a 0 value transaction record between the user and project', async () => {
                // create the project
                await database('projects').insert({ repoID: 'AlecAivazis/survey' })

                // mock a transaction recieved
                await recieveContribution({ repoID: 'AlecAivazis/survey', user: 'AlecAivazis' })

                // look for a transaction between the project and user (there are 2 users in the test suite)
                const transactions = await database('transactions')
                    .where({ recipientId: 1, project: 1 })
                    .select('amount')

                // there should be one
                expect(transactions).toHaveLength(1)

                // make sure the ammount in the first transaction is 0
                expect(transactions[0].amount).toEqual(0)
            })

            test("closes the bot's fork of the parent repo", async () => {
                // mock the github client
            })
        })
    })
})
