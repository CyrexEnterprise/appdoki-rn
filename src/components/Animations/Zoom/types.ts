import { ViewProps } from 'react-native'

export interface ZoomProps extends ViewProps {
  /** show/hide */
  show: boolean,
  /** max zoom out value */
  maxZoomOut?: number,
  /** animation delay */
  delay?: number,
}
