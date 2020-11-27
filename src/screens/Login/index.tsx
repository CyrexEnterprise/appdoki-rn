import React from 'react'
import { Image, View } from 'react-native'
import RNBootSplash from 'react-native-bootsplash'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { GoogleSigninButton } from '@react-native-community/google-signin'
import { useStoreon } from 'storeon/react'
import { Events, State } from 'store/types'
import { AppTheme } from 'constants/theme'
import { LOGIN } from 'store/auth'
import LogoSrc from 'assets/logo.png'

import styles from './styles'

export const Login = () => {
  const { colors } = useTheme() as AppTheme
  const { dispatch, auth } = useStoreon<State, Events>('auth')

  // hide splash screen
  React.useEffect(() => {
    RNBootSplash.hide({ fade: true })
  }, [])

  return (
    <View style={[styles.root, { backgroundColor: colors.darkBlue }]}>
      <View style={{ position: 'relative' }}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={LogoSrc}
          />
        </View>

        <View style={styles.buttonConatiner}>
          {auth.loading ? (
            <ActivityIndicator animating size='large' />
          ) : auth.user ? null : (
            <GoogleSigninButton
              style={styles.gButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => dispatch(LOGIN)}
            />
          )}
        </View>
      </View>
    </View>
  )
}
