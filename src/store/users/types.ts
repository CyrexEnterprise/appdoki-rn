import { User } from 'store/auth/types'
import { ErrorReason } from 'util/request'
import { LOAD_USERS, LOAD_USERS_ERROR, LOAD_USERS_SUCCESS } from '.'

export interface UsersStore {
  loading: boolean,
  users: User[],
}

export type UsersEvents = {
  [LOAD_USERS]: undefined,
  [LOAD_USERS_SUCCESS]: User[],
  [LOAD_USERS_ERROR]: ErrorReason,
}
