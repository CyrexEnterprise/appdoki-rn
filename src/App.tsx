import React from 'react'
import { GS_WEB_CLIENT_ID } from '@env'
import { GoogleSignin } from '@react-native-community/google-signin'
import { firebase as pfb } from '@react-native-firebase/perf'
import { firebase as afb } from '@react-native-firebase/analytics'
import { enableScreens } from 'react-native-screens'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StoreProvider } from 'store'
import { ThemeProvider } from 'components/ThemeProvider'
import { RootNavigator } from 'routes/RootNavigator'

GoogleSignin.configure({
  webClientId: GS_WEB_CLIENT_ID,
})

if (!__DEV__) {
  // we only want monitoring in production
  pfb.perf().setPerformanceCollectionEnabled(true)
  afb.analytics().setAnalyticsCollectionEnabled(true)
}

enableScreens()

export const App = () => {
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
