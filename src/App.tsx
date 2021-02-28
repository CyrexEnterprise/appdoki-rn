import React, { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { GS_WEB_CLIENT_ID } from '@env'
// import { enableScreens } from 'react-native-screens'
import { GoogleSignin } from '@react-native-community/google-signin'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { firebase as pfb } from '@react-native-firebase/perf'
import { firebase as afb } from '@react-native-firebase/analytics'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { MESSAGES_KEY } from 'constants/global'
import { StoreProvider } from 'store'
import { onMessage } from 'store/auth/helpers'
import { ThemeProvider } from 'components/ThemeProvider'
import { RootNavigator } from 'routes/RootNavigator'

// TODO: this was disabled because of degraded performance - investigate asap
// enableScreens()

GoogleSignin.configure({
  webClientId: GS_WEB_CLIENT_ID,
})

if (!__DEV__) {
  // we only want monitoring in production
  pfb.perf().setPerformanceCollectionEnabled(true)
  afb.analytics().setAnalyticsCollectionEnabled(true)
}

export const App = () => {
  const appState = useRef(AppState.currentState)

  const handleAppStateChange = async (nextState: AppStateStatus) => {
    // fire all the messages that we stored when in background - see the root index.js
    if (appState.current.match(/inactive|background/) && nextState === 'active') {
      try {
        const messages = await AsyncStorage.getItem(MESSAGES_KEY)

        if (messages == null) {
          await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify([]))

          throw new Error(`Invalid ${MESSAGES_KEY} state after read`)
        }

        const parsed = JSON.parse(messages)

        if (Array.isArray(parsed)) {
          parsed.forEach((message: FirebaseMessagingTypes.RemoteMessage) => {
            onMessage(message)
          })

          if (parsed.length) {
            // Reset the messages stored
            await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify([]))
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.log(error)
        }
      }
    }

    appState.current = nextState
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </StoreProvider>
    </SafeAreaProvider>
  )
}
