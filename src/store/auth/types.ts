import { AUTH_EVENTS } from './events'

export interface AuthStore {
  loading: boolean,
  token: string | null,
  user?: User,
}

export type User = {
  id: string,
  name: string,
  email: string,
  picture: string,
}

export type AuthEvents = {
  [AUTH_EVENTS.AUTH_WORK]: undefined,
  [AUTH_EVENTS.LOGIN]: undefined,
  [AUTH_EVENTS.LOGIN_SUCCESS]: { token: string | null; user?: User },
  [AUTH_EVENTS.LOGOUT]: undefined,
}
