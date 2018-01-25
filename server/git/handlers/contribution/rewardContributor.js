// local imports
import database from '~/server/database'
import findProjectFunds from './findProjectFunds'
import amountForContribution from './amountForContribution'
import { Fund } from '~/contracts'
import { transferFunds } from '~/server/blockchain'

export default async ({ project, issues, user, repo }) => {
    console.log(`reward ${user.accountName} for contribution to ${project.repoID}: ${JSON.stringify(issues)}`)
    // check if the user is not already a member of the project
    if (
        (await database('project_membership')
            .where({ userId: user.id, projectId: project.id })
            .count())[0]['count(*)'] === 0
    ) {
        // create an entry in the membership table
        await database('project_membership').insert({ userId: user.id, projectId: project.id })
    }
    // for each issue we care about
    for (const issue of issues) {
        console.log(`looking for rewards for issue #${issue.number}`)
        // look for a transaction record for this issue
        const txBatchCount = (await database('transactions')
            .where({
                project: project.id,
                issueNumber: issue.number
            })
            .distinct('batchNumber')).length
        // if we haven't seen a transaction for this record yet
        if (txBatchCount === 0) {
            // compute the amount this contribution is worth
            const contributionAmount = amountForContribution(issue)
            console.log(`first time seeing issue #${issue.number}, worth ${contributionAmount}`)

            // TODO: turn this into a batch insert
            // for each piece of funding we could find
            for (const { fund, amount } of await findProjectFunds(repo, contributionAmount)) {
                console.log('transaction from ', fund.address)
                // create a transaction for the transfer (if possible)
                const transactionHash =
                    // if we have an address for the user
                    user.walletAddress && process.env.NODE_ENV !== 'test'
                        ? // transfer funds to the user
                          await transferFunds({
                              from: fund.address,
                              to: user.walletAddress,
                              amount,
                              projectName: project.repoID
                          })
                        : // don't initiate a transfer, we'll deal with it later when we have an address for them
                          null

                // record a transaction for this contribution
                await database('transactions').insert({
                    project: project.id,
                    issueNumber: issue.number,
                    created_at: new Date(),
                    recipientId: user.id,
                    amount,
                    fund: fund.id,
                    batchNumber: 0,
                    transactionHash
                })
            }
        }
    }
}
