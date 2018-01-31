// external imports
import Web3 from 'web3'
// local imports
import database from '~/server/database'
import findProjectFunds from './findProjectFunds'
import amountForContribution from './amountForContribution'
import { Fund } from '~/contracts'
import { transferFunds } from '~/server/blockchain'

export default async ({ project, issues, user, repo }) => {
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

            // TODO: turn this into a batch insert
            // for each piece of funding we could find
            for (const { fund, amount } of await findProjectFunds(repo, contributionAmount)) {
                let transactionHash = null
                if (user.walletAddress && process.env.NODE_ENV !== 'test') {
                    // create a web3 instance attached to the fund's provider
                    const web3 = new Web3()
                    web3.setProvider(Fund.currentProvider)

                    // figure out the actual contract address
                    const { contractAddress } = await web3.eth.getTransactionReceipt(fund.address)

                    // try to transfer the funds from the fund to the user
                    try {
                        transactionHash = await transferFunds({
                            from: contractAddress,
                            to: user.walletAddress,
                            amount: amount.toString(),
                            projectName: project.repoID
                        })
                    } catch (err) {
                        console.error('Ran into error when signing transaction.', err.message)
                    }
                } else {
                    console.log('received contribution from user without wallet', user.accountName)
                }

                console.log(transactionHash)

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
        } else {
            console.log(`${issue.number} was already credited`)
        }
    }
}
