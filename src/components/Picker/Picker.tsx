import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Animated, { add, set, useCode, Value } from 'react-native-reanimated'
import { useValue, usePanGestureHandler } from 'react-native-redash/lib/module/v1'
import MaskedView from '@react-native-community/masked-view'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { useTheme } from 'react-native-paper'
import { AppTheme } from 'constants/theme'

import { getSelectedIndex, withDecay } from './helpers'
import styles, { ITEM_HEIGHT } from './styles'
import { PickerProps } from './types'

export const Picker: React.FC<PickerProps> = ({ value, data, style, onChange, ...rest }) => {
  const { colors } = useTheme() as AppTheme
  const { gestureHandler, translation, velocity, state } = usePanGestureHandler()
  const translateY = useValue(0)

  // position with decay effect
  const decayY = withDecay({
    state,
    value: translation.y,
    velocity: velocity.y,
    // snap to the nearest top
    snapPoints: new Array(data.length).fill(null).map((_, i) => i * -ITEM_HEIGHT),
    // initial position state
    offset: new Value(getSelectedIndex(data, value) * -ITEM_HEIGHT),
    // send value selected ofter decay animation ends
    finishedCallback: ([offset]: readonly number[]) => {
      const index = Math.abs(offset) / ITEM_HEIGHT
      onChange && onChange(data[index].value, data[index])
    },
  })

  // run animations
  useCode(() => [set(translateY, add(decayY, ITEM_HEIGHT * 2))], [])

  const maskElement = (
    <Animated.View style={{ transform: [{ translateY }] }}>
      {data.map((item) => {
        return (
          <Animated.View key={item.key} style={styles.item}>
            <Text style={[styles.label, { color: colors.onSurface }]}>{item.label}</Text>
          </Animated.View>
        )
      })}
    </Animated.View>
  )

  return (
    <View style={[styles.container, style]} {...rest}>
      <MaskedView {...{ maskElement }}>
        <View style={{ height: ITEM_HEIGHT * 2, backgroundColor: colors.disabled }} />
        <View style={{ height: ITEM_HEIGHT, backgroundColor: colors.onSurface }} />
        <View style={{ height: ITEM_HEIGHT * 2, backgroundColor: colors.disabled }} />
      </MaskedView>

      <View style={StyleSheet.absoluteFill}>
        <View
          style={{
            borderColor: colors.disabled,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            top: ITEM_HEIGHT * 2,
            height: ITEM_HEIGHT,
          }}
        />
      </View>

      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill} />
      </PanGestureHandler>
    </View>
  )
}
