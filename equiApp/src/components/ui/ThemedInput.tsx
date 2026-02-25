import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor, useColorScheme } from '@/src/hooks';
import { Colors, Spacing, BorderRadius } from '@/src/constants';
import { ThemedText } from './ThemedText';

export interface ThemedInputProps extends TextInputProps {
  /** Icono a mostrar al inicio del input */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Icono a mostrar al final del input */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  /** Callback cuando se presiona el icono derecho */
  onRightIconPress?: () => void;
  /** Mensaje de error a mostrar debajo del input */
  error?: string;
  /** Color personalizado para el borde en modo light */
  lightBorderColor?: string;
  /** Color personalizado para el borde en modo dark */
  darkBorderColor?: string;
  /** Color personalizado para el fondo en modo light */
  lightBackgroundColor?: string;
  /** Color personalizado para el fondo en modo dark */
  darkBackgroundColor?: string;
}

export function ThemedInput({
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  lightBorderColor,
  darkBorderColor,
  lightBackgroundColor,
  darkBackgroundColor,
  style,
  ...textInputProps
}: ThemedInputProps) {
  const colorScheme = useColorScheme();

  const iconColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const backgroundColor = useThemeColor(
    {
      light: lightBackgroundColor || Colors.light.backgroundSecondary,
      dark: darkBackgroundColor || Colors.dark.backgroundSecondary
    },
    'backgroundSecondary'
  );

  const borderColor = useThemeColor(
    {
      light: lightBorderColor || Colors.light.border,
      dark: darkBorderColor || Colors.dark.border
    },
    'border'
  );

  const errorBorderColor = error ? Colors.light.error : borderColor;

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputWrapper,
        {
          backgroundColor,
          borderColor: errorBorderColor
        }
      ]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={iconColor}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            { color: textColor },
            style,
          ]}
          placeholderTextColor={iconColor}
          {...textInputProps}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <ThemedText
          variant="bodyTiny"
          style={styles.errorText}
          lightColor={Colors.light.error}
          darkColor={Colors.dark.error}
        >
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
  },
  errorText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});
