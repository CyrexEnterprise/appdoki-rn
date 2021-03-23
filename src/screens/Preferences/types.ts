
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MainNavigatorParamsList } from 'routes/MainNavigator/types'

export interface PreferencesScreenProps {
  navigation: StackNavigationProp<MainNavigatorParamsList, 'Preferences'>,
  route: RouteProp<MainNavigatorParamsList, 'Preferences'>,
}
