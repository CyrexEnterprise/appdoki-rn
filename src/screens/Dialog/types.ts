
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { RootNavigatorParamsList } from 'routes/types'

export interface DialogScreenProps {
  navigation: StackNavigationProp<RootNavigatorParamsList, 'Dialog'>,
  route: RouteProp<RootNavigatorParamsList, 'Dialog'>,
}
