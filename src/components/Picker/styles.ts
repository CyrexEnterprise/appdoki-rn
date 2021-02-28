import { StyleSheet } from 'react-native'

export const ITEM_HEIGHT = 32

export default StyleSheet.create({
  container: {
    flex: 1,
    height: ITEM_HEIGHT * 5, //  show 5 items
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'System',
    fontSize: 20,
    lineHeight: ITEM_HEIGHT,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
})
