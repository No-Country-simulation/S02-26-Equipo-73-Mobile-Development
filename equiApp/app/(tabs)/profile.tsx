import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProtectedRoute } from '@/src/components/auth';
import { useAuth } from '@/src/hooks/useAuth';
import { ThemedText, ThemedView } from '@/src';
import { Spacing, BorderRadius } from '@/src/constants';
import AntDesignIcon from '@expo/vector-icons/AntDesign';

/**
 * Pantalla de perfil (protegida)
 * Menú principal de configuración del perfil del usuario
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
          },
        },
      ]
    );
  };

  const profileMenuItems = [
    {
      id: 'measurements',
      title: 'Mis Medidas',
      icon: 'API',
      description: 'Gestiona tus medidas corporales',
      // onPress: () => router.push('/settings/measurements'),
    },
    {
      id: 'horses',
      title: 'Mis Caballos',
      icon: 'star',
      description: 'Administra tus caballos',
      onPress: () => router.push('/settings/horses'),
    },
    {
      id: 'data',
      title: 'Mis Datos',
      icon: 'idcard',
      description: 'Información personal',
      onPress: () => router.push('/settings/profile'),
    },
    {
      id: 'password',
      title: 'Cambiar Contraseña',
      icon: 'lock',
      description: 'Actualiza tu contraseña',
      onPress: () => router.push('/settings/change-password'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <ThemedText type="title" style={styles.headerTitle}>Profile</ThemedText>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.name}>{user?.name || 'Usuario'}</ThemedText>
              <ThemedText style={styles.email}>{user?.email}</ThemedText>
              <ThemedText style={styles.role}>{user?.role || 'user'}</ThemedText>
            </View>
          </View>

          {/* Profile Menu */}
          <View style={styles.menuContainer}>
            {profileMenuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index !== profileMenuItems.length - 1 && styles.menuItemBorder,
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

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AntDesignIcon name="logout" size={20} color="#fff" style={styles.logoutIcon} />
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
    backgroundColor: '#f8f8f8',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
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
    backgroundColor: '#ff3b30',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  logoutIcon: {
    marginRight: Spacing.sm,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
