import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useStoreon } from 'storeon/react'
import { Events, State } from 'store/types'
import { LoginScreen } from 'screens/Login'

import { DrawerNavigator } from './DrawerNavigator'

const Stack = createStackNavigator()

export const RootNavigator = () => {
  const { auth } = useStoreon<State, Events>('auth')

  return (
    <Stack.Navigator headerMode='none'>
      {auth.token == null ? (
        <Stack.Screen name='Login' component={LoginScreen} />
      ) : (
        <Stack.Screen name='Root' component={DrawerNavigator} />
      )}
    </Stack.Navigator>
  )
}
