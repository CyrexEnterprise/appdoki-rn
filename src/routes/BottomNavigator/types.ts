import { RouteProp } from '@react-navigation/native'

export type BottomNavigatorProps = {
  route: RouteProp<BottomNavigatorParamsList, 'Feed'>,
}

export type BottomNavigatorParamsList = {
  Feed: undefined,
  Notifications: undefined,
  BeerTab: undefined,
}
