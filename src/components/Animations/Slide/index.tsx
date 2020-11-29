import * as React from 'react'
import { LayoutChangeEvent } from 'react-native'
import Animated, { Extrapolate, interpolate } from 'react-native-reanimated'
import { useTimingTransition } from 'react-native-redash/lib/module/v1'

import { SlideProps } from './types'

export const Slide: React.FC<SlideProps> = ({ style, initialOffset = 1000, inverted = false, show, ...rest }) => {
  const [height, setHeight] = React.useState(initialOffset)
  const value = useTimingTransition(show, { duration: 200 })

  const onLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setHeight(layout.height)
  }

  const slidetyles = {
    transform: [{
      translateY: interpolate(value, {
        inputRange: [0, 1],
        outputRange: [inverted ? height : -height, 0],
        extrapolate: Extrapolate.CLAMP,
      }),
    }],
  }

  return (
    <Animated.View
      style={[slidetyles, style]}
      onLayout={onLayout}
      {...rest}
    />
  )
}
