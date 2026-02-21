import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProtectedRoute } from '@/src/components/auth';
import { useAuth } from '@/src/hooks/useAuth';
import { ThemedText, ThemedView } from '@/src';

/**
 * Pantalla de perfil (protegida)
 * Requiere autenticación
 */
function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // ProtectedRoute redirigirá automáticamente al login
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
            <ThemedText style={styles.name}>{user?.name || 'Usuario'}</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </View>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Información de Usuario</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>ID:</ThemedText>
              <ThemedText style={styles.value}>{user?.id}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Rol:</ThemedText>
              <ThemedText style={styles.value}>{user?.role || 'user'}</ThemedText>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>

      </ThemedView>
    </SafeAreaView>
  );
}

export default function ProfileScreen() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
    marginBottom: 24,
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
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
