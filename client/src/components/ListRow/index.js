// @flow
// external imports
import * as React from 'react'
import { View } from 'react-native-web'
import { Text, BooleanState } from 'quark-web'
// local imports
import styles from './styles'

type Props = {
    enableHoverStyle?: boolean,
    last?: boolean,
    style?: { [x: string]: any }
}

const ListRow = ({ enableHoverStyle = true, style, last, ...unused }: Props) => (
    <BooleanState>
        {({ state, set }) => {
            // the base element style
            const baseStyle = { ...(last ? styles.lastStyle : styles.container) }

            // if the mouse is over the element
            if (state) {
                Object.assign(baseStyle, styles.hover)
            }

            return (
                <View
                    style={[baseStyle, style]}
                    onMouseEnter={enableHoverStyle ? () => set(true) : null}
                    onMouseLeave={enableHoverStyle ? () => set(false) : null}
                    {...unused}
                />
            )
        }}
    </BooleanState>
)

export default ListRow
