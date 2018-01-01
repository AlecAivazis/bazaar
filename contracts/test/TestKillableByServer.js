// grab the contract abstractions that we need
const TestKillable = artifacts.require('TestKillable')

contract('KillableByServer', async accounts => {
    it('should prevent non-trusted actions', async () => {
        // the designated owner
        const trusted = accounts[0]

        // deploy a test killable with the designated owner
        const killable = await TestKillable.new(trusted, {
            from: trusted
        })

        let encounteredError = false

        try {
            // attempting to call the protected method should throw an error
            await killable.test.call({
                from: accounts[1]
            })
        } catch (err) {
            // if we caught an error we passed
            encounteredError = true
        }

        // make sure we encountered an error
        assert.equal(encounteredError, true)
    })

    it('should allow the protected user to invoke modified methods', async () => {
        // the designated owner
        const trusted = accounts[0]

        // deploy a test killable with the designated owner
        const killable = await TestKillable.new(trusted, {
            from: trusted
        })

        // attempt to call the trusted method
        await killable.test.call({ from: trusted })
    })
})
