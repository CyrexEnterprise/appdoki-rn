import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { StoreonStore } from 'storeon'
import { store } from 'store'
import { State, Events } from 'store/types'
import { BEER_EVENTS } from 'store/beers/events'
import { USERS_EVENTS } from 'store/users/events'

export enum FCM_TOPICS {
  beers = 'beers',
  users = 'users'
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
    store.dispatch(BEER_EVENTS.NEW_LOG, {
      beer: {
        beers: Number(message.data.beers),
        givenAt: message.data.givenAt,
        giver: JSON.parse(message.data.giver),
        receiver: JSON.parse(message.data.receiver),
      },
    })
  }

  if (message.data?.hasOwnProperty('user')) {
    store.dispatch(USERS_EVENTS.NEW_USER, {
      user: JSON.parse(message.data.user),
    })
  }
}

export function onDeletedMessages (store: StoreonStore<State, Events>) {
  // request fresh new data
  store.dispatch(BEER_EVENTS.LOAD)
  store.dispatch(USERS_EVENTS.LOAD)
}

export async function subscribeToTopics () {
  await messaging().subscribeToTopic(FCM_TOPICS.beers)
  await messaging().subscribeToTopic(FCM_TOPICS.users)
}

export async function unsubscribeFromTopics () {
  await messaging().unsubscribeFromTopic(FCM_TOPICS.beers)
  await messaging().unsubscribeFromTopic(FCM_TOPICS.users)
}
