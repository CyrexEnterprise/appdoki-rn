import * as React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { BackHandler } from 'react-native'
import { Card, Button, Surface } from 'react-native-paper'
import { Fade, Slide } from 'components/Animations'

import styles from './styles'
import { DialogScreenProps } from './types'

export const DialogScreen: React.FC<DialogScreenProps> = ({ navigation, route }) => {
  const [show, setShow] = React.useState(false)

  const dismiss = React.useCallback(() => {
    const { onDismiss } = route.params
    setShow(false)

    setTimeout(() => {
      navigation.goBack()
      onDismiss && onDismiss()
    }, 300)
  }, [setShow, navigation, route])

  const confirm = React.useCallback(() => {
    const { onConfirm } = route.params
    setShow(false)

    setTimeout(() => {
      navigation.goBack()
      onConfirm && onConfirm()
    }, 300)
  }, [setShow, navigation, route])

  useFocusEffect(
    React.useCallback(() => {
      setShow(true)

      const onBackPress = () => {
        dismiss()

        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [dismiss]),
  )

  return (
    <Fade value={Number(show)} style={styles.root}>
      <Slide show={show}>
        <Surface style={styles.card}>
          <Card.Title title={route.params.title} />
          <Card.Content>
            {route.params.renderContent()}
          </Card.Content>

          <Card.Actions style={styles.cardActions}>
            <Button onPress={confirm}>{route.params.confirmText}</Button>
            {route.params.dismissText && <Button onPress={dismiss}>{route.params.dismissText}</Button>}
          </Card.Actions>
        </Surface>
      </Slide>
    </Fade>
  )
}
