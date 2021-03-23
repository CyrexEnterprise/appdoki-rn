import { AndroidChannel, AndroidImportance } from '@notifee/react-native'

export const MESSAGES_KEY = '@messages'
export const CLOCKIFY_URL = 'https://clockify.me/timesheet'

export enum WEEKDAY {
  monday = 'Monday',
  tuesday = 'Tuesday',
  wednesday = 'Wednesday',
  thursday = 'Thursday',
  friday = 'Friday',
  saturday = 'Saturday',
  sunday = 'Sunday',
}

export enum NOTIFICATION_IDS {
  clockify = 'clockify'
}

export enum ACTION_PRESS_IDS {
  openClockify = 'open-clockify',
  dismiss = 'dismiss'
}

export const ANDROID_CHANNELS: Record<string, AndroidChannel> = {
  reminders: {
    id: 'reminders',
    name: 'Reminders Channel',
    importance: AndroidImportance.DEFAULT,
  },
}
