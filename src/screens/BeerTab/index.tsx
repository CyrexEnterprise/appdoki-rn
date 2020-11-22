import React from 'react'
import { View } from 'react-native'
import { Headline, Subheading, Surface } from 'react-native-paper'
import { Events, State } from 'store/types'
import { useStoreon } from 'storeon/react'

import styles from './styles'
import { BeerTabScreenProps } from './types'

export const BeerTab: React.FC<BeerTabScreenProps> = () => {
  const { beers } = useStoreon<State, Events>('beers')

  return (
    <View style={styles.flex}>
      <Surface style={[styles.flex, styles.center, styles.card]}>
        <Headline>Given</Headline>
        <Subheading>{beers.given}</Subheading>
      </Surface>

      <Surface style={[styles.flex, styles.center, styles.card]}>
        <Headline>Received</Headline>
        <Subheading>{beers.received}</Subheading>
      </Surface>
    </View>
  )
}
