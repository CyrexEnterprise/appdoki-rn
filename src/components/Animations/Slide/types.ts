import { ViewProps } from 'react-native'

export interface SlideProps extends ViewProps {
  /** show/hide */
  show: boolean,
  /** initial offset */
  initialOffset?: number,
  inverted: boolean,
}
