import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { useOnboarding } from '@/src/hooks/useOnboarding';
import { ThemedView } from '@/src';

/**
 * Pantalla inicial de la app
 * Redirige según el estado de autenticación y onboarding
 */
export default function Index() {
  const { isInitialized, isLoading } = useAuth();
  const { hasSeenOnboarding, isLoading: isOnboardingLoading } = useOnboarding();

  // Mostrar loading mientras se inicializa
  if (!isInitialized || isLoading || isOnboardingLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </ThemedView>
    );
  }

  // Si no ha visto el onboarding, mostrar onboarding
  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // Siempre redirigir a tabs (navegación libre)
  // Las rutas protegidas pedirán login cuando sea necesario
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
