/*
  This module handles the Welcome PR workflow which is broken up into the follow steps:

    1. When a project is first registered with bazr, the webhook URL is hit by github
       which initializes this flow.

    2. The bot account needs to fork the project and submit a PR with a change to the README
       which provides some basic information introducing the project to bazr as well as
       adds a badge indicating the project is backed by bazr.

    3. When the user merges this PR, they will get their first contribution adding the project
       to the user's project list view

*/
export const createFork = async () => {}

export const createAndSendUpdate = async () => {}

export const recieveContribution = async () => {}
