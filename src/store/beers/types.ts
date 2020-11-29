import { ErrorReason } from 'util/request'
import { BEER_EVENTS } from './events'

export interface BeersStore {
  loading: boolean,
  given: number,
  received: number,
  beerLog: Beer[],
}

export type BeersEvents = {
  [BEER_EVENTS.LOAD]: undefined,
  [BEER_EVENTS.LOAD_SUCCESS]: { beerLog: Beer[]; given: number; received: number },
  [BEER_EVENTS.LOAD_ERROR]: ErrorReason,
  [BEER_EVENTS.GIVE]: { id: string; amount: number },
  [BEER_EVENTS.GIVE_SUCCESS]: { amount: number },
  [BEER_EVENTS.GIVE_ERROR]: ErrorReason,
  [BEER_EVENTS.NEW_LOG]: { beer: Beer },
}

export type Beer = {
  beers: number,
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
