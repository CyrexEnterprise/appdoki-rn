import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    width: 168,
    height: 200,
    overflow: 'hidden',
    marginBottom: 32,
  },
  logo: {
    flex: 1,
    height: undefined,
    width: undefined,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
  gButton: {
    width: 192,
    height: 48,
  },
})
