import React from 'react'
import { createStoreon } from 'storeon'
import { StoreContext } from 'storeon/react'
import { Events, State } from './types'
import { auth } from './auth'
import { preferences } from './preferences'
import { users } from './users'
import { beers } from './beers'

export const store = createStoreon<State, Events>([
  auth,
  preferences,
  users,
  beers,
])

export const StoreProvider: React.FC = ({ children }) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}
