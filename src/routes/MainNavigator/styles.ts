import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  logoContainer: {
    position: 'relative',
    width: 35,
    height: 40,
    overflow: 'hidden',
  },
  logo: {
    flex: 1,
    height: undefined,
    width: undefined,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
})
