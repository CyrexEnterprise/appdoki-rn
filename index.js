import 'react-native-gesture-handler'
import React from 'react'
import messaging from '@react-native-firebase/messaging'
import { AppRegistry } from 'react-native'
import { App } from './src/App'
import { name as appName } from './app.json'
import { onMessage } from 'store/auth/helpers'

if (__DEV__) {
  import('./src/util/reactotronConfig').then(() => console.log('Reactotron Configured'))
}

messaging().setBackgroundMessageHandler(async (message) => {
  if (__DEV__) {
    console.log('Background Message received:', JSON.stringify(message, null, 2))
  }

  onMessage(message)
})

function HeadlessCheck ({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null
  }

  return <App />
}

AppRegistry.registerComponent(appName, () => HeadlessCheck)
