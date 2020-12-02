import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedItem: {
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 24,
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    marginHorizontal: 16,
  },
  endOfList: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  lottieViewTop: {
    height: 90,
    alignSelf: 'center',
  },
  lottieViewBottom: {
    height: 50,
  },
})
