// a pull request is only valid
export default pull_request =>
    // if it was merged (not closed)
    pull_request.merged &&
    // and targets the default branch of the repo
    pull_request.base.ref === pull_request.repo.default_branch
