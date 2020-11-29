
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { RootNavigatorParamsList } from 'routes/types'

export interface LoginScreenProps {
  navigation: StackNavigationProp<RootNavigatorParamsList, 'Login'>,
  route: RouteProp<RootNavigatorParamsList, 'Login'>,
}
