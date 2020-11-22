import React from 'react'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { IconProps } from './types'

export const Icon: React.FC<IconProps> = ({ size = 24, ...rest }) => (
  <MCIcon size={size} {...rest} />
)
