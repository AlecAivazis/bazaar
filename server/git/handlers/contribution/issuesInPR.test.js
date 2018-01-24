// local imports
import issuesInPR, { _magicWords } from './issuesInPR'

test('identifies each of the documented magic words', () => {
    for (const word of _magicWords) {
        // compute the list of related queries
        const queries = issuesInPR(`the body of this PR ${word} #3, ${word} #2, ${word} #1`)

        // make sure we got the issue back
        expect(queries).toEqual([3, 2, 1])
    }
})
