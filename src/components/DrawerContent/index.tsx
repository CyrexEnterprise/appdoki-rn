import React from 'react'
import { View } from 'react-native'
import { useStoreon } from 'storeon/react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { Avatar, Caption, Drawer, Paragraph, Switch, Text, Title, TouchableRipple, useTheme } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { Events, State } from 'store/types'
import { PREFERENCES_EVENTS } from 'store/preferences/events'
import { AUTH_EVENTS } from 'store/auth/events'
import { Icon } from 'components/Icon'

import styles from './styles'
import { DrawerContentProps } from './types'

export const DrawerContent = (props: DrawerContentProps) => {
  const theme = useTheme()
  const { dispatch, preferences, auth, beers } = useStoreon<State, Events>('preferences', 'auth', 'beers')
  const picUrl = auth.user?.picture

  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  })

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Animated.View
        style={[
          styles.drawerContent,
          { transform: [{ translateX }] },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              props.navigation.toggleDrawer()
            }}
          >
            {picUrl ? (
              <Avatar.Image size={50} source={{ uri: picUrl }} />
            ) : (
              <Avatar.Icon size={50} icon='guy-fawkes-mask' />
            )}
          </TouchableOpacity>

          <Title style={styles.title}>{auth.user?.name}</Title>
          <Caption style={styles.caption}>@cloudoki</Caption>

          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {beers.received + beers.given}
              </Paragraph>
              <Caption style={styles.caption}>Beers</Caption>
            </View>

            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {beers.given}
              </Paragraph>
              <Caption style={styles.caption}>Given</Caption>
            </View>
          </View>
        </View>

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name='guy-fawkes-mask'
                color={color}
                size={size}
              />
            )}
            label='Profile'
            onPress={() => undefined}
          />

          <DrawerItem
            icon={({ color, size }) => <Icon name='logout' color={color} size={size} />}
            label='Logout'
            onPress={() => dispatch(AUTH_EVENTS.LOGOUT)}
          />
        </Drawer.Section>

        <Drawer.Section title='Preferences'>
          <TouchableRipple onPress={() => dispatch(PREFERENCES_EVENTS.TOGGLE_THEME)}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents='none'>
                <Switch value={preferences.themeType === 'dark'} color={theme.colors.primary} />
              </View>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => dispatch(PREFERENCES_EVENTS.UPDATE_CLOCKIFY, { on: !preferences.clockify.on })}
          >
            <View style={styles.preference}>
              <Text>Clockify Reminder</Text>
              <View pointerEvents='none'>
                <Switch value={preferences.clockify.on} color={theme.colors.primary} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>

        <Drawer.Section>
          <DrawerItem
            icon={({ color, size }) => <Icon name='account-cog-outline' color={color} size={size} />}
            label='All Preferences'
            onPress={() => props.navigation.navigate('Preferences')}
          />
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  )
}
