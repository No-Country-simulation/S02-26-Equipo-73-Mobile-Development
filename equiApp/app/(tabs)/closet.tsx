import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/hooks/useAuth';
import { ThemedText, ThemedView } from '@/src';

/**
 * Pantalla de Closet
 * Muestra los productos guardados o favoritos del usuario
 */
export default function ClosetScreen() {
  const { isAuthenticated, user } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Mi Closet</ThemedText>
          <ThemedText style={styles.subtitle}>
            {isAuthenticated
              ? 'Tus productos favoritos y guardados'
              : 'Inicia sesión para ver tu closet'}
          </ThemedText>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {isAuthenticated ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>
                Tu closet está vacío
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Guarda productos desde la tienda para verlos aquí
              </ThemedText>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>
                Inicia sesión para acceder a tu closet
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
