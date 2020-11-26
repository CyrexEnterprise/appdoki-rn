import React from 'react'
import { View, ViewProps } from 'react-native'

export const AppTitleContainer: React.FC<ViewProps> = ({ style, ...rest }) => {
  return <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, style]} {...rest} />
}
