import React, { useCallback } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useTheme, Divider, List, Subheading, Switch } from 'react-native-paper'
import { useStoreon } from 'storeon/react'
import { WEEKDAY } from 'constants/global'
import { Events, State } from 'store/types'
import { PREFERENCES_EVENTS } from 'store/preferences/events'
import { CLOCKIFY_REMINDER_PERIODICITY } from 'store/preferences/types'
import { Icon } from 'components/Icon'
import { TimePicker, Picker } from 'components/Picker'
import { PickerItem } from 'components/Picker/types'

import styles from './styles'
import { PreferencesScreenProps } from './types'

const periodicityData: PickerItem[] = Object.values(CLOCKIFY_REMINDER_PERIODICITY)
  .map((item) => ({ key: item, value: item, label: item }))

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const { dispatch, preferences } = useStoreon<State, Events>('preferences')

  const openPeriodicityPicker = useCallback(() => {
    navigation.navigate('BottomSheet', {
      size: 230,
      renderContent: () => (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 100 }}>
          <Picker
            data={periodicityData}
            value={preferences.clockify.periodicity}
            onChange={(value) =>
              dispatch(PREFERENCES_EVENTS.UPDATE_CLOCKIFY, { periodicity: value as CLOCKIFY_REMINDER_PERIODICITY })}
          />
        </View>
      ),
    })
  }, [navigation, dispatch, preferences.clockify.periodicity])

  const openDayPicker = useCallback(() => {
    navigation.navigate('BottomSheet', {
      size: 250,
      renderContent: () => {
        const { weekDay, time } = preferences.clockify
        const day = `${weekDay}:${time}`

        return (
          <TimePicker
            value={day}
            onChange={(value) => {
              const [day, hours, minutes] = value.split(':')

              dispatch(PREFERENCES_EVENTS.UPDATE_CLOCKIFY, { weekDay: day as WEEKDAY, time: `${hours}:${minutes}` })
            }}
          />
        )
      },
    })
  }, [navigation, dispatch, preferences.clockify])

  function getDayHourDesc () {
    const { periodicity, weekDay, time } = preferences.clockify

    if (periodicity === CLOCKIFY_REMINDER_PERIODICITY.daily) {
      return `at ${time}`
    }

    return `${weekDay} at ${time}`
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: theme.colors.surface }]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.section}>
        <List.Item
          style={{ marginTop: 12 }}
          title='Dark Theme'
          left={(props) => <Icon {...props} style={[props.style, styles.icon]} name='palette-outline' />}
          right={(props) => (
            <View pointerEvents='none'>
              <Switch {...props} value={preferences.themeType === 'dark'} color={theme.colors.primary} />
            </View>
          )}
          onPress={() => dispatch(PREFERENCES_EVENTS.TOGGLE_THEME)}
        />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Subheading style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          CLOCKIFY REMINDER
        </Subheading>

        <List.Item
          title='Notifications'
          description='Toggle reminder on/off'
          left={(props) => <Icon {...props} style={[props.style, styles.icon]} name='bell-outline' />}
          right={(props) => (
            <Switch
              {...props}
              style={[props.style, styles.icon]}
              value={preferences.clockify.on}
              color={theme.colors.primary}
            />
          )}
          onPress={() => dispatch(PREFERENCES_EVENTS.UPDATE_CLOCKIFY, { on: !preferences.clockify.on })}
        />

        <List.Item
          title='Periodicity'
          description={preferences.clockify.periodicity}
          left={(props) => <Icon {...props} style={[props.style, styles.icon]} name='calendar-clock' />}
          onPress={openPeriodicityPicker}
        />

        <List.Item
          title='Day and Hour'
          description={getDayHourDesc()}
          left={(props) => <Icon {...props} style={[props.style, styles.icon]} name='clock-outline' />}
          onPress={openDayPicker}
        />
      </View>
    </ScrollView>
  )
}
