// @flow
// external imports
import * as React from 'react'
import { Flex, Text, Measure } from 'quark-web'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
// local imports
import styles from './styles'
import { flatMap } from '~/client/schema/utils'

type TimeseriesDataPoint = {
    value: BigNumber,
    time: moment
}

type Props = {
    initialValue: BigNumber,
    data: TimeseriesDataPoint[]
}

// the current day
const today = moment()
const todayUnix = today.unix()
// the beginning of the week
const beginningOfWeek = moment().subtract(7, 'days')

const Timeseries = ({ initialValue, data: rawData }: Props, { height, width }) => {
    // transform the data to useful values
    let data = rawData.map(point => ({
        ...point,
        time: point.time.unix()
    }))
    // add the point to provide continuity with the initial value
    data.unshift({
        value: initialValue,
        time: beginningOfWeek.unix()
    })

    // base the scaling off of the user's intended data

    // the horizontal scale of the timeseries (pixels per unit time)
    const horizontalScale = width / (today.unix() - beginningOfWeek.unix())
    // the vertical scaling (pixels per ether)
    const verticalScale = (height - 54) / Math.max(...data.map(point => point.value))

    data = data
        // transform the data to fit the boundary of the chart
        .map((point, i) => ({
            ...point,
            x: horizontalScale * (todayUnix - point.time),
            y: verticalScale * point.value
        }))
        // accomodate the craziness of svg's coordinate system
        .map(point => ({
            x: width - point.x,
            y: height - point.y
        }))

    // add the points that make rectangles
    data = flatMap(data, (point, i) => (i === 0 ? point : [{ ...data[i - 1], x: point.x }, point]))

    // add a line from the last point to the end
    data.push({
        ...data[data.length - 1],
        x: width
    })

    // compute the ultima so the gradient can be placed well
    const maxY = Math.max(...data.map(({ y }) => y))
    const minY = Math.min(...data.map(({ y }) => y))

    // the global transform puts 0,0 in the lower left corner
    return (
        <React.Fragment>
            <defs>
                <linearGradient id="timeseries_fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset={minY / maxY - 0.2} stopColor="#5602FF" stopOpacity={0.13} />
                    <stop offset={0.9} stopColor="white" stopOpacity={0} />
                </linearGradient>
            </defs>
            <g transform="translate(0, -32)">
                <path
                    d={data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
                    stroke="#BFB5F2"
                    width={2}
                    fill="none"
                />
                {/* the gradient filling below the line */}
                <polygon
                    points={`${data.map(point => `${point.x},${point.y}`).join(' ')} ${
                        data[data.length - 1].x
                    },${height} 0,${height} `}
                    fill="url(#timeseries_fill)"
                />
            </g>
        </React.Fragment>
    )
}

Timeseries.contextTypes = {
    height: PropTypes.number,
    width: PropTypes.number
}

export default Timeseries
