import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

/**
 * Pantalla de productos (pública)
 * Ejemplo de ruta que NO requiere autenticación
 */
export default function ProductsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Catálogo de Productos</Text>
      <Text style={styles.subtitle}>
        Esta pantalla es pública y puede verse sin autenticación
      </Text>

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
