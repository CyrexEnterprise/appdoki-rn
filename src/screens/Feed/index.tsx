import React from 'react'
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, View } from 'react-native'
import { Avatar, Paragraph, Text, Title, useTheme } from 'react-native-paper'
import LottieView from 'lottie-react-native'
import { AppTheme } from 'constants/theme'
import { BEER_EVENTS } from 'store/beers/events'
import { Beer } from 'store/beers/types'
import { Events, State } from 'store/types'
import { useStoreon } from 'storeon/react'
import { Icon } from 'components/Icon'

import styles from './styles'
import { FeedScreenProps } from './types'
import { Fade } from 'components/Animations'

export const FeedScreen: React.FC<FeedScreenProps> = () => {
  const { colors } = useTheme() as AppTheme
  const { dispatch, beers } = useStoreon<State, Events>('beers')

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
        {beers.loading
          ? (
            <LottieView
              autoPlay
              style={styles.lottieViewBottom}
              source={require('assets/beer-animation.json')}
            />
          )
          : <Text>That's it. Time for some beers?</Text>}
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
        onEndReachedThreshold={0.3}
        onEndReached={() => dispatch(BEER_EVENTS.LOAD_MORE)}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={false}
            enabled={!beers.loading}
            onRefresh={() => dispatch(BEER_EVENTS.LOAD)}
          />
        }
      />

      {/* This animation will only appear if the we have a slow connection */}
      <View style={StyleSheet.absoluteFill} pointerEvents='none'>
        <Fade value={Number(beers.loading)}>
          <LottieView
            autoPlay
            style={styles.lottieViewTop}
            source={require('assets/beer-animation.json')}
          />
        </Fade>
      </View>
    </View>
  )
}
