import { AuthEvents, AuthStore } from './auth/types'
import { BeersEvents, BeersStore } from './beers/types'
import { PreferencesEvents, PreferencesStore } from './preferences/types'
import { UsersEvents, UsersStore } from './users/types'

export interface State {
  auth: AuthStore,
  preferences: PreferencesStore,
  users: UsersStore,
  beers: BeersStore,
}

export type Events =
AuthEvents
& PreferencesEvents
& UsersEvents
& BeersEvents
