import { User } from 'store/auth/types'

export type MainNavigatorParamsList = {
  Home: undefined,
  GiveBeerList: undefined,
  GiveBeer: User,
  BottomSheet: {
    size?: React.ReactText,
    middleSnapPoints?: React.ReactText[],
    onClose?: () => void,
    renderContent: (close: () => void) => React.ReactNode,
    renderHandle?: () => React.ReactNode,
  },
}
