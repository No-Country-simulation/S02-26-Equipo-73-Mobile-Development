/**
 * Hook para obtener colores según el tema actual (light/dark)
 * Permite sobrescribir colores con props personalizados
 * 
 * @example
 * const backgroundColor = useThemeColor(
 *   { light: '#fff', dark: '#000' },
 *   'background'
 * );
 */

import { Colors } from '@/src/constants/theme';
import { useColorScheme } from './useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
