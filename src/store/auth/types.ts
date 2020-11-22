import { AUTH_WORK, LOGIN, LOGIN_SUCCESS, LOGOUT } from '.'

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
  [AUTH_WORK]: undefined,
  [LOGIN]: undefined,
  [LOGIN_SUCCESS]: { token: string | null; user?: User },
  [LOGOUT]: undefined,
}
