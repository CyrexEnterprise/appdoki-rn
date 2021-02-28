import { WEEKDAY } from 'constants/global'

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * gets the date of the next week day requested
 * 0 to 6 or a value of `WEEKDAY`
 */
export function getNextDayOfWeek (day: WEEKDAY | number): Date {
  const dayOfWeek = typeof day === 'number' ? day : Math.max(weekdays.indexOf(day), 0)

  const date = new Date(Date.now())

  date.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7)

  return date
}
