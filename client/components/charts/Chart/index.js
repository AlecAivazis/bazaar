// external imports
import * as React from 'react'
import PropTypes from 'prop-types'
import { Measure } from 'quark-web'
// local imports
import styles from './styles'

type Props = {
    width: number,
    height: number,
    children: React.Element<*>
}

// this component is split up into to in order to inject the data provided through a render
// callback as context to the actual graphics
class ChartContext extends React.Component<Props> {
    static childContextTypes = {
        width: PropTypes.number,
        height: PropTypes.number
    }

    getChildContext() {
        return {
            height: this.props.height,
            width: this.props.width
        }
    }

    render = () => this.props.children
}

export default ({ children, style }) => (
    <Measure>
        {({ measureRef, height, width }) => {
            // if we haven't measured anything yet
            if (width === -1) {
                // leave an element behind we can measure before rendering any content
                return <svg style={{ ...styles.container, ...style }} ref={measureRef} />
            }

            return (
                <svg style={{ ...styles.container, ...style }} ref={measureRef}>
                    <ChartContext height={height} width={width}>
                        {children}
                    </ChartContext>
                </svg>
            )
        }}
    </Measure>
)
