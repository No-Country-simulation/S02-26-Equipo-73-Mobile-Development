/**
 * ThemedText Component
 * Un Text que automáticamente ajusta su color según el tema (light/dark)
 * y usa las variantes tipográficas de Syne
 * 
 * @example Uso básico
 * <ThemedText>Texto normal</ThemedText>
 * 
 * @example Con variantes tipográficas Syne
 * <ThemedText variant="heading1">Título principal</ThemedText>
 * <ThemedText variant="bodyRegular">Texto normal</ThemedText>
 * <ThemedText variant="subheading1">Subtítulo</ThemedText>
 * 
 * @example Con variantes legacy (mantiene compatibilidad)
 * <ThemedText type="title">Título antiguo</ThemedText>
 * <ThemedText type="subtitle">Subtítulo antiguo</ThemedText>
 * 
 * @example Con colores personalizados
 * <ThemedText lightColor="#000" darkColor="#fff" variant="heading2">
 *   Texto personalizado
 * </ThemedText>
 */

import { type TextProps } from 'react-native';
import { useThemeColor } from '@/src/hooks';
import { Text } from './Text';
import { Typography } from '@/src/constants/theme';

type TypographyVariant = keyof typeof Typography;

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  /** Variante tipográfica Syne (recomendado) */
  variant?: TypographyVariant;
  /** Tipo legacy para compatibilidad hacia atrás */
  type?: 'default' | 'title' | 'subtitle' | 'link' | 'defaultSemiBold';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  variant,
  type,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  // Si se usa variant, usamos el sistema tipográfico Syne
  if (variant) {
    return (
      <Text
        variant={variant}
        style={[{ color }, style]}
        {...rest}
      />
    );
  }

  // Mapeo de tipos legacy a variantes Syne
  const legacyTypeToVariant: Record<string, TypographyVariant> = {
    default: 'bodyRegular',
    defaultSemiBold: 'bodyRegular',
    title: 'heading2',
    subtitle: 'subheading1',
    link: 'bodyRegular',
  };

  const mappedVariant = legacyTypeToVariant[type || 'default'] || 'bodyRegular';
  const linkColor = type === 'link' ? '#007AFF' : color;

  return (
    <Text
      variant={mappedVariant}
      style={[
        { color: linkColor },
        type === 'defaultSemiBold' && { fontWeight: '600' },
        style,
      ]}
      {...rest}
    />
  );
}
