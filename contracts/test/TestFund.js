// grab the contract abstractions that we need
const Fund = artifacts.require('Fund')

contract('Fund', async accounts => {
    it('depositing funds should add a transaction record', async () => {
        const value = web3.toWei(1, 'ether')

        // create a new fund that we own
        const fund = await Fund.new(accounts[0], {
            from: accounts[0]
        })

        // deposit 1 ether into the fund
        await fund.deposit({
            from: accounts[0],
            value
        })

        // make sure we added a transactions
        assert.equal(2, await fund.numberOfTransactions())

        // grab the data we care about from the transaction entry
        const [address, projectName, direction, amount, _, balance] = await fund.transaction(1)

        // make sure values are what we expect
        assert.equal(address, accounts[0])
        assert.equal(direction, 0) // enums are zero-indexed and deposit is first
        assert.equal(projectName, '')
        assert.equal(amount, web3.toWei(1, 'ether').toString())
        assert.equal(balance, value)
    })

    it('prevents withdraws specified by an untrusted account', async () => {
        // the amount to transact
        const amount = web3.toWei(1, 'ether')

        // create a new fund that we own
        const fund = await Fund.new(accounts[0], {
            from: accounts[0]
        })

        // deposit 1 ether into the fund
        await fund.deposit({
            from: accounts[0],
            value: amount
        })

        // track if we saw an error
        let encounteredError = false

        try {
            // try to withdraw money from the fund as the untrusted user
            await fund.transferReward(accounts[1], 'TestProject', amount, {
                from: accounts[1]
            })
        } catch (err) {
            encounteredError = true
        }

        // make sure we encountered an error
        assert.equal(true, encounteredError)
    })

    it('withdawing funds should add a transaction record', async () => {
        // the amount to transact
        const amount = web3.toWei(1, 'ether')

        // create a new fund that we own
        const fund = await Fund.new(accounts[0], {
            from: accounts[0]
        })

        // deposit 1 ether into the fund
        await fund.deposit({
            from: accounts[0],
            value: amount
        })

        // and withdraw 1 ether into the fund
        await fund.transferReward(accounts[1], 'TestProject', amount)

        // make sure we added a transactions
        assert.equal(3, await fund.numberOfTransactions())

        // grab the data we care about from the transaction entry
        const [account, project, direction, value, _, balance] = await fund.transaction(2)

        // make sure values are what we expect
        assert.equal(account, accounts[1])
        assert.equal(direction, 1) // enums are zero-indexed and deposit is first
        assert.equal(project, 'TestProject')
        assert.equal(amount, value)
        assert.equal(balance, 0)
    })

    it('withdrawing funds transfers ether to recipient', async () => {
        // the amount to transact
        const amount = web3.toWei(1, 'ether')

        // create a new fund that we own
        const fund = await Fund.new(accounts[0], {
            from: accounts[0]
        })

        // deposit 1 ether into the fund
        await fund.deposit({
            from: accounts[0],
            value: amount
        })

        // the current balance of the recipient
        const originalBalance = await web3.eth.getBalance(accounts[1])

        // and withdraw 1 ether into the fund
        await fund.transferReward(accounts[1], 'TestProject', amount)

        // the new balance
        const newBalance = await web3.eth.getBalance(accounts[1])

        // make sure we've transfered some amount of money to the target (
        // QUESTION: how do I know how much gas was used and therefor exactly how much was transfered?
        assert.equal(1, newBalance.comparedTo(originalBalance))
    })
})
