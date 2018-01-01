// @flow
// external imports
import * as React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { grey3 } from 'quark-web/styles'

// the current day
const today = moment()
// the beginning of the week
const beginningOfWeek = moment().subtract(7, 'days')

type Label = {
    time: moment,
    day: string
}

const WeeklyAxis = (_, { height, width }) => {
    // the full width is equivalent to 7 days in unix timestamps so compute the
    // unix time / pixel scale
    const scale = width / (today.unix() - beginningOfWeek.unix())
    // the day labels and their location
    const labels: Label[] = []

    // while we are still in the last week
    const tracker = moment().startOf('day')
    while (tracker.isAfter(beginningOfWeek)) {
        // add an entry for the day
        labels.push({
            time: tracker.clone(),
            label: tracker.format('dddd')
        })
        // add the entry for the previous day
        tracker.subtract(1, 'day')
    }

    // return the elements that make up the axis
    return (
        <React.Fragment>
            {labels.map(({ time, label }, i) => {
                // compute the distance between now and the start of the day
                const fromNow = width - scale * (today.unix() - time.unix())

                // render the label for a single day (offset from today)
                return (
                    <React.Fragment key={label}>
                        <path d={`M ${fromNow}, 0 L ${fromNow},${height - 10}`} stroke={grey3} />
                        <text
                            textAnchor="start"
                            x={fromNow + 8}
                            y={height - 10}
                            style={{
                                fill: grey3,
                                fontFamily: '"Helvetica Neue"',
                                fontSize: 14
                            }}
                        >
                            {label}
                        </text>
                    </React.Fragment>
                )
            })}
        </React.Fragment>
    )
}

WeeklyAxis.contextTypes = {
    width: PropTypes.number,
    height: PropTypes.number
}

export default WeeklyAxis
