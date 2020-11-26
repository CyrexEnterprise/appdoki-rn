import React from 'react'
import { View } from 'react-native'
import { Headline, Subheading, useTheme } from 'react-native-paper'
import { AppTheme } from 'constants/theme'
import { Events, State } from 'store/types'
import { useStoreon } from 'storeon/react'

import styles from './styles'
import { BeerTabScreenProps } from './types'

export const BeerTab: React.FC<BeerTabScreenProps> = () => {
  const { colors } = useTheme() as AppTheme
  const { beers } = useStoreon<State, Events>('beers')

  return (
    <View style={styles.flex}>
      <View style={[styles.flex, styles.center, { backgroundColor: colors.surface }]}>
        <Headline>Given</Headline>
        <Subheading>{beers.given}</Subheading>
      </View>

      <View style={[styles.flex, styles.center, { backgroundColor: colors.surface }]}>
        <Headline>Received</Headline>
        <Subheading>{beers.received}</Subheading>
      </View>
    </View>
  )
}
