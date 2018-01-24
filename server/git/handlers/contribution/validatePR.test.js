// local imports
import validatePR from './validatePR'

test('is not valid if PR was closed', async () => {
    expect(
        validatePR({
            merged: false,
            repo: {
                default_branch: 'master'
            },
            base: {
                ref: 'foo'
            },
            user: {
                login: 'asdf'
            },
            body: 'fixes #1'
        })
    ).toBeFalsy()
})

test('is valid if PR targetted default branch', async () => {
    expect(
        validatePR({
            merged: true,
            repo: {
                default_branch: 'master'
            },
            base: {
                ref: 'master'
            },
            user: {
                login: 'asdf'
            },
            body: 'fixes #1'
        })
    ).toBeTruthy()
})

test('does not reward contributor if PR targetted a non-default branch', async () => {
    expect(
        validatePR({
            merged: true,
            repo: {
                default_branch: 'master'
            },
            base: {
                ref: 'foo'
            },
            user: {
                login: 'asdf'
            },
            body: 'fixes #1'
        })
    ).toBeFalsy()
})
