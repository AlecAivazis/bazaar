var moment = require('moment')

exports.seed = function(knex, Promise) {
    // make some projects and funds
    return Promise.all([
        knex('projects')
            .del()
            .then(function() {
                // Inserts seed entries
                return knex('projects').insert([
                    { id: 1, repoID: 'AlecAivazis/survey' },
                    { id: 2, repoID: 'AlecAivazis/redux-responsive' },
                    { id: 3, repoID: 'AlecAivazis/feynman' }
                ])
            }),
        knex('funds')
            .del()
            .then(function() {
                return knex('funds').insert([
                    { id: 1, name: "Bill Gate's fund" },
                    { id: 2, name: 'Another Awesome Fund' }
                ])
            }),
        knex('users')
            .del()
            .then(function() {
                return knex('users').insert([
                    { id: 1, accountName: 'AlecAivazis' },
                    { id: 2, accountName: 'aivazis' }
                ])
            })
        // once we've made some funds and projects
    ]).then(function() {
        // let's pay some users
        return Promise.all([
            knex('transactions')
                .del()
                .then(function() {
                    return knex('transactions').insert([
                        {
                            id: 1,
                            created_at: moment()
                                .utc()
                                .format(),
                            fund: 1,
                            recipientId: 1,
                            amount: 1,
                            project: 1
                        },
                        {
                            id: 2,
                            created_at: moment()
                                .subtract(1, 'day')
                                .utc()
                                .format(),
                            fund: 1,
                            recipientId: 1,
                            amount: 2,
                            project: 1
                        },
                        {
                            id: 3,
                            created_at: moment()
                                .subtract(1, 'day')
                                .utc()
                                .format(),
                            fund: 1,
                            recipientId: 1,
                            amount: 3,
                            project: 1
                        },
                        {
                            id: 4,
                            created_at: moment()
                                .subtract(3, 'day')
                                .utc()
                                .format(),
                            fund: 1,
                            recipientId: 1,
                            amount: 4,
                            project: 1
                        }
                    ])
                }),
            knex('project_membership')
                .del()
                .then(function() {
                    return knex('project_membership').insert([
                        {
                            projectId: 1,
                            userId: 1,
                            role: 'admin'
                        },
                        {
                            projectId: 1,
                            userId: 2,
                            role: 'admin'
                        },
                        {
                            projectId: 2,
                            userId: 1,
                            role: 'admin'
                        }
                    ])
                })
        ])
    })
}
