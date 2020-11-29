import { StoreonModule } from 'storeon'
import { API_URL } from '@env'
import { State, Events } from 'store/types'
import { AUTH_EVENTS } from 'store/auth/events'
import { request } from 'util/request'
import { Platform } from 'react-native'
import { USERS_EVENTS } from './events'

export const users: StoreonModule<State, Events> = (store) => {
  store.on('@init', () => {
    return {
      users: {
        loading: false,
        users: [],
      },
    }
  })

  // load the users after login
  store.on(AUTH_EVENTS.LOGIN_SUCCESS, ({ users }, { token }) => {
    if (!token) return

    store.dispatch(USERS_EVENTS.LOAD)

    return {
      users: {
        ...users,
        loading: true,
      },
    }
  })

  store.on(USERS_EVENTS.LOAD, async ({ auth }) => {
    try {
      const users = await request(`${API_URL}/users`, {
        headers: {
          platform: Platform.OS,
          Authorization: `Bearer ${auth.token}`,
        },
      })

      store.dispatch(USERS_EVENTS.LOAD_SUCCESS, users || [])
    } catch (error) {
      store.dispatch(USERS_EVENTS.LOAD_ERROR, error)
    }
  })

  store.on(USERS_EVENTS.LOAD_SUCCESS, ({ users }, data) => {
    return {
      users: {
        ...users,
        users: data,
        loading: false,
      },
    }
  })

  store.on(USERS_EVENTS.LOAD_ERROR, ({ users }, error) => {
    if (__DEV__) console.log(error)

    return {
      users: {
        ...users,
        loading: false,
      },
    }
  })

  // add a single user to the state
  store.on(USERS_EVENTS.NEW_USER, ({ users }, { user }) => {
    return {
      users: {
        ...users,
        users: [user].concat(users.users),
        loading: false,
      },
    }
  })
}
