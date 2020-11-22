import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MainNavigatorParamsList } from 'routes/MainNavigator/types'

export interface GiveBeerListScreenProps {
  navigation: StackNavigationProp<MainNavigatorParamsList, 'GiveBeerList'>,
  route: RouteProp<MainNavigatorParamsList, 'GiveBeerList'>,
}
