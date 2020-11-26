import { Icon } from 'components/Icon'
import { AppTheme } from 'constants/theme'
import React from 'react'
import { ListRenderItem, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Avatar, Paragraph, Surface, Title, useTheme } from 'react-native-paper'
import { Beer } from 'store/beers/types'
import { Events, State } from 'store/types'
import { useStoreon } from 'storeon/react'

import styles from './styles'
import { FeedScreenProps } from './types'

export const Feed: React.FC<FeedScreenProps> = () => {
  const { colors } = useTheme() as AppTheme
  const { beers } = useStoreon<State, Events>('beers')

  const renderItem: ListRenderItem<Beer> = ({ item }) => {
    const giverFName = item.giver.name.split(' ')[0]
    const receiverFName = item.receiver.name.split(' ')[0]
    const giverPic = item.giver.picture
    const receiverPic = item.receiver.picture

    return (
      <Surface style={[styles.row, styles.feedItem]}>
        <View style={styles.userInfo}>
          {giverPic ? (
            <Avatar.Image size={50} source={{ uri: giverPic }} />
          ) : (
            <Avatar.Icon size={50} icon='guy-fawkes-mask' theme={{ colors: { primary: colors.accent } }} />
          )}

          <Paragraph>{giverFName}</Paragraph>
        </View>

        <View style={styles.row}>
          <Icon size={30} name='glass-mug-variant' color={colors.amber} />
          <Icon style={styles.arrow} size={50} name='ray-start-arrow' color={colors.onSurface} />
          <Title>{item.beers}</Title>
        </View>

        <View style={styles.userInfo}>
          {receiverPic ? (
            <Avatar.Image size={50} source={{ uri: receiverPic }} />
          ) : (
            <Avatar.Icon size={50} icon='guy-fawkes-mask' theme={{ colors: { primary: colors.accent } }} />
          )}

          <Paragraph>{receiverFName}</Paragraph>
        </View>
      </Surface>
    )
  }

  const keyExtractor = (item: Beer) => `${item.giver.id}-${item.givenAt}`

  return (
    <View style={styles.flex}>
      <FlatList
        style={styles.flex}
        data={beers.beerLog}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}
