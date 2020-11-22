import { RouteProp } from '@react-navigation/native'
import { BottomNavigatorParamsList } from 'routes/BottomNavigator/types'
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs'

export interface FeedScreenProps {
  navigation: MaterialBottomTabNavigationProp<BottomNavigatorParamsList, 'Feed'>,
  route: RouteProp<BottomNavigatorParamsList, 'Feed'>,
}
