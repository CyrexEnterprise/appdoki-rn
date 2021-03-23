import React, { useCallback, useRef } from 'react'
import { View, Text } from 'react-native'
import { useTheme } from 'react-native-paper'
import { AppTheme } from 'constants/theme'

import { Picker } from './Picker'
import { getStaticDaysHours } from './helpers'
import styles from './styles'
import { TimePickerProps } from './types'

const separator = ':'

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const { colors } = useTheme() as AppTheme
  const staticDaysHours = getStaticDaysHours()
  const [days, hours, minutes] = useRef(staticDaysHours).current
  const SELECTED = useRef<string[]>(value.split(separator)).current

  const handleDateChange = useCallback((key: 0 | 1 | 2) => (value: any) => {
    SELECTED[key] = value

    onChange && onChange(SELECTED.join(separator))
  }, [SELECTED, onChange])

  return (
    <View style={styles.pickersContainer}>
      <Picker
        style={{ flex: 2 }}
        value={SELECTED[0]}
        data={days}
        onChange={handleDateChange(0)}
      />

      <Text style={{ color: colors.onSurface, paddingHorizontal: 6 }}>at</Text>

      <Picker
        value={SELECTED[1]}
        data={hours}
        onChange={handleDateChange(1)}
      />

      <Text style={{ color: colors.onSurface, paddingHorizontal: 8 }}>:</Text>

      <Picker
        value={SELECTED[2]}
        data={minutes}
        onChange={handleDateChange(2)}
      />
    </View>
  )
}
