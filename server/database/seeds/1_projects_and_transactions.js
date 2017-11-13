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
            })
        // once we've made some funds and projects
    ]).then(function() {
        // let's pay some users
        return knex('transactions')
            .del()
            .then(function() {
                return knex('transactions').insert([
                    {
                        id: 1,
                        fund: 1,
                        recipientName: 'AlecAivazis',
                        amount: 1,
                        project: 1
                    },
                    {
                        id: 2,
                        fund: 1,
                        recipientName: 'AlecAivazis',
                        amount: 2,
                        project: 1
                    },
                    {
                        id: 3,
                        fund: 1,
                        recipientName: 'AlecAivazis',
                        amount: 3,
                        project: 1
                    },
                    {
                        id: 4,
                        fund: 1,
                        recipientName: 'AlecAivazis',
                        amount: 4,
                        project: 1
                    }
                ])
            })
    })
}
