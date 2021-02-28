import { Clock, Value, add, block, cond, eq, set, startClock, and, not, clockRunning, timing, Easing, stopClock, call } from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'
import { snapPoint } from 'react-native-redash/lib/module/v1'
import { WEEKDAY } from 'constants/global'
import { PickerItem, PickerProps, WithDecayParams } from './types'

/** adds a leading zero for numbers under 10 */
function prefixZero (value: number) {
  if (value > 9) {
    return value + ''
  } else {
    return '0' + value
  }
}

/** returns the selected value index in items */
export function getSelectedIndex (items: PickerProps['data'], selectedValue: PickerProps['value']) {
  let index = 0

  const len = items.length
  let i = 0
  for (; i < len; i++) {
    const item = items[i]

    if (item.value === selectedValue) {
      index = i
    }
  }

  return index
}

const weekDays: PickerItem[] = [
  { key: 'week-monday', label: WEEKDAY.monday, value: WEEKDAY.monday },
  { key: 'week-tuesday', label: WEEKDAY.tuesday, value: WEEKDAY.tuesday },
  { key: 'week-wednesday', label: WEEKDAY.wednesday, value: WEEKDAY.wednesday },
  { key: 'week-thursday', label: WEEKDAY.thursday, value: WEEKDAY.thursday },
  { key: 'week-friday', label: WEEKDAY.friday, value: WEEKDAY.friday },
  { key: 'week-saturday', label: WEEKDAY.saturday, value: WEEKDAY.saturday },
  { key: 'week-sunday', label: WEEKDAY.sunday, value: WEEKDAY.sunday },
]
const staticHours: PickerItem[] = Array(24).fill(null).map((_, i) => {
  const value = prefixZero(i)

  return { key: `hours-${value}`, label: value, value }
})
const staticMinutes: PickerItem[] = Array(60).fill(null).map((_, i) => {
  const value = prefixZero(i)

  return { key: `minutes-${value}`, label: value, value }
})

export const getStaticDaysHours = () => {
  return [weekDays, staticHours, staticMinutes]
}

export const withDecay = (params: WithDecayParams) => {
  const { value, velocity, state: gestureState, offset, snapPoints, finishedCallback } = {
    ...params,
  }
  const init = new Value(0)
  const clock = new Clock()
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  }
  const config = {
    toValue: new Value(0),
    duration: new Value(1000),
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  }
  return block([
    cond(not(init), [set(state.position, offset), set(init, 1)]),
    cond(eq(gestureState, State.BEGAN), set(offset, state.position)),
    cond(eq(gestureState, State.ACTIVE), [
      set(state.position, add(offset, value)),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(state.finished, 0),
      set(config.toValue, snapPoint(state.position, velocity, snapPoints)),
    ]),
    cond(and(not(state.finished), eq(gestureState, State.END)), [
      cond(not(clockRunning(clock)), [startClock(clock)]),
      timing(clock, state, config),
      cond(state.finished, [
        stopClock(clock),
        call([state.position], finishedCallback),
      ]),
    ]),
    state.position,
  ])
}
