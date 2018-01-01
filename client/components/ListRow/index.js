// @flow
// external imports
import * as React from 'react'
import { View } from 'react-native-web'
import { BooleanState } from 'quark-web'
// local imports
import styles from './styles'

type Props = {
    hoverStyle?: boolean,
    last?: boolean,
    style?: { [x: string]: any }
}

const ListRow = ({ hoverStyle = {}, style, last, ...unused }: Props) => (
    <BooleanState>
        {({ state, set }) => {
            // the base element style
            const baseStyle = { ...(last ? styles.lastStyle : styles.container) }

            // if the mouse is over the element
            if (state && hoverStyle) {
                Object.assign(baseStyle, styles.hover, hoverStyle)
            }

            return (
                <View
                    style={[baseStyle, style]}
                    onMouseEnter={hoverStyle ? () => set(true) : null}
                    onMouseLeave={hoverStyle ? () => set(false) : null}
                    {...unused}
                />
            )
        }}
    </BooleanState>
)

export default ListRow
