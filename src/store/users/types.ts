import { User } from 'store/auth/types'
import { ErrorReason } from 'util/request'
import { USERS_EVENTS } from './events'

export interface UsersStore {
  loading: boolean,
  users: User[],
}

export type UsersEvents = {
  [USERS_EVENTS.LOAD]: undefined,
  [USERS_EVENTS.LOAD_SUCCESS]: User[],
  [USERS_EVENTS.LOAD_ERROR]: ErrorReason,
  [USERS_EVENTS.NEW_USER]: { user: User },
}
