/**
 * Sistema de colores y tema para la aplicación
 * Soporta modo claro y oscuro
 */

const tintColorLight = '#1B365D';
const tintColorDark = '#2A4A7F';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#666',
    background: '#fff',
    backgroundSecondary: '#f5f5f5',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#e0e0e0',
    card: '#fff',
    primary: '#1B365D',
    secondary: '#8C6239',
    tertiary: '#2D523B',
    accent: '#B38F24',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    backgroundSecondary: '#1C1C1E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#2C2C2E',
    card: '#1C1C1E',
    primary: '#2A4A7F',
    secondary: '#A67A4E',
    tertiary: '#3D6B4F',
    accent: '#D4A92F',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',
  },
};

/**
 * Tipografía Syne - Sistema de fuentes personalizado
 * 
 * Uso:
 * - regular: Texto normal (400)
 * - medium: Texto con énfasis medio (500)
 * - semiBold: Texto con énfasis (600)
 * - bold: Títulos y texto destacado (700)
 * - extraBold: Títulos principales (800)
 */
export const Fonts = {
  regular: 'Syne-Regular',
  medium: 'Syne-Medium',
  semiBold: 'Syne-SemiBold',
  bold: 'Syne-Bold',
  extraBold: 'Syne-ExtraBold',
};

/**
 * Sistema de tipografía - Typescale
 * Cada estilo incluye familia, tamaño, lineHeight y letterSpacing
 */
export const Typography = {
  display: {
    fontFamily: 'Syne-SemiBold',
    fontSize: 72,
    lineHeight: 80,
    letterSpacing: -1.296, // -1.8%
  },
  heading1: {
    fontFamily: 'Syne-SemiBold',
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.72, // -1.5%
  },
  heading2: {
    fontFamily: 'Syne-SemiBold',
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.6, // -1.5%
  },
  heading3: {
    fontFamily: 'Syne-SemiBold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.384, // -1.2%
  },
  subheading1: {
    fontFamily: 'Syne-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.288, // -1.2%
  },
  subheading2: {
    fontFamily: 'Syne-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.3, // -1.5%
  },
  buttonRegular: {
    fontFamily: 'Syne-SemiBold',
    fontSize: 17,
    lineHeight: 56,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'Syne-Regular',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontFamily: 'Syne-Regular',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyRegular: {
    fontFamily: 'Syne-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: 'Syne-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodyTiny: {
    fontFamily: 'Syne-Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
