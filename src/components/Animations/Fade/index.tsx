import * as React from 'react'
import Animated from 'react-native-reanimated'
import { useTimingTransition } from 'react-native-redash/lib/module/v1'

import { FadeProps } from './types'

export const Fade: React.FC<FadeProps> = ({ value, style, ...rest }) => {
  const opacity = useTimingTransition(value, { duration: 200 })

  return (
    <Animated.View
      style={[style, { opacity }]}
      pointerEvents={value > 0 ? 'auto' : 'none'}
      {...rest}
    />
  )
}
