import { Icon } from 'components/Icon'
import { AppTheme } from 'constants/theme'
import React from 'react'
import { ListRenderItem, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Avatar, Paragraph, Text, Title, useTheme } from 'react-native-paper'
import { Beer } from 'store/beers/types'
import { Events, State } from 'store/types'
import { useStoreon } from 'storeon/react'

import styles from './styles'
import { FeedScreenProps } from './types'

export const Feed: React.FC<FeedScreenProps> = () => {
  const { colors } = useTheme() as AppTheme
  const { beers } = useStoreon<State, Events>('beers')

  const keyExtractor = (item: Beer) => `${item.giver.id}-${item.givenAt}-${item.receiver.id}`

  const renderItem: ListRenderItem<Beer> = ({ item }) => {
    const giverFName = item.giver.name.split(' ')[0]
    const receiverFName = item.receiver.name.split(' ')[0]
    const giverPic = item.giver.picture
    const receiverPic = item.receiver.picture

    return (
      <View style={[styles.row, styles.feedItem, { backgroundColor: colors.surface }]}>
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
      </View>
    )
  }

  const renderFooter: React.FC = () => {
    return (
      <View style={[styles.endOfList, { backgroundColor: colors.surface }]}>
        <Text>That's it. Time for some beers?</Text>
      </View>
    )
  }

  return (
    <View style={styles.flex}>
      <FlatList
        style={styles.flex}
        data={beers.beerLog}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />
    </View>
  )
}
