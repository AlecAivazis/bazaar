// @flow
// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
import type { Node } from 'react-native-web'
import { Card } from 'quark-web'
// local imports
import styles from './styles'

type Props = {
    icon: Node,
    label: string,
    value: string | number,
    style: any
}

const Metric = ({ icon, label, value, style, ...unused }: Props) => (
    <Card style={{ ...styles.container, ...style }} {...unused}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.valueContainer}>
            <View style={styles.valueContainer}>
                <Text style={styles.value}>{value}</Text>
            </View>
            <View style={styles.labelContainer}>
                <Text style={style.label}>{label}</Text>
            </View>
        </View>
    </Card>
)

export default Metric
