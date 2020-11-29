import { PREFERENCES_EVENTS } from './events'

export type ThemeType = 'light' | 'dark'

export interface PreferencesStore {
  themeType: ThemeType,
}

export type PreferencesEvents = {
  [PREFERENCES_EVENTS.LOAD]: { themeType: ThemeType },
  [PREFERENCES_EVENTS.TOGGLE_THEME]: undefined,
}
