import { ReactText } from 'react'
import { ViewProps } from 'react-native'
import { State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

export interface PickerItem {
  key: string,
  label: ReactText,
  value: unknown,
}

export interface PickerProps extends ViewProps {
  data: PickerItem[],
  value: unknown,
  onChange?: (value: PickerItem['value'], item: PickerItem) => void,
}

export interface DatePickerProps {
  value: string,
  numbersVariant?: boolean,
  yearsRange?: number,
  onChange?: (date: string) => void,
}

export interface TimePickerProps {
  /** 18:00 or 09:00 */
  value: string,
  /** 18:00 or 09:00 */
  onChange?: (time: string) => void,
}

export interface WithDecayParams {
  value: Animated.Adaptable<number>,
  velocity: Animated.Adaptable<number>,
  state: Animated.Node<State>,
  offset: Animated.Value<number>,
  snapPoints: number[],
  finishedCallback: (args: readonly number[]) => void,
}
