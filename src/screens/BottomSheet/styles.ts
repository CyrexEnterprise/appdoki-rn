import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  header: {
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  content: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
