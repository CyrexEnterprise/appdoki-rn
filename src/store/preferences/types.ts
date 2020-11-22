import { LOAD_PREFERENCES, TOGGLE_THEME } from '.'

export type ThemeType = 'light' | 'dark'

export interface PreferencesStore {
  themeType: ThemeType,
}

export type PreferencesEvents = {
  [LOAD_PREFERENCES]: { themeType: ThemeType },
  [TOGGLE_THEME]: undefined,
}
