import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { useStoreon } from 'storeon/react'
import { Events, State } from 'store/types'
import { theme } from 'constants/theme'

export const ThemeProvider: React.FC = ({ children }) => {
  const { preferences } = useStoreon<State, Events>('preferences')

  return (
    <PaperProvider theme={theme(preferences.themeType)}>
      <NavigationContainer theme={theme(preferences.themeType)}>
        {children}
      </NavigationContainer>
    </PaperProvider>
  )
}
