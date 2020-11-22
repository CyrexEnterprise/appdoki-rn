import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerContent } from 'components/DrawerContent'
import { MainNavigator } from 'routes/MainNavigator'

const Drawer = createDrawerNavigator()

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name='Main' component={MainNavigator} />
    </Drawer.Navigator>
  )
}
