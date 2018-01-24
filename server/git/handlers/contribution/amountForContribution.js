export default issue =>
    issue.comments.edges.map(({ node }) => node.reactions.totalCount).reduce((prev, curr) => prev + 0.01 * curr, 0)
