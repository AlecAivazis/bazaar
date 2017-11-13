exports.seed = function(knex, Promise) {
    // make some projects and funds
    return Promise.all([
        knex('projects')
            .del()
            .then(function() {
                // Inserts seed entries
                return knex('projects').insert([
                    { repoID: 'AlecAivazis/survey' },
                    { repoID: 'AlecAivazis/redux-responsive' },
                    { repoID: 'AlecAivazis/feynman' }
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
                        fund: 1,
                        recipientName: 'AlecAivazis',
                        amount: 1,
                        project: 'AlecAivazis/survey'
                    },
                    {
                        fund: 1,
                        recipientName: 'AlecAivazis',
                        amount: 2,
                        project: 'AlecAivazis/survey'
                    },
                    {
                        fund: 1,
                        recipientName: 'AlecAivazis',
                        amount: 3,
                        project: 'AlecAivazis/survey'
                    },
                    {
                        fund: 1,
                        recipientName: 'AlecAivazis',
                        amount: 4,
                        project: 'AlecAivazis/survey'
                    }
                ])
            })
    })
}
