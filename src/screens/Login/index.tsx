import React from 'react'
import { Image, View } from 'react-native'
import RNBootSplash from 'react-native-bootsplash'
import { ActivityIndicator, Paragraph, useTheme } from 'react-native-paper'
import { GoogleSigninButton } from '@react-native-community/google-signin'
import remoteConfig from '@react-native-firebase/remote-config'
import semver from 'semver'
import { CONFIG_CACHE_RATE, remoteConfiguration } from 'constants/remoteConfig'
import { useStoreon } from 'storeon/react'
import { Events, State } from 'store/types'
import { AppTheme } from 'constants/theme'
import { AUTH_EVENTS } from 'store/auth/events'
import LogoSrc from 'assets/logo.png'
import appConfig from '../../../app.json'

import styles from './styles'
import { LoginScreenProps } from './types'

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { colors } = useTheme() as AppTheme
  const { dispatch, auth } = useStoreon<State, Events>('auth')

  // hide splash screen
  React.useEffect(() => {
    // Load remote configuration
    const bootstrapAsync = async () => {
      // Set defaults and fetch remote configuration
      await remoteConfig().setDefaults(remoteConfiguration)
      await remoteConfig().fetch(CONFIG_CACHE_RATE)
      const fetchedRemotely = await remoteConfig().fetchAndActivate()

      if (__DEV__) {
        console.log('Configs retrieved from the backend and activated:', fetchedRemotely)
      }
    }

    bootstrapAsync().finally(() => {
      RNBootSplash.hide({ fade: true })

      const latestVersion = remoteConfig().getValue('version').asString()
      const newVersionAvailable = semver.gt(latestVersion, appConfig.version)

      // Show a dialog to the user if we found that the user is not in a stable version
      if (newVersionAvailable) {
        navigation.navigate('Dialog', {
          title: 'Update version',
          confirmText: 'update',
          onConfirm: async () => {
            try {
              // await Linking.openURL(Platform.OS === 'ios' ? storeLinks.ios : storeLinks.android)
            } catch (error) {
              if (__DEV__) {
                console.log('error opening store link:', error.message)
              }
            }
          },
          renderContent: () => {
            return (
              <Paragraph>
                You are not in the last stable version of Appdoki.
                {' '}Please update the app to prevent unexpected behaviours.
              </Paragraph>
            )
          },
        })
      }
    })
  }, [navigation])

  return (
    <View style={[styles.root, { backgroundColor: colors.darkBlue }]}>
      <View style={{ position: 'relative' }}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={LogoSrc}
          />
        </View>

        <View style={styles.buttonContainer}>
          {auth.loading ? (
            <ActivityIndicator animating size='large' />
          ) : auth.user ? null : (
            <GoogleSigninButton
              style={styles.gButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => dispatch(AUTH_EVENTS.LOGIN)}
            />
          )}
        </View>
      </View>
    </View>
  )
}
