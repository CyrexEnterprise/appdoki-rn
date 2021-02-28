import { AppTheme } from 'constants/theme'
import React from 'react'
import { View } from 'react-native'
import { Paragraph, useTheme } from 'react-native-paper'
import styles from './styles'

export const NotificationsScreen: React.FC = () => {
  const theme = useTheme() as AppTheme
  return (
    <View style={styles.root}>
      <Paragraph>Notifications - <Paragraph style={{ color: theme.colors.amber }}>Coming Soon</Paragraph></Paragraph>
    </View>
  )
}
