import { StyleSheet, Dimensions } from 'react-native'
import { theme } from 'constants/theme'

const { colors, roundness } = theme('light')

export default StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: Dimensions.get('window').width / 1.2,
    borderRadius: roundness,
    padding: 8,
  },
  cardActions: {
    flexDirection: 'row-reverse',
  },
})
