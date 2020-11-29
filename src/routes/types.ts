export type RootNavigatorParamsList = {
  Login: undefined,
  Root: undefined,
  Dialog: {
    title: string,
    confirmText: string,
    renderContent: () => React.ReactNode,
    dismissText?: string,
    onDismiss?: () => void,
    onConfirm?: () => void,
  },
}
