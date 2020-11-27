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
  },
  logo: {
    flex: 1,
    height: undefined,
    width: undefined,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -80,
    alignItems: 'center',
  },
  gButton: {
    width: 192,
    height: 48,
  },
})
