import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { StackHeaderProps, TransitionPresets } from '@react-navigation/stack'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { Appbar, Avatar, Title, useTheme } from 'react-native-paper'
import { useStoreon } from 'storeon/react'
import { Events, State } from 'store/types'
import LogoSrc from 'assets/logo.png'
import { BottomNavigator } from 'routes/BottomNavigator'
import { AppTitleContainer } from 'components/AppTitleContainer'
import { GiveBeerListScreen } from 'screens/GiveBeerList'
import { GiveBeerScreen } from 'screens/GiveBeer'

import styles from './styles'
import { MainNavigatorParamsList } from './types'

const Stack = createSharedElementStackNavigator<MainNavigatorParamsList>()

export const MainNavigator = () => {
  const theme = useTheme()
  const { auth } = useStoreon<State, Events>('auth')

  function renderHeader ({ scene, previous, navigation }: StackHeaderProps) {
    const picUrl = auth.user?.picture
    const { options } = scene.descriptor
    const title = options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
        ? options.title
        : scene.route.name

    return (
      <Appbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
        {previous ? (
          <Appbar.BackAction
            onPress={navigation.goBack}
            color={theme.colors.primary}
          />
        ) : (
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              ((navigation as any) as DrawerNavigationProp<any>).openDrawer()
            }}
          >
            {picUrl ? (
              <Avatar.Image size={40} source={{ uri: picUrl }} />
            ) : (
              <Avatar.Icon size={40} icon='guy-fawkes-mask' />
            )}
          </TouchableOpacity>
        )}

        <AppTitleContainer>
          {title === 'Feed' ? (
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={LogoSrc}
              />
            </View>
          ) : <Title>{title}</Title>}
        </AppTitleContainer>

        <View style={{ width: 46 }} />
      </Appbar.Header>
    )
  }

  return (
    <Stack.Navigator
      initialRouteName='Home'
      headerMode='screen'
      screenOptions={{ header: renderHeader }}
    >
      <Stack.Screen
        name='Home'
        component={BottomNavigator}
        options={({ route }: any) => {
          return { headerTitle: getFocusedRouteNameFromRoute(route) ?? 'Feed' }
        }}
      />

      <Stack.Screen
        name='GiveBeerList'
        component={GiveBeerListScreen}
        options={{
          headerTitle: 'Beer Giver',
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <Stack.Screen
        name='GiveBeer'
        component={GiveBeerScreen}
        options={{
          header: () => null,
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
        sharedElementsConfig={(route) => {
          const { id } = route.params
          return [`item.${id}.avatar`]
        }}
      />
    </Stack.Navigator>
  )
}
