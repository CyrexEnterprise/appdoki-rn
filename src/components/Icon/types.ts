import { IconProps as RNIconProps } from 'react-native-vector-icons/Icon'

export interface IconProps extends RNIconProps {
  /**
   * Size of the icon, can also be passed as fontSize in the style object.
   *
   * @default 24
   */
  size?: number,
}
