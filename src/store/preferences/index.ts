import { AppState, Platform, StatusBar } from 'react-native'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StoreonModule } from 'storeon'
import { State, Events } from 'store/types'
import { theme } from 'constants/theme'
import { PreferencesStore, ThemeType } from './types'
import { PREFERENCES_EVENTS } from './events'

const STORAGE_KEY = '@preferences'

export const preferences: StoreonModule<State, Events> = (store) => {
  store.on('@init', async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)

      if (jsonValue == null) {
        throw new Error(`Invalid ${STORAGE_KEY} state after read`)
      }

      store.dispatch(PREFERENCES_EVENTS.LOAD, JSON.parse(jsonValue))
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }

      store.dispatch(PREFERENCES_EVENTS.LOAD, { themeType: 'light' })
    }
  })

  store.on(PREFERENCES_EVENTS.LOAD, (_, preferences) => {
    updateSatusBar(preferences.themeType)

    return {
      preferences,
    }
  })

  store.on(PREFERENCES_EVENTS.TOGGLE_THEME, ({ preferences }) => {
    const themeType = preferences.themeType === 'dark' ? 'light' : 'dark'
    const newPreferences: PreferencesStore = { ...preferences, themeType }

    try {
      // TODO: add debounce
      // do not await this
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences))
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
    }

    updateSatusBar(themeType)

    return {
      preferences: newPreferences,
    }
  })
}

function updateSatusBar (themeType: ThemeType) {
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
