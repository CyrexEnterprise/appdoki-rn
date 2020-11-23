import { StoreonModule } from 'storeon'
import { State, Events } from 'store/types'
import { Platform } from 'react-native'
import { API_URL } from '@env'
import { GoogleSignin, statusCodes, User as GUser } from '@react-native-community/google-signin'
import { request } from 'util/request'

import { User } from './types'

export const AUTH_WORK = 'auth/AUTH_WORK'
export const LOGIN = 'auth/LOGIN'
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS'
export const LOGOUT = 'auth/LOGOUT'

export const auth: StoreonModule<State, Events> = (store) => {
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

    store.dispatch(LOGIN_SUCCESS, { token: gUser?.idToken || null, user })
  })

  store.on(AUTH_WORK, ({ auth }) => {
    return {
      auth: {
        ...auth,
        loading: true,
      },
    }
  })

  // get access token from google and user data from the api
  store.on(LOGIN, async () => {
    try {
      store.dispatch(AUTH_WORK)

      await GoogleSignin.hasPlayServices()
      const { idToken } = await GoogleSignin.signIn()

      const user = await request(`${API_URL}/auth/user`, {
        headers: {
          platform: Platform.OS,
          Authorization: `Bearer ${idToken}`,
        },
      })

      store.dispatch(LOGIN_SUCCESS, { token: idToken, user })
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
  store.on(LOGIN_SUCCESS, ({ auth }, { token, user }) => {
    store.dispatch(AUTH_WORK)

    return {
      auth: {
        ...auth,
        token,
        user,
        loading: false,
      },
    }
  })

  // Revoke token
  store.on(LOGOUT, async () => {
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
    } catch (error) {
      if (__DEV__) console.error(error)
    }
  })

  // Reset the state
  store.on(LOGOUT, () => {
    return {
      auth: {
        token: null,
        user: undefined,
        loading: false,
      },
    }
  })
}
