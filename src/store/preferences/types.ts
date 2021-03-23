import { WEEKDAY } from 'constants/global'
import { PREFERENCES_EVENTS } from './events'

export type ThemeType = 'light' | 'dark'

export enum CLOCKIFY_REMINDER_PERIODICITY {
  daily = 'DAILY',
  weekly = 'WEEKLY',
  // can't implement with notifee yet
  // monthly = 'MONTHLY',
}

export interface PreferencesStore {
  themeType: ThemeType,
  clockify: {
    on: boolean,
    periodicity: CLOCKIFY_REMINDER_PERIODICITY,
    weekDay: WEEKDAY,
    /** 09:00 or 18:30 */
    time: string,
  },
}

export type PreferencesEvents = {
  [PREFERENCES_EVENTS.LOAD]: PreferencesStore,
  [PREFERENCES_EVENTS.TOGGLE_THEME]: undefined,
  [PREFERENCES_EVENTS.UPDATE_CLOCKIFY]: Partial<PreferencesStore['clockify']>,
}
