import { StoreonModule } from 'storeon'
import { State, Events } from 'store/types'
import { LOGIN_SUCCESS } from 'store/auth'
import { request } from 'util/request'
import { API_URL } from '@env'
import { Platform } from 'react-native'

export const LOAD_USERS = 'users/LOAD_USERS'
export const LOAD_USERS_SUCCESS = 'users/LOAD_USERS_SUCCESS'
export const LOAD_USERS_ERROR = 'users/LOAD_USERS_ERROR'
export const NEW_USER_EVENT = 'users/NEW_USER_EVENT'

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
  store.on(LOGIN_SUCCESS, ({ users }, { token }) => {
    if (!token) return

    store.dispatch(LOAD_USERS)

    return {
      users: {
        ...users,
        loading: true,
      },
    }
  })

  store.on(LOAD_USERS, async ({ auth }) => {
    try {
      const users = await request(`${API_URL}/users`, {
        headers: {
          platform: Platform.OS,
          Authorization: `Bearer ${auth.token}`,
        },
      })

      store.dispatch(LOAD_USERS_SUCCESS, users || [])
    } catch (error) {
      store.dispatch(LOAD_USERS_ERROR, error)
    }
  })

  store.on(LOAD_USERS_SUCCESS, ({ users }, data) => {
    return {
      users: {
        ...users,
        users: data,
        loading: false,
      },
    }
  })

  store.on(LOAD_USERS_ERROR, ({ users }, error) => {
    if (__DEV__) console.log(error)

    return {
      users: {
        ...users,
        loading: false,
      },
    }
  })

  // add a single user to the state
  store.on(NEW_USER_EVENT, ({ users }, { user }) => {
    return {
      users: {
        ...users,
        users: [user].concat(users.users),
        loading: false,
      },
    }
  })
}
