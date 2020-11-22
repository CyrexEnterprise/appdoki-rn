import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MainNavigatorParamsList } from 'routes/MainNavigator/types'

export interface GiveBeerScreenProps {
  navigation: StackNavigationProp<MainNavigatorParamsList, 'GiveBeer'>,
  route: RouteProp<MainNavigatorParamsList, 'GiveBeer'>,
}
