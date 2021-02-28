import AsyncStorage from '@react-native-async-storage/async-storage'
import { State } from './types'

// there is no problem to have the object empty but ts will complain here as it should
// @ts-ignore
const timers: Record<keyof State, NodeJS.Timeout> = {}

export function debounceStorage<K extends keyof State> (key: K, state: State[K]) {
  clearTimeout(timers[key])

  timers[key] = setTimeout(async () => {
    try {
      await AsyncStorage.setItem(`@${key}`, JSON.stringify(state))
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
    }
  }, 500)
}
