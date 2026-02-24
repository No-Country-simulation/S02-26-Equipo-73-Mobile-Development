import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Typography } from '@/src/constants/theme';

type TypographyVariant = keyof typeof Typography;

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  children?: React.ReactNode;
}

/**
 * Componente Text con soporte para variantes de tipografía
 * 
 * Uso:
 * <Text variant="heading1">Título principal</Text>
 * <Text variant="bodyRegular">Texto normal</Text>
 */
export const Text: React.FC<TextProps> = ({ 
  variant = 'bodyRegular', 
  style, 
  children, 
  ...rest 
}) => {
  const typographyStyle = Typography[variant];

  return (
    <RNText
      style={[
        {
          fontFamily: typographyStyle.fontFamily,
          fontSize: typographyStyle.fontSize,
          lineHeight: typographyStyle.lineHeight,
          letterSpacing: typographyStyle.letterSpacing,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};
