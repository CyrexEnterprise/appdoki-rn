import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper'
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme, Theme as NavigationTheme } from '@react-navigation/native'
import { Theme as PaperTheme } from 'react-native-paper/lib/typescript/src/types'

export type AppTheme = PaperTheme & NavigationTheme & {
  colors: {
    amber: string,
  },
}

export const theme = (type: 'light' | 'dark'): AppTheme => {
  const CombinedLightTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: { ...PaperDefaultTheme.colors, ...NavigationDefaultTheme.colors },
  }

  const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      ...NavigationDarkTheme.colors,
      background: '#1E1E1E',
      surface: '#333333ff',
    },
  }

  const theme = type === 'light' ? CombinedLightTheme : CombinedDarkTheme

  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#0096ffff',
      accent: '#1cba91',
      amber: '#FFA000',
    },
  }
}
