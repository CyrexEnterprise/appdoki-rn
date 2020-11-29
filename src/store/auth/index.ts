import messaging from '@react-native-firebase/messaging'
import { StoreonModule } from 'storeon'
import { Platform } from 'react-native'
import { API_URL } from '@env'
import { GoogleSignin, statusCodes, User as GUser } from '@react-native-community/google-signin'
import { State, Events } from 'store/types'
import { request } from 'util/request'

import { AUTH_EVENTS } from './events'
import { onDeletedMessages, onMessage, requestUserNotificationsPermission, subscribeToTopics, unsubscribeFromTopics } from './helpers'
import { User } from './types'

export const auth: StoreonModule<State, Events> = (store) => {
  let unsubMessageListener = () => {}
  let unsubDeletedMessagesListener = () => {}

  store.on('@init', () => {
    return {
      auth: {
        loading: true,
        token: null,
      },
    }
  })

  // Get fresh user data
  store.on('@init', async () => {
    let gUser: GUser | null = null
    let user: User | undefined

    try {
      gUser = await GoogleSignin.signInSilently()

      if (gUser) {
        user = await request(`${API_URL}/auth/user`, {
          headers: {
            platform: Platform.OS,
            Authorization: `Bearer ${gUser.idToken}`,
          },
        })
      }
    } catch (error) {
      if (__DEV__) console.log(error)

      // we set gUser to false to clear the stale token
      if (error.status === 401) {
        gUser = null
        user = undefined
      }
    }

    store.dispatch(AUTH_EVENTS.LOGIN_SUCCESS, { token: gUser?.idToken || null, user })
  })

  store.on(AUTH_EVENTS.AUTH_WORK, ({ auth }) => {
    return {
      auth: {
        ...auth,
        loading: true,
      },
    }
  })

  // get access token from google and user data from the api
  store.on(AUTH_EVENTS.LOGIN, async () => {
    try {
      store.dispatch(AUTH_EVENTS.AUTH_WORK)

      await GoogleSignin.hasPlayServices()
      const { idToken } = await GoogleSignin.signIn()

      const user = await request(`${API_URL}/auth/user`, {
        headers: {
          platform: Platform.OS,
          Authorization: `Bearer ${idToken}`,
        },
      })

      store.dispatch(AUTH_EVENTS.LOGIN_SUCCESS, { token: idToken, user })
    } catch (error) {
      // TODO: treat this errors
      switch (error.code) {
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        case statusCodes.IN_PROGRESS:
        case statusCodes.SIGN_IN_CANCELLED: {
          console.log(error)
          break
        }

        default: {
          console.log(error)
          break
        }
      }
    }
  })

  // set the user and token
  store.on(AUTH_EVENTS.LOGIN_SUCCESS, ({ auth }, { token, user }) => {
    store.dispatch(AUTH_EVENTS.AUTH_WORK)

    return {
      auth: {
        ...auth,
        token,
        user,
        loading: false,
      },
    }
  })

  // ask for messaging permissions and subscribe to fcm messages and topics
  store.on(AUTH_EVENTS.LOGIN_SUCCESS, async () => {
    const enabled = await requestUserNotificationsPermission()

    if (enabled) {
      unsubMessageListener = messaging().onMessage((message) => {
        onMessage(message)
      })

      unsubDeletedMessagesListener = messaging().onDeletedMessages(() => onDeletedMessages(store))

      await subscribeToTopics()
    } else if (__DEV__) {
      console.log('[AUTH] notifications permissions not enabled')
    }
  })

  // Revoke token and unsubscribe from messages and topics
  store.on(AUTH_EVENTS.LOGOUT, async () => {
    try {
      unsubMessageListener()
      unsubDeletedMessagesListener()
      await unsubscribeFromTopics()

      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
    } catch (error) {
      if (__DEV__) console.error(error)
    }
  })

  // Reset the state
  store.on(AUTH_EVENTS.LOGOUT, () => {
    return {
      auth: {
        token: null,
        user: undefined,
        loading: false,
      },
    }
  })
}
