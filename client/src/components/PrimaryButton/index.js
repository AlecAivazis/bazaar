// external imports
import React from 'react'
import { PrimaryButton as QuarkButton } from 'quark-web'
// local imports
import { primaryColor, primaryShadow } from '../../styles'

const PrimaryButton = ({ ...unused }) => (
    <QuarkButton defaultColor={primaryColor} activeColor={primaryShadow} {...unused} />
)

export default PrimaryButton
