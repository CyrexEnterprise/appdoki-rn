import { StoreonModule } from 'storeon'
import { State, Events } from 'store/types'
import { LOGIN_SUCCESS } from 'store/auth'
import { request } from 'util/request'
import { API_URL } from '@env'
import { Platform } from 'react-native'

export const LOAD_BEERS = 'users/LOAD_BEERS'
export const LOAD_BEERS_SUCCESS = 'users/LOAD_BEERS_SUCCESS'
export const LOAD_BEERS_ERROR = 'users/LOAD_BEERS_ERROR'
export const GIVE_BEERS = 'users/GIVE_BEERS'
export const GIVE_BEERS_SUCCESS = 'users/GIVE_BEERS_SUCCESS'
export const GIVE_BEERS_ERROR = 'users/GIVE_BEERS_ERROR'

export const beers: StoreonModule<State, Events> = (store) => {
  store.on('@init', () => {
    return {
      beers: {
        loading: false,
        given: 0,
        received: 0,
        beerLog: [],
      },
    }
  })

  // load the beer data after login
  store.on(LOGIN_SUCCESS, ({ beers }, { token }) => {
    if (!token) return

    store.dispatch(LOAD_BEERS)

    return {
      beers: {
        ...beers,
        loading: true,
      },
    }
  })

  store.on(LOAD_BEERS, async ({ auth }) => {
    try {
      if (!auth.user) {
        throw new Error('user is missing')
      }

      const beerLog = await request(`${API_URL}/beers`, {
        headers: {
          platform: Platform.OS,
          Authorization: `Bearer ${auth.token}`,
        },
      })

      const { given, received } = await request(`${API_URL}/users/${auth.user.id}/beers`, {
        headers: {
          platform: Platform.OS,
          Authorization: `Bearer ${auth.token}`,
        },
      })

      store.dispatch(LOAD_BEERS_SUCCESS, {
        beerLog: beerLog || [],
        given: given || 0,
        received: received || 0,
      })
    } catch (error) {
      store.dispatch(LOAD_BEERS_ERROR, error)
    }
  })

  store.on(LOAD_BEERS_SUCCESS, ({ beers }, { beerLog, given, received }) => {
    return {
      beers: {
        ...beers,
        beerLog: beerLog,
        given,
        received,
        loading: false,
      },
    }
  })

  store.on(LOAD_BEERS_ERROR, ({ beers }, error) => {
    if (__DEV__) console.log(error)

    return {
      beers: {
        ...beers,
        loading: false,
      },
    }
  })

  store.on(GIVE_BEERS, async ({ auth }, { id, amount }) => {
    try {
      if (!auth.user) {
        throw new Error('user is missing')
      }

      await request(`${API_URL}/users/${id}/beers/${amount}`, {
        method: 'POST',
        headers: {
          platform: Platform.OS,
          Authorization: `Bearer ${auth.token}`,
        },
      })

      store.dispatch(GIVE_BEERS_SUCCESS, { amount })
    } catch (error) {
      store.dispatch(GIVE_BEERS_ERROR, error)
    }
  })

  store.on(GIVE_BEERS_SUCCESS, ({ beers }, { amount }) => {
    return {
      beers: {
        ...beers,
        given: beers.given + amount,
      },
    }
  })
}
