import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useStoreon } from 'storeon/react'
import { Events, State } from 'store/types'
import { LoginScreen } from 'screens/Login'
import { DialogScreen } from 'screens/Dialog'

import { DrawerNavigator } from './DrawerNavigator'
import { RootNavigatorParamsList } from './types'

const Stack = createStackNavigator<RootNavigatorParamsList>()

export const RootNavigator = () => {
  const { auth } = useStoreon<State, Events>('auth')

  return (
    <Stack.Navigator headerMode='none'>
      {auth.token == null ? (
        <Stack.Screen name='Login' component={LoginScreen} />
      ) : (
        <Stack.Screen name='Root' component={DrawerNavigator} />
      )}

      <Stack.Screen
        name='Dialog'
        component={DialogScreen}
        options={{
          animationEnabled: false,
          gestureEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
    </Stack.Navigator>
  )
}
