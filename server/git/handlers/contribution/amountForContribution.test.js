// local imports
import amountForContribution from './amountForContribution'

test('computes the correct amount for a simple contribution', () => {
    // an issue to test against
    const issue = {
        comments: {
            edges: [
                {
                    node: {
                        reactions: {
                            totalCount: 3
                        }
                    }
                }
            ]
        }
    }

    // check that we base the value on the number of votes
    expect(amountForContribution(issue)).toEqual(0.04)
})

test('has a base cost for a contribution', () => {
    // an issue to test against
    const issue = {
        comments: {
            edges: []
        }
    }

    // check that we base the value on the number of votes
    expect(amountForContribution(issue)).toEqual(0.01)
})
