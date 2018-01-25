// @flow
// local imports
import database from '~/server/database'

export type Funding = {
    fundId: string,
    amount: number
}

type LanguageSpec = {
    node: {
        name: string
    }
}

export type ProjectCriteriaProfile = {
    languages: {
        edges: LanguageSpec[]
    },
    stargazers: {
        totalCount: number
    }
}

export default async (project: ProjectCriteriaProfile, amount: number): Funding[] => {
    // find all registered constraints that satisfy the project
    const constraints = await database('constraints')
        .select('fundId')
        .where({ field: 'language', bound: 'equals', value: project.languages.edges[0].node.name })
        .orWhere(function() {
            this.where({ field: 'stars', bound: 'lessThan' }).andWhere('value', '>', project.stargazers.totalCount)
        })
        .orWhere(function() {
            this.where({ field: 'stars', bound: 'greaterThan' }).andWhere('value', '<', project.stargazers.totalCount)
        })

    // for now just grab all of the available funds referenced by the matching constraints
    const funds = await database('funds')
        .select('id', 'address')
        .whereIn('id', [...new Set(constraints.map(({ fundId }) => fundId))])

    // TODO: one fund might not be able to support it
    return funds.map(fund => ({ fund, amount: amount / funds.length }))
}
