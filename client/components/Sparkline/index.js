// @flow
// external imports
import React from 'react'
import { View } from 'react-native-web'
import { Sparklines, SparklinesLine } from 'react-sparklines'
// local imports
import styles from './styles'

type Props = {
    data: Array<number>,
    color: string,
    style: any,
    limit: number,
    width: number,
    height: number
}

const Sparkline = ({ data, color, style, limit, width, height, ...unused }: Props) => (
    <View style={{ ...styles.container, ...style }} {...unused}>
        <Sparklines data={data} limit={limit} width={width} height={height}>
            <SparklinesLine color={color} style={{ fill: 'none' }} />
        </Sparklines>
    </View>
)

export default Sparkline
