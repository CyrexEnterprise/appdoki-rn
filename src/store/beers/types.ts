import { ErrorReason } from 'util/request'
import { GIVE_BEERS, GIVE_BEERS_ERROR, GIVE_BEERS_SUCCESS, LOAD_BEERS, LOAD_BEERS_ERROR, LOAD_BEERS_SUCCESS } from '.'

export interface BeersStore {
  loading: boolean,
  given: number,
  received: number,
  beerLog: Beer[],
}

export type BeersEvents = {
  [LOAD_BEERS]: undefined,
  [LOAD_BEERS_SUCCESS]: { beerLog: Beer[]; given: number; received: number },
  [LOAD_BEERS_ERROR]: ErrorReason,
  [GIVE_BEERS]: { id: string; amount: number },
  [GIVE_BEERS_SUCCESS]: { amount: number },
  [GIVE_BEERS_ERROR]: ErrorReason,
}

export type Beer = {
  beers: 0,
  giver: {
    id: string,
    name: string,
    email: string,
    picture: string,
  },
  receiver: {
    id: string,
    name: string,
    email: string,
    picture: string,
  },
  givenAt: string,
}
