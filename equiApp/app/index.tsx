import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';

/**
 * Pantalla inicial de la app
 * Redirige según el estado de autenticación
 */
export default function Index() {
  const { isInitialized, isLoading } = useAuth();

  // Mostrar loading mientras se inicializa
  if (!isInitialized || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
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
    backgroundColor: '#fff',
  },
});
