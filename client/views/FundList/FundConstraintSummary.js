// external imports
import React from 'react'
import { Subtitle, IconStar } from 'quark-web'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import styles from './styles'

const FundConstraintSummary = ({ fund }) =>
    fund.constraints.length === 0
        ? 'none'
        : fund.constraints.edges.map(({ node: constraint }, i) => (
              <Subtitle style={styles.stat} key={i}>
                  {constraint.__typename === 'LanguageConstraint' ? (
                      constraint.value
                  ) : (
                      <React.Fragment>
                          {constraint.bound === 'LESS_THAN' ? 'less than ' : 'greater than '} {constraint.value}
                          <span style={styles.star}>
                              <IconStar />
                          </span>
                      </React.Fragment>
                  )}
                  {i !== fund.constraints.edges.length - 1 && <span style={styles.separator}>&middot;</span>}
              </Subtitle>
          ))

export default createFragmentContainer(
    FundConstraintSummary,
    graphql`
        fragment FundConstraintSummary_fund on Fund {
            name
            constraints {
                edges {
                    node {
                        __typename
                        ... on LanguageConstraint {
                            value
                        }
                        ... on StarConstraint {
                            value
                            bound
                        }
                    }
                }
            }
        }
    `
)
