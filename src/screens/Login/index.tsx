import React from 'react'
import { Image, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { GoogleSigninButton } from '@react-native-community/google-signin'
import { useStoreon } from 'storeon/react'
import { Events, State } from 'store/types'
import { LOGIN } from 'store/auth'
import LogoSrc from 'assets/logo.png'

import styles from './styles'

export const Login = () => {
  const { dispatch, auth } = useStoreon<State, Events>('auth')

  return (
    <View style={styles.root}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={LogoSrc}
        />
      </View>

      {auth.loading ? (
        <ActivityIndicator animating size='large' />
      ) : (
        <GoogleSigninButton
          style={styles.gButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => dispatch(LOGIN)}
        />
      )}
    </View>
  )
}
