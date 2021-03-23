import { AppRegistry, Linking, LogBox } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage'
import notifee, { EventType } from '@notifee/react-native'
import { ACTION_PRESS_IDS, CLOCKIFY_URL, MESSAGES_KEY } from 'constants/global'
import { name as appName } from './app.json'

// This should be called as soon as possible
messaging().setBackgroundMessageHandler(async (message) => {
  if (__DEV__) {
    console.log('Background Message received:', JSON.stringify(message, null, 2))
  }

  // Save messages in the device to be fired once we get out of background - see App.tsx
  try {
    const messages = await AsyncStorage.getItem(MESSAGES_KEY)

    if (messages == null) {
      await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify([message]))

      throw new Error(`Invalid ${MESSAGES_KEY} state after read called from setBackgroundMessageHandler`)
    }

    const parsed = JSON.parse(messages)

    if (Array.isArray(parsed)) {
      await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify([...parsed, message]))
    } else {
      await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify([message]))
    }
  } catch (error) {
    if (__DEV__) {
      console.log(error)
    }
  }
})

// handle to notification interactions
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail

  try {
    if (type === EventType.ACTION_PRESS && pressAction?.id) {
      if (pressAction.id === ACTION_PRESS_IDS.openClockify) {
        await Linking.openURL(CLOCKIFY_URL)
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.log('error trying to handle action', error)
    }
  } finally {
    if (type === EventType.ACTION_PRESS && pressAction?.id !== ACTION_PRESS_IDS.openClockify) {
      // close the notification
      await notifee.cancelNotification(notification.id)
    }
  }
})

function HeadlessCheck ({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null
  }

  require('react-native-gesture-handler')
  const React = require('react')
  const { App } = require('./src/App')

  if (__DEV__) {
    LogBox.ignoreLogs([
    // This warning occurs because we pass callbacks in some route navigations i.e. Dialog
    // and because fuctions are not serializable, just remember taht state persistance and deep-linking
    // features became unavailable for those screens
      'Non-serializable values were found in the navigation state',
    ])

    import('./src/util/reactotronConfig').then(() => console.log('Reactotron Configured'))
  }

  return <App />
}

AppRegistry.registerComponent(appName, () => HeadlessCheck)
