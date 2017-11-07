// external imports
import React from 'react'

const Icon = ({ name, ...unused }) => {
    // load the svg element
    const Element = require(`./${name}`).default

    // render the right component
    return <Element {...unused} />
}

export default Icon
