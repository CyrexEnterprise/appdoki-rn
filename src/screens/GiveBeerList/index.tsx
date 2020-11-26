import React from 'react'
import { ListRenderItem, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar, Divider, Subheading, Text, Title, useTheme } from 'react-native-paper'
import { SharedElement } from 'react-navigation-shared-element'
import { AppTheme } from 'constants/theme'
import { User } from 'store/auth/types'
import { Events, State } from 'store/types'
import { useStoreon } from 'storeon/react'

import styles from './styles'
import { GiveBeerListScreenProps } from './types'

export const GiveBeerList: React.FC<GiveBeerListScreenProps> = ({ navigation }) => {
  const { colors } = useTheme() as AppTheme
  const { users, auth } = useStoreon<State, Events>('users', 'auth')

  const keyExtractor = (item: User) => `${item.id}`

  const renderItem: ListRenderItem<User> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('GiveBeer', item)}>
        <View style={[styles.row, styles.item, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarConatiner}>
            <SharedElement id={`item.${item.id}.avatar`}>
              {item.picture ? (
                <Avatar.Image size={50} source={{ uri: item.picture }} />
              ) : (
                <Avatar.Icon size={50} icon='guy-fawkes-mask' theme={{ colors: { primary: colors.accent } }} />
              )}
            </SharedElement>
          </View>

          <Subheading>{item.name}</Subheading>
        </View>
      </TouchableOpacity>
    )
  }

  const renderHeader = () => {
    return (
      <View style={[styles.listHeader, { backgroundColor: colors.surface }]}>
        <Title>Who deserves a beer?</Title>
      </View>
    )
  }

  const renderFooter: React.FC = () => {
    return (
      <View style={[styles.endOfList, { backgroundColor: colors.surface }]}>
        <Text>We need to hire more peeps!</Text>
      </View>
    )
  }

  return (
    <View style={styles.flex}>
      <FlatList
        style={styles.flex}
        data={users.users.filter((user) => user.id !== auth.user?.id)}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={Divider}
      />
    </View>
  )
}
