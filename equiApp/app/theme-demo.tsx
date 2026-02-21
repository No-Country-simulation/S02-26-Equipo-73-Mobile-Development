/**
 * Pantalla de demostración del sistema de temas
 * Muestra todos los componentes themed y colores disponibles
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView, ThemedText } from '@/src/components/ui';
import { useColorScheme, useThemeColor } from '@/src/hooks';
import { Colors, Spacing, BorderRadius } from '@/src/constants';

export default function ThemeDemoScreen() {
  const colorScheme = useColorScheme();
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <ThemedText type="title">Sistema de Temas</ThemedText>
          <ThemedText style={styles.subtitle}>
            Tema actual: {colorScheme || 'light'}
          </ThemedText>

          {/* Text Variants */}
          <Section title="Variantes de Texto">
            <ThemedText type="title">Título</ThemedText>
            <ThemedText type="subtitle">Subtítulo</ThemedText>
            <ThemedText type="defaultSemiBold">Texto Semi-Bold</ThemedText>
            <ThemedText type="default">Texto Normal</ThemedText>
            <ThemedText type="link">Enlace</ThemedText>
          </Section>

          {/* Color Palette */}
          <Section title="Paleta de Colores">
            <ColorBox label="Primary" colorKey="primary" />
            <ColorBox label="Secondary" colorKey="secondary" />
            <ColorBox label="Success" colorKey="success" />
            <ColorBox label="Warning" colorKey="warning" />
            <ColorBox label="Error" colorKey="error" />
            <ColorBox label="Info" colorKey="info" />
          </Section>

          {/* Themed Cards */}
          <Section title="Tarjetas con Tema">
            <ThemedView
              lightColor="#f5f5f5"
              darkColor="#1c1c1e"
              style={[styles.card, { borderColor }]}
            >
              <ThemedText type="defaultSemiBold">Tarjeta Themed</ThemedText>
              <ThemedText style={styles.cardText}>
                Esta tarjeta cambia automáticamente con el tema del sistema
              </ThemedText>
            </ThemedView>

            <ThemedView
              style={[styles.card, { borderColor, backgroundColor: primaryColor }]}
            >
              <ThemedText lightColor="#fff" darkColor="#fff" type="defaultSemiBold">
                Tarjeta de Color Primario
              </ThemedText>
              <ThemedText lightColor="#fff" darkColor="#fff" style={styles.cardText}>
                Con texto blanco en ambos temas
              </ThemedText>
            </ThemedView>
          </Section>

          {/* Spacing Examples */}
          <Section title="Espaciado">
            <View style={styles.spacingRow}>
              <SpacingBox size="xs" />
              <SpacingBox size="sm" />
              <SpacingBox size="md" />
              <SpacingBox size="lg" />
              <SpacingBox size="xl" />
            </View>
          </Section>

          {/* Border Radius Examples */}
          <Section title="Border Radius">
            <View style={styles.spacingRow}>
              <RadiusBox radius="sm" />
              <RadiusBox radius="md" />
              <RadiusBox radius="lg" />
              <RadiusBox radius="xl" />
            </View>
          </Section>

          <ThemedText style={styles.footer}>
            💡 El tema cambia automáticamente con la configuración del sistema
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

// Componente de sección
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

// Componente para mostrar colores
function ColorBox({ label, colorKey }: { label: string; colorKey: keyof typeof Colors.light }) {
  const color = useThemeColor({}, colorKey);
  const borderColor = useThemeColor({}, 'border');
  
  return (
    <View style={[styles.colorBox, { borderColor }]}>
      <View style={[styles.colorSwatch, { backgroundColor: color }]} />
      <View style={styles.colorInfo}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <ThemedText style={styles.colorValue}>{color}</ThemedText>
      </View>
    </View>
  );
}

// Componente para mostrar espaciado
function SpacingBox({ size }: { size: keyof typeof Spacing }) {
  const backgroundColor = useThemeColor({}, 'primary');
  const value = Spacing[size];
  
  return (
    <View style={styles.spacingBoxContainer}>
      <View style={[styles.spacingBoxInner, { width: value * 2, height: value * 2, backgroundColor }]} />
      <ThemedText style={styles.spacingLabel}>{size}</ThemedText>
      <ThemedText style={styles.spacingValue}>{value}px</ThemedText>
    </View>
  );
}

// Componente para mostrar border radius
function RadiusBox({ radius }: { radius: keyof typeof BorderRadius }) {
  const backgroundColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const value = BorderRadius[radius];
  
  return (
    <View style={styles.radiusBoxContainer}>
      <View 
        style={[
          styles.radiusBoxInner, 
          { backgroundColor, borderRadius: value, borderColor, borderWidth: 2 }
        ]} 
      />
      <ThemedText style={styles.spacingLabel}>{radius}</ThemedText>
      <ThemedText style={styles.spacingValue}>{value}px</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  subtitle: {
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardText: {
    marginTop: Spacing.sm,
    opacity: 0.8,
  },
  colorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  colorInfo: {
    flex: 1,
  },
  colorValue: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  spacingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  spacingBoxContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  spacingBoxInner: {
    // width y height se establecen dinámicamente
  },
  spacingLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  spacingValue: {
    fontSize: 10,
    opacity: 0.7,
  },
  radiusBoxContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  radiusBoxInner: {
    width: 50,
    height: 50,
  },
  footer: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    opacity: 0.7,
  },
});
