/**
 * Pantalla de Horses (Caballos)
 * Placeholder para futura funcionalidad
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText } from '@/src';
import { Spacing } from '@/src/constants';

export default function HorsesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>← Volver</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          <ThemedText style={styles.icon}>🐴</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Mis Caballos
          </ThemedText>
          <ThemedText style={styles.message}>
            Esta funcionalidad estará disponible próximamente.
          </ThemedText>
          <ThemedText style={styles.description}>
            Aquí podrás gestionar la información de tus caballos, historial y cuidados.
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.5,
  },
});
