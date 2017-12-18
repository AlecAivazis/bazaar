// external imports
import React from 'react'
import { View } from 'react-native-web'
import { Link } from 'react-router-dom'
import { H1, PrimaryButton } from 'quark-web'
// local imports
import styles from './styles'

const FundList = () => (
    <React.Fragment>
        <View style={styles.header}>
            <H1>My Funds</H1>
            <Link to="/funds/new" style={{ width: 160 }}>
                <PrimaryButton>Create a Fund</PrimaryButton>
            </Link>
        </View>
    </React.Fragment>
)

export default FundList
