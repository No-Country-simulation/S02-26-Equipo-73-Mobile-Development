/**
 * Pantalla principal de Perfil y Ajustes
 * Lista todas las opciones de configuración
 */

import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText } from '@/src';
import { useAuth } from '@/src/hooks/useAuth';
import { Spacing, BorderRadius } from '@/src/constants';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
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
            router.replace('/');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'profile',
      title: 'Perfil',
      icon: '👤',
      description: 'Ver y editar tu información personal',
      onPress: () => router.push('/settings/profile'),
    },
    {
      id: 'closet',
      title: 'Closet',
      icon: '👔',
      description: 'Gestiona tu vestuario',
      onPress: () => router.push('/settings/closet'),
    },
    {
      id: 'horses',
      title: 'Caballos',
      icon: '🐴',
      description: 'Administra tus caballos',
      onPress: () => router.push('/settings/horses'),
    },
    {
      id: 'help',
      title: 'Ayuda y Soporte',
      icon: '❓',
      description: 'Obtén ayuda y contacta con soporte',
      onPress: () => router.push('/settings/help'),
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: '⚙️',
      description: 'Preferencias de la aplicación',
      onPress: () => router.push('/settings/preferences'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title">Perfil y Ajustes</ThemedText>
            {user && (
              <ThemedText style={styles.subtitle}>
                {user.name || user.email}
              </ThemedText>
            )}
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index !== menuItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <View style={styles.menuTextContainer}>
                    <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                    <ThemedText style={styles.menuDescription}>
                      {item.description}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.chevron}>›</ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
          </TouchableOpacity>
        </ScrollView>
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
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  subtitle: {
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuDescription: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.6,
  },
  chevron: {
    fontSize: 28,
    opacity: 0.3,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    backgroundColor: '#ff3b30',
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
