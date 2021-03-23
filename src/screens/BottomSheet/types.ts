
import { StackNavigationProp } from '@react-navigation/stack'
import { MainNavigatorParamsList } from 'routes/MainNavigator/types'
import { RouteProp } from '@react-navigation/native'

export interface BottomSheetScreenProps {
  navigation: StackNavigationProp<MainNavigatorParamsList, 'BottomSheet'>,
  route: RouteProp<MainNavigatorParamsList, 'BottomSheet'>,
}
