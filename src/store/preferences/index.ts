import { AppState, Platform, StatusBar } from 'react-native'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StoreonModule } from 'storeon'
import { State, Events } from 'store/types'
import update from 'immutability-helper'
import { theme } from 'constants/theme'
import { WEEKDAY } from 'constants/global'
import { CLOCKIFY_REMINDER_PERIODICITY, PreferencesStore, ThemeType } from './types'
import { PREFERENCES_EVENTS } from './events'
import { debounceStorage } from 'store/debounceStorage'
import { upsertClockifyReminder } from './helpers/upsertClockifyReminder'

const STORAGE_KEY = '@preferences'

export const preferences: StoreonModule<State, Events> = (store) => {
  store.on('@init', async () => {
    const defaultState: PreferencesStore = {
      themeType: 'light',
      clockify: {
        on: false,
        periodicity: CLOCKIFY_REMINDER_PERIODICITY.weekly,
        weekDay: WEEKDAY.friday,
        time: '18:00',
      },
    }

    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)

      if (jsonValue == null) {
        throw new Error(`Invalid ${STORAGE_KEY} state after read`)
      }

      // hydrate default state
      // NOTE: we still need version management - this is just to prevent null pointers in `defaultState` changes
      store.dispatch(PREFERENCES_EVENTS.LOAD, update(defaultState, { $merge: JSON.parse(jsonValue) }))
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }

      // default state
      store.dispatch(PREFERENCES_EVENTS.LOAD, defaultState)
    }
  })

  store.on(PREFERENCES_EVENTS.LOAD, (_, preferences) => {
    updateStatusBar(preferences.themeType)

    return {
      preferences,
    }
  })

  store.on(PREFERENCES_EVENTS.TOGGLE_THEME, ({ preferences }) => {
    const themeType = preferences.themeType === 'dark' ? 'light' : 'dark'
    const newPreferences: PreferencesStore = update(preferences, { themeType: { $set: themeType } })

    debounceStorage('preferences', newPreferences)

    updateStatusBar(themeType)

    return {
      preferences: newPreferences,
    }
  })

  store.on(PREFERENCES_EVENTS.UPDATE_CLOCKIFY, ({ preferences }, updates) => {
    const newPreferences = update(preferences, { clockify: { $merge: updates } })

    debounceStorage('preferences', newPreferences)

    // schedule notification
    upsertClockifyReminder(newPreferences.clockify)
      .catch((error) => console.warn('Failed to to upsert Clockify Reminder:', error))

    return {
      preferences: newPreferences,
    }
  })
}

function updateStatusBar (themeType: ThemeType) {
  // if the app is not active this function call is useless and can cause problems
  if (AppState.currentState !== 'active') return

  const { colors } = theme(themeType)
  const isLightContent = themeType === 'dark'
  const color = colors.surface

  try {
    StatusBar.setBarStyle(isLightContent ? 'light-content' : 'dark-content', true)
  } catch (error) {
    if (__DEV__) {
      console.error(error)
    }
  }

  // Only possible on android
  if (Platform.OS === 'android') {
    try {
      StatusBar.setBackgroundColor(color, true)
      changeNavigationBarColor(color, !isLightContent, true)
    } catch (error) {
      if (__DEV__) {
        console.error(error)
      }
    }
  }
}
