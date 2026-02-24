import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { ThemedView, ThemedText } from '@/src';

/**
 * Pantalla principal (pública)
 * No requiere autenticación
 */
export default function HomeScreen() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <ThemedText type='title'>Bienvenido a EquiApp</ThemedText>
            {isAuthenticated ? (
              <ThemedText type='subtitle'>Hola, {user?.name || user?.email}! 👋</ThemedText>
            ) : (
              <ThemedText type='subtitle'>Explora nuestros productos y servicios</ThemedText>
            )}
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/(tabs)/products')}
            >
              <ThemedText style={styles.cardIcon}>🛍️</ThemedText>
              <ThemedText style={styles.cardTitle}>Productos</ThemedText>
              <ThemedText style={styles.cardDescription}>
                Explora nuestro catálogo completo
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/settings')}
            >
              <ThemedText style={styles.cardIcon}>🛍️</ThemedText>
              <ThemedText style={styles.cardTitle}>Productos</ThemedText>
              <ThemedText style={styles.cardDescription}>
                Ir a settings
              </ThemedText>
            </TouchableOpacity>

            {!isAuthenticated ? (
              <TouchableOpacity
                style={[styles.card, styles.cardPrimary]}
                onPress={() => router.push('/auth/login')}
              >
                <ThemedText style={styles.cardIcon}>🔐</ThemedText>
                <ThemedText style={[styles.cardTitle, styles.cardTextWhite]}>Iniciar Sesión</ThemedText>
                <ThemedText style={[styles.cardDescription, styles.cardTextWhite]}>
                  Accede a todas las funcionalidades
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.card, styles.cardSuccess]}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <ThemedText style={styles.cardIcon}>👤</ThemedText>
                <ThemedText style={[styles.cardTitle, styles.cardTextWhite]}>Mi Perfil</ThemedText>
                <ThemedText style={[styles.cardDescription, styles.cardTextWhite]}>
                  Administra tu cuenta
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoBox}>
            <ThemedText style={styles.infoText}>
              ✨ Esta es una app de ejemplo con autenticación completa,
              navegación libre y rutas protegidas.
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPrimary: {
    backgroundColor: '#007AFF',
  },
  cardSuccess: {
    backgroundColor: '#28a745',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cardTextWhite: {
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#004085',
    lineHeight: 20,
  },
});
