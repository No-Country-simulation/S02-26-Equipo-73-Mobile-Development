import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText } from '@/src';
import { useAuth } from '@/src/hooks/useAuth';
import { Spacing, BorderRadius } from '@/src/constants';
import AntDesignIcon from '@expo/vector-icons/AntDesign';

/**
 * Pantalla de Settings (pública)
 * Configuración general de la app disponible para todos los usuarios
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Sección de Preferences
  const preferencesItems = [
    {
      id: 'theme',
      title: 'Tema',
      icon: 'bulberth',
      description: 'Modo claro, oscuro o automático',
      onPress: () => router.push('/settings/preferences'),
    },
    {
      id: 'language',
      title: 'Idioma',
      icon: 'global',
      description: 'Español, English',
      onPress: () => router.push('/settings/preferences'),
    },
  ];

  // Sección de App Controls
  const appControlsItems = [
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: 'notification',
      description: 'Gestiona tus notificaciones',
      onPress: () => router.push('/settings/preferences'),
    },
    {
      id: 'tutorial',
      title: 'Reiniciar Tutorial',
      icon: 'reload',
      description: 'Ver el tutorial de nuevo',
      onPress: () => router.push('/settings/preferences'),
    },
  ];

  // Ayuda y Soporte
  const supportItems = [
    {
      id: 'help',
      title: 'Ayuda y Soporte',
      icon: 'question-circle',
      description: 'FAQs y contacto con soporte',
      onPress: () => router.push('/settings/help'),
    },
  ];

  const renderSection = (title: string, items: typeof preferencesItems) => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index !== items.length - 1 && styles.menuItemBorder,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <AntDesignIcon name={item.icon as any} size={24} color="#007AFF" style={styles.menuIcon} />
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
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <ThemedText type="title" style={styles.headerTitle}>Settings</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Usuario info si está autenticado */}
          {isAuthenticated && user ? (
            <ThemedView style={styles.userCard}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>{user.name || 'Usuario'}</ThemedText>
                <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
              </View>
            </ThemedView>
          ) : (
            /* Mensaje si no está autenticado */
            <View style={styles.loginPrompt}>
              <ThemedText style={styles.loginPromptText}>
                Inicia sesión para acceder a más funciones
              </ThemedText>
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => router.push('/auth/login')}
              >
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Preferences Section */}
          {renderSection('Preferencias', preferencesItems)}

          {/* App Controls Section */}
          {renderSection('Controles de la App', appControlsItems)}

          {/* Support Section */}
          {renderSection('Ayuda', supportItems)}
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
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    padding: Spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  loginPrompt: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.md,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  menuContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
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
});
