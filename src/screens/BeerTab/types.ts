import { RouteProp } from '@react-navigation/native'
import { BottomNavigatorParamsList } from 'routes/BottomNavigator/types'
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs'

export interface BeerTabScreenProps {
  navigation: MaterialBottomTabNavigationProp<BottomNavigatorParamsList, 'BeerTab'>,
  route: RouteProp<BottomNavigatorParamsList, 'BeerTab'>,
}
