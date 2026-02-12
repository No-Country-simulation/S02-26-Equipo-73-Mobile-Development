import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';

/**
 * Pantalla de productos (pública)
 * Ejemplo de ruta que NO requiere autenticación
 */
export default function ProductsScreen() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Catálogo de Productos</Text>
      <Text style={styles.subtitle}>
        Esta pantalla es pública y puede verse sin autenticación
      </Text>

      {!isAuthenticated && (
        <View style={styles.authPrompt}>
          <Text style={styles.authPromptText}>
            🔓 Para acceder a todas las funcionalidades
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAuthenticated && (
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>
            👋 Hola, {user?.name || user?.email}!
          </Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Info</Text>
        <Text style={styles.infoText}>
          Aquí podrías usar React Query para cargar productos desde tu API:
        </Text>
        <Text style={styles.code}>
          useQuery(queryKeys.products.list(), fetchProducts)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  authPrompt: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginBottom: 16,
    alignItems: 'center',
  },
  authPromptText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 12,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeBox: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  welcomeText: {
    fontSize: 14,
    color: '#155724',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    backgroundColor: '#e5e7eb',
    padding: 8,
    borderRadius: 4,
    color: '#1f2937',
  },
});
