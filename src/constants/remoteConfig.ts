import { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'
import appConfig from '../../app.json'

export interface RemoteConfiguration extends FirebaseRemoteConfigTypes.ConfigDefaults {
  version: string,
}

export const remoteConfiguration: RemoteConfiguration = {
  version: appConfig.version,
}

export const CONFIG_CACHE_RATE = __DEV__ ? 0 : 7200 // 2 hours
