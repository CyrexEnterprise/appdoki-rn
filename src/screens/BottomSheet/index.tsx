import React, { useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, BackHandler, Keyboard } from 'react-native'
import Animated, { Value } from 'react-native-reanimated'
import BottomSheet from 'reanimated-bottom-sheet'
import { useSafeArea } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from 'react-native-paper'
import { AppTheme } from 'constants/theme'

import styles from './styles'
import { BottomSheetScreenProps } from './types'

export const BottomSheetScreen: React.FC<BottomSheetScreenProps> = ({ navigation, route }) => {
  const { size = 300, middleSnapPoints = [], onClose, renderContent, renderHandle } = route.params
  const allPoints = [size, ...middleSnapPoints, 0]
  const safeArea = useSafeArea()
  const { colors } = useTheme() as AppTheme
  const snapPoints = useRef(
    allPoints.map(
      (point, index) => index === allPoints.length - 2 && typeof point === 'number' ? point + safeArea.bottom : point,
    ),
  )
  const bsRef = useRef<BottomSheet>(null)
  const overlayOpacity = useRef(new Value(1))

  // Animate on open
  useEffect(() => {
    if (bsRef.current) {
      bsRef.current.snapTo(snapPoints.current.length - 2)
    }
  }, [bsRef, snapPoints])

  // Animate on close - onCloseEnd will be called after
  const onOverlayPress = useCallback(() => {
    if (bsRef.current) {
      bsRef.current.snapTo(snapPoints.current.length - 1)
    }
  }, [bsRef, snapPoints])

  // pop position in the navigation stack so the screen behind become interactive
  const handleOnCloseEnd = useCallback(() => {
    onClose && onClose()
    navigation.goBack()
  }, [navigation, onClose])

  // Dismiss keyboard & handle back press on android
  useFocusEffect(
    useCallback(() => {
      Keyboard.dismiss()

      const onBackPress = () => {
        onOverlayPress()

        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [onOverlayPress]),
  )

  // header and handle on the top of the sheet
  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <View style={styles.panelHeader}>
        {renderHandle ? renderHandle() : <View style={styles.panelHandle} />}
      </View>
    </View>
  )

  // sheet dynamic content render
  const renderBSContent = () => (
    <View style={[styles.content, { paddingBottom: safeArea.bottom, backgroundColor: colors.surface }]}>
      {renderContent(onOverlayPress)}
    </View>
  )

  // sheet overlay animation
  const overlayStyles = {
    backgroundColor: '#000000',
    opacity: overlayOpacity.current.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={onOverlayPress}>
        <Animated.View
          style={[StyleSheet.absoluteFill, overlayStyles]}
        />
      </TouchableWithoutFeedback>

      <BottomSheet
        ref={bsRef}
        callbackNode={overlayOpacity.current}
        snapPoints={snapPoints.current}
        initialSnap={snapPoints.current.length - 1}
        renderContent={renderBSContent}
        renderHeader={renderHeader}
        onCloseEnd={handleOnCloseEnd}
        enabledContentGestureInteraction={false}
      />
    </View>
  )
}
