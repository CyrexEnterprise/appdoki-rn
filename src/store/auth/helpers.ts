import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { StoreonStore } from 'storeon'
import { State, Events } from 'store/types'
import { BEER_LOG_EVENT, LOAD_BEERS } from 'store/beers'
import { LOAD_USERS, NEW_USER_EVENT } from 'store/users'
import { store } from 'store'

export enum FCM_TOPICS {
  beers = 'beers'
}

export async function requestUserNotificationsPermission () {
  const authStatus = await messaging().requestPermission({ provisional: true })
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
}

export function onMessage (message: FirebaseMessagingTypes.RemoteMessage) {
  if (__DEV__) {
    console.log('Message received:', JSON.stringify(message, null, 2))
  }

  // FIXME: we should have a property in the data payload to distinguish the message event in the future
  if (message.data?.hasOwnProperty('beers')) {
    store.dispatch(BEER_LOG_EVENT, {
      beer: {
        beers: Number(message.data.beers),
        givenAt: message.data.givenAt,
        giver: JSON.parse(message.data.giver),
        receiver: JSON.parse(message.data.receiver),
      },
    })
  }

  if (message.data?.hasOwnProperty('user')) {
    store.dispatch(NEW_USER_EVENT, {
      user: JSON.parse(message.data.user),
    })
  }
}

export function onDeletedMessages (store: StoreonStore<State, Events>) {
  // request fresh new data
  store.dispatch(LOAD_BEERS)
  store.dispatch(LOAD_USERS)
}

export async function subscribeToTopics () {
  await messaging().subscribeToTopic(FCM_TOPICS.beers)
}

export async function unsubscribeFromTopics () {
  await messaging().unsubscribeFromTopic(FCM_TOPICS.beers)
}
