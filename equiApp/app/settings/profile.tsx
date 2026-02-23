/**
 * Pantalla de Perfil del Usuario
 * Muestra la información del usuario y permite editar
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText } from '@/src';
import { useAuth } from '@/src/hooks/useAuth';
import { getUserProfile } from '@/src/services/auth.service';
import { Spacing, BorderRadius } from '@/src/constants';
import type { UserMeResponse } from '@/src/types/auth.types';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserMeResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getUserProfile();
      setProfileData(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Cargando perfil...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const displayData = profileData || user;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header con botón de volver */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText style={styles.backButton}>← Volver</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title" style={styles.title}>Mi Perfil</ThemedText>
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {displayData?.name?.charAt(0).toUpperCase() || 
                 displayData?.email?.charAt(0).toUpperCase() || '?'}
              </ThemedText>
            </View>
            <ThemedText type="subtitle" style={styles.userName}>
              {displayData?.name || 'Usuario'}
            </ThemedText>
            <ThemedText style={styles.userEmail}>{displayData?.email}</ThemedText>
          </View>

          {/* Información del usuario */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Información Personal
            </ThemedText>
            
            <View style={styles.infoCard}>
              <InfoRow 
                label="ID de Usuario" 
                value={displayData && 'userId' in displayData ? displayData.userId : displayData?.id || '-'} 
              />
              <InfoRow label="Email" value={displayData?.email || '-'} />
              <InfoRow label="Nombre" value={displayData?.name || 'No especificado'} />
              <InfoRow label="Rol" value={displayData?.role || 'user'} />
              <InfoRow 
                label="Estado" 
                value={displayData && 'isAuthenticated' in displayData ? (displayData.isAuthenticated ? 'Activo' : 'Inactivo') : 'Activo'} 
                isLast 
              />
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Seguridad
            </ThemedText>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/settings/change-password')}
            >
              <View style={styles.actionContent}>
                <ThemedText>🔒</ThemedText>
                <ThemedText style={styles.actionText}>Cambiar Contraseña</ThemedText>
              </View>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Información adicional */}
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoText}>
              💡 Para actualizar tu información personal, contacta con soporte.
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

// Componente auxiliar para filas de información
function InfoRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText type="defaultSemiBold">{value}</ThemedText>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    opacity: 0.7,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: Spacing.sm,
  },
  title: {
    marginBottom: 0,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    marginBottom: Spacing.xs,
  },
  userEmail: {
    opacity: 0.7,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    opacity: 0.7,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionText: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 24,
    opacity: 0.3,
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
