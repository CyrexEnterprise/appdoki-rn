import React from 'react'
import Animated from 'react-native-reanimated'
import { useTimingTransition } from 'react-native-redash/lib/module/v1'

import { ZoomProps } from './types'

export const Zoom: React.FC<ZoomProps> = ({ show, maxZoomOut = 0.01, delay = 0, style, ...rest }) => {
  const node = useTimingTransition(show ? 1 : maxZoomOut, { duration: 200, delay })

  return (
    <Animated.View style={[{ transform: [{ scale: node }] }, style]} {...rest} />
  )
}
