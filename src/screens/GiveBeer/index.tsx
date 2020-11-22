import React from 'react'
import { View } from 'react-native'
import { Avatar, Headline, Subheading, Surface, Text, useTheme } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SharedElement } from 'react-navigation-shared-element'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { AppTheme } from 'constants/theme'
import { useStoreon } from 'storeon/react'
import { Events, State } from 'store/types'
import { GIVE_BEERS } from 'store/beers'
import { Icon } from 'components/Icon'

import styles from './styles'
import { GiveBeerScreenProps } from './types'

export const GiveBeer: React.FC<GiveBeerScreenProps> = ({ route, navigation }) => {
  const timer = React.useRef<NodeJS.Timeout>()
  const completeTimer = React.useRef<NodeJS.Timeout>()
  const { colors } = useTheme() as AppTheme
  const { dispatch } = useStoreon<State, Events>()
  const [count, setCount] = React.useState(0)
  const [progress, setProgress] = React.useState(0)
  const [complete, setComplete] = React.useState(false)
  const user = route.params

  function handleBeerButtnoPress () {
    if (count < 24 && !complete) {
      setCount(count + 1)

      if (progress > 0) {
        setProgress(0)
      }

      clearTimeout(timer.current!)

      // FIXME: we need to check if the component is still mounted
      timer.current = setTimeout(() => {
        setProgress(100)
      }, 800)
    }
  }

  const handleOnComplete = React.useCallback(() => {
    setComplete(true)

    clearTimeout(completeTimer.current!)

    // FIXME: we need to check if the component is still mounted
    completeTimer.current = setTimeout(() => {
      dispatch(GIVE_BEERS, { id: user.id, amount: count })
      navigation.goBack()
    }, 800)
  }, [dispatch, user.id, count, navigation])

  return (
    <View style={styles.flex}>
      <SharedElement id={`item.${user.id}.avatar`}>
        {user.picture ? (
          <Avatar.Image size={150} source={{ uri: user.picture }} />
        ) : (
          <Avatar.Icon size={150} icon='guy-fawkes-mask' theme={{ colors: { primary: colors.accent } }} />
        )}
      </SharedElement>

      <Headline style={styles.userName}>{user.name}</Headline>

      <Text style={styles.beerNumber}>{count}</Text>
      <Subheading>Smash the beer button</Subheading>

      <TouchableOpacity onPress={handleBeerButtnoPress} disabled={complete}>
        <Surface style={[styles.beerButton, { backgroundColor: complete ? colors.accent : colors.amber }]}>
          <AnimatedCircularProgress
            size={150}
            width={15}
            fill={progress}
            tintColor={colors.accent}
            duration={1000}
          >
            {(value) => {
              if (value >= 100) {
                // FIXME: this is hacky - find another way
                handleOnComplete()
              }

              return (
                <Icon size={100} name={complete ? 'check' : 'glass-mug-variant'} color='white' />
              )
            }}
          </AnimatedCircularProgress>
        </Surface>
      </TouchableOpacity>
    </View>
  )
}
