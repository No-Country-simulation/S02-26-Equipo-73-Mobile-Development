/**
 * ThemedView Component
 * Un View que automáticamente ajusta su backgroundColor según el tema (light/dark)
 * 
 * @example
 * <ThemedView style={{ flex: 1 }}>
 *   <Text>Contenido</Text>
 * </ThemedView>
 * 
 * @example Con colores personalizados
 * <ThemedView lightColor="#fff" darkColor="#000">
 *   <Text>Contenido</Text>
 * </ThemedView>
 */

import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/src/hooks';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
