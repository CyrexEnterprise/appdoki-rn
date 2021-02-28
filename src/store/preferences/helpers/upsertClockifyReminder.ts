import notifee, { RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native'
import { ACTION_PRESS_IDS, ANDROID_CHANNELS, NOTIFICATION_IDS } from 'constants/global'
import { getNextDayOfWeek } from 'util/getNextDayOfWeek'
import { PreferencesStore, CLOCKIFY_REMINDER_PERIODICITY } from '../types'

export async function upsertClockifyReminder (config: PreferencesStore['clockify']) {
  if (!config.on) {
    return notifee.cancelNotification(NOTIFICATION_IDS.clockify)
  }

  const [hours, minutes] = config.time.split(':').map((t) => Number(t))
  const today = new Date(Date.now())
  const date = getNextDayOfWeek(config.weekDay)

  date.setHours(hours)
  date.setMinutes(minutes)

  // keep the notifications in the future
  if (date.getTime() <= today.getTime()) {
    date.setDate(date.getDate() + 7)
  }

  const channelId = await notifee.createChannel(ANDROID_CHANNELS.reminders)

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: mapPeriodicityToFrequency(config.periodicity),
  }

  await notifee.createTriggerNotification(
    {
      id: NOTIFICATION_IDS.clockify,
      title: 'Clockify Reminder',
      body: 'It\'s time to update your hours ⏳',
      android: {
        channelId,
        smallIcon: 'ic_small_icon',
        color: '#FF0396FE',
        actions: [
          {
            title: 'Open Clockify',
            pressAction: { id: ACTION_PRESS_IDS.openClockify },
          },
          {
            title: 'Dismiss',
            pressAction: { id: ACTION_PRESS_IDS.dismiss },
          },
        ],
      },
    },
    trigger,
  )
}

function mapPeriodicityToFrequency (periodicity: CLOCKIFY_REMINDER_PERIODICITY) {
  switch (periodicity) {
    case CLOCKIFY_REMINDER_PERIODICITY.daily: {
      return RepeatFrequency.DAILY
    }

    default:
      return RepeatFrequency.WEEKLY
  }
}
