/**
 * ThemedActionSheet Component
 * Bottom sheet modal animado que se despliega desde abajo
 * Totalmente dinámico y reutilizable para cualquier contenido
 * 
 * @example Uso básico
 * <ThemedActionSheet 
 *   visible={showSheet} 
 *   onClose={() => setShowSheet(false)}
 *   title="Selecciona una fecha"
 * >
 *   <DateTimePicker />
 * </ThemedActionSheet>
 * 
 * @example Con altura personalizada
 * <ThemedActionSheet 
 *   visible={true} 
 *   onClose={handleClose}
 *   snapPoint="large"
 * >
 *   <YourCustomContent />
 * </ThemedActionSheet>
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/src/hooks';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { BorderRadius, Spacing } from '@/src/constants';
import AntDesignIcon from '@expo/vector-icons/AntDesign';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type SnapPoint = 'small' | 'medium' | 'large' | 'full';

const SNAP_POINTS: Record<SnapPoint, number> = {
  small: SCREEN_HEIGHT * 0.3,   // 30% de la pantalla
  medium: SCREEN_HEIGHT * 0.5,  // 50% de la pantalla
  large: SCREEN_HEIGHT * 0.75,  // 75% de la pantalla
  full: SCREEN_HEIGHT * 0.95,   // 95% de la pantalla
};

export interface ThemedActionSheetProps {
  /** Controla la visibilidad del ActionSheet */
  visible: boolean;
  /** Callback cuando se cierra el ActionSheet */
  onClose: () => void;
  /** Contenido del ActionSheet */
  children: React.ReactNode;
  /** Título opcional en el header */
  title?: string;
  /** Altura del sheet: 'small' (30%), 'medium' (50%), 'large' (75%), 'full' (95%) */
  snapPoint?: SnapPoint;
  /** Si se puede cerrar tocando el backdrop. Default: true */
  closeOnBackdropPress?: boolean;
  /** Si se muestra el botón de cerrar. Default: true */
  showCloseButton?: boolean;
  /** Si el contenido debe tener scroll. Default: false */
  scrollable?: boolean;
  /** Color personalizado del backdrop */
  backdropColor?: string;
  /** Opacidad del backdrop. Default: 0.5 */
  backdropOpacity?: number;
}

export function ThemedActionSheet({
  visible,
  onClose,
  children,
  title,
  snapPoint = 'medium',
  closeOnBackdropPress = true,
  showCloseButton = true,
  scrollable = false,
  backdropColor = '#000',
  backdropOpacity = 0.5,
}: ThemedActionSheetProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  
  // Animaciones
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const sheetHeight = SNAP_POINTS[snapPoint];

  useEffect(() => {
    if (visible) {
      // Animar entrada
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animar salida
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentWrapperProps = scrollable
    ? {
        showsVerticalScrollIndicator: false,
        bounces: false,
        contentContainerStyle: styles.scrollContent,
      }
    : { style: styles.content };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                backgroundColor: backdropColor,
                opacity: backdropAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, backdropOpacity],
                }),
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Sheet Container */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              height: sheetHeight + insets.bottom,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ThemedView
            style={[
              styles.sheet,
              {
                backgroundColor,
                borderColor,
                paddingBottom: insets.bottom || Spacing.md,
              },
            ]}
          >
            {/* Drag Handle */}
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: borderColor }]} />
            </View>

            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title ? (
                  <ThemedText type="defaultSemiBold" style={styles.title}>
                    {title}
                  </ThemedText>
                ) : (
                  <View style={styles.placeholder} />
                )}

                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <AntDesignIcon name="close" size={20} color={textColor} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Content */}
            <ContentWrapper {...contentWrapperProps}>
              {children}
            </ContentWrapper>
          </ThemedView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: BorderRadius.sm,
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    minHeight: 44,
  },
  title: {
    flex: 1,
    fontSize: 18,
  },
  placeholder: {
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
