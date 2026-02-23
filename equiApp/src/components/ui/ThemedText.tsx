/**
 * ThemedText Component
 * Un Text que automáticamente ajusta su color según el tema (light/dark)
 * Incluye variantes de estilo predefinidas
 * 
 * @example
 * <ThemedText>Texto normal</ThemedText>
 * 
 * @example Con variantes
 * <ThemedText type="title">Título</ThemedText>
 * <ThemedText type="subtitle">Subtítulo</ThemedText>
 * <ThemedText type="link">Enlace</ThemedText>
 * 
 * @example Con colores personalizados
 * <ThemedText lightColor="#000" darkColor="#fff">
 *   Texto personalizado
 * </ThemedText>
 */

import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/src/hooks';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'link' | 'defaultSemiBold';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: '#007AFF',
  },
});
