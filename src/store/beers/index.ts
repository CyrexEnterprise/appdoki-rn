import { StoreonModule } from 'storeon'
import { State, Events } from 'store/types'
import { AUTH_EVENTS } from 'store/auth/events'
import { request } from 'util/request'
import { API_URL } from '@env'
import { Platform } from 'react-native'
import { BEER_EVENTS } from './events'

const PAGINATION_LIMIT = 50

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
  store.on(AUTH_EVENTS.LOGIN_SUCCESS, (_, { token }) => {
    if (!token) return

    store.dispatch(BEER_EVENTS.LOAD)
  })

  store.on(BEER_EVENTS.LOAD, ({ beers }) => {
    return {
      beers: {
        ...beers,
        loading: true,
      },
    }
  })

  store.on(BEER_EVENTS.LOAD, async ({ auth }) => {
    try {
      if (!auth.user) {
        throw new Error('user is missing')
      }

      const todayISO = (new Date()).toISOString()

      const beerLog = await request(`${API_URL}/beers?limit=${PAGINATION_LIMIT}&op=lt&givenAt=${todayISO}`, {
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

      store.dispatch(BEER_EVENTS.LOAD_SUCCESS, {
        beerLog: beerLog || [],
        given: given || 0,
        received: received || 0,
      })
    } catch (error) {
      store.dispatch(BEER_EVENTS.LOAD_ERROR, error)
    }
  })

  store.on(BEER_EVENTS.LOAD_SUCCESS, ({ beers }, { beerLog, given, received }) => {
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

  store.on(BEER_EVENTS.LOAD_ERROR, ({ beers }, error) => {
    if (__DEV__) console.log(error)

    return {
      beers: {
        ...beers,
        loading: false,
      },
    }
  })

  store.on(BEER_EVENTS.LOAD_MORE, ({ beers }) => {
    return {
      beers: {
        ...beers,
        loading: true,
      },
    }
  })

  store.on(BEER_EVENTS.LOAD_MORE, async ({ auth, beers }) => {
    try {
      if (!auth.user) {
        throw new Error('user is missing')
      }

      if (!beers.beerLog.length) {
        throw new Error('beer log is empty can\'t load more')
      }

      const lastGivenAt = beers.beerLog[beers.beerLog.length - 1].givenAt

      const beerLog = await request(`${API_URL}/beers?limit=${PAGINATION_LIMIT}&op=lt&givenAt=${lastGivenAt}`, {
        headers: {
          platform: Platform.OS,
          Authorization: `Bearer ${auth.token}`,
        },
      })

      store.dispatch(BEER_EVENTS.LOAD_MORE_SUCCESS, {
        beers: beerLog || [],
      })
    } catch (error) {
      store.dispatch(BEER_EVENTS.LOAD_MORE_ERROR, error)
    }
  })

  store.on(BEER_EVENTS.LOAD_MORE_SUCCESS, ({ beers }, data) => {
    return {
      beers: {
        ...beers,
        beerLog: [...beers.beerLog, ...data.beers],
        loading: false,
      },
    }
  })

  store.on(BEER_EVENTS.LOAD_ERROR, ({ beers }, error) => {
    if (__DEV__) console.log(error)

    return {
      beers: {
        ...beers,
        loading: false,
      },
    }
  })

  store.on(BEER_EVENTS.GIVE, async ({ auth }, { id, amount }) => {
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

      store.dispatch(BEER_EVENTS.GIVE_SUCCESS, { amount })
    } catch (error) {
      store.dispatch(BEER_EVENTS.GIVE_ERROR, error)
    }
  })

  store.on(BEER_EVENTS.GIVE_SUCCESS, ({ beers }, { amount }) => {
    return {
      beers: {
        ...beers,
        given: beers.given + amount,
      },
    }
  })

  // add a single log to the state
  store.on(BEER_EVENTS.NEW_LOG, ({ beers, auth }, { beer }) => {
    const topLog = beers.beerLog[0]
    let newLog = [beer].concat(beers.beerLog)

    // sort the log in case the beer received is older than the last log we have
    if (topLog && topLog.givenAt > beer.givenAt) {
      newLog = newLog.sort((a, b) => a.givenAt < b.givenAt ? 1 : -1)
    }

    return {
      beers: {
        ...beers,
        beerLog: newLog,
        received: beer.receiver.id === auth.user?.id ? beers.received + beer.beers : beers.received,
      },
    }
  })
}
