import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { ThemedText, ThemedView } from '@/src';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';

type MenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  badge?: number;
  onPress?: () => void;
};

/**
 * Pantalla de perfil (protegida)
 * Menú principal de configuración del perfil del usuario
 */
export default function ProfileScreen() {
  const { user, logout, isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Mostrar loading solo mientras se inicializa
  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={{ marginTop: Spacing.md, color: colors.textSecondary }}>
            Cargando...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Si no está autenticado, mostrar pantalla de login requerido
  if (!user || !isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText variant='subheading1'>Cuenta</ThemedText>
          </View>
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyStateIcon, { backgroundColor: colors.primary + '20' }]}>
              <AntDesignIcon name="user" size={64} color={colors.primary} />
            </View>
            <ThemedText style={styles.emptyStateTitle}>Inicia sesión</ThemedText>
            <ThemedText style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Para acceder a tu perfil y gestionar tu cuenta, inicia sesión o crea una cuenta nueva
            </ThemedText>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/auth/login')}
            >
              <ThemedText style={styles.loginButtonText}>Iniciar Sesión</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.registerButton, { borderColor: colors.primary }]}
              onPress={() => router.push('/auth/register')}
            >
              <ThemedText style={[styles.registerButtonText, { color: colors.primary }]}>
                Crear Cuenta
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }
  // Función helper para adaptar colores al tema
  const getIconBg = (baseColor: string, opacity: number = 0.15) => {
    // Convertir hex a rgb y agregar opacidad
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const finalOpacity = colorScheme === 'dark' ? opacity * 1.3 : opacity;
    return `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // Sección MY STABLE
  const stableMenuItems: MenuItem[] = [
    {
      id: 'horses',
      title: 'Manage Horses',
      icon: 'star',
      iconColor: colors.primary,
      iconBg: getIconBg(colors.primary),
      onPress: () => router.push('/settings/horses'),
    },
    // {
    //   id: 'measurements-log',
    //   title: 'Measurement Log',
    //   icon: 'clock-circle',
    //   iconColor: colors.primary,
    //   iconBg: getIconBg(colors.primary),
    //   // onPress: () => router.push('/settings/measurement-log'),
    // },
  ];

  // Sección MY ACCOUNT
  const accountMenuItems: MenuItem[] = [
    {
      id: 'personal-data',
      title: 'Datos Personales',
      icon: 'user',
      iconColor: colors.secondary,
      iconBg: getIconBg(colors.secondary),
      onPress: () => router.push('/settings/personal-data'),
    },
    {
      id: 'measurements',
      title: 'Mis Medidas',
      icon: 'profile',
      iconColor: colors.secondary,
      iconBg: getIconBg(colors.secondary),
      onPress: () => router.push('/settings/measurements'),
    },
    {
      id: 'account',
      title: 'Cambio de Contraseña',
      icon: 'lock',
      iconColor: colors.secondary,
      iconBg: getIconBg(colors.secondary),
      onPress: () => router.push('/settings/change-password'),
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: 'credit-card',
      iconColor: colors.secondary,
      iconBg: getIconBg(colors.secondary),
      // onPress: () => router.push('/settings/payment-methods'),
    },
  ];

  // Sección SETTINGS
  const settingsMenuItems: MenuItem[] = [
    {
      id: 'settings',
      title: 'Ajustes',
      icon: 'setting',
      iconColor: '#8B7FD8',
      iconBg: getIconBg('#8B7FD8'),
      onPress: () => router.push('/settings'),
    },
  ];

  const renderSection = (title: string, items: MenuItem[]) => (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {title.toUpperCase()}
      </ThemedText>
      <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index !== items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={item.onPress}
            disabled={!item.onPress}
            activeOpacity={item.onPress ? 0.7 : 1}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                <AntDesignIcon name={item.icon as any} size={20} color={item.iconColor} />
              </View>
              <View style={styles.menuTextContainer}>
                <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                {item.subtitle && (
                  <ThemedText style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
                    {item.subtitle}
                  </ThemedText>
                )}
              </View>
            </View>
            {item.badge !== undefined ? (
              <View style={[styles.badge, { backgroundColor: colors.info }]}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            ) : (
              <AntDesignIcon name="right" size={16} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant='subheading1'>Cuenta</ThemedText>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info */}
          <View style={styles.userSection}>
            <View style={[styles.avatarContainer, { borderColor: colors.secondary }]}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <ThemedText style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              {/* <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: colors.info }]}>
                <AntDesignIcon name="edit" size={14} color="#fff" />
              </TouchableOpacity> */}
            </View>
            <ThemedText style={styles.userName}>{user?.name || 'Usuario'}</ThemedText>
            <ThemedText style={[styles.userEmail, { color: colors.secondary }]}>
              {user?.email || '-'}
            </ThemedText>
          </View>

          {/* MY STABLE Section */}
          {renderSection('My Stable', stableMenuItems)}

          {/* MY ACCOUNT Section */}
          {renderSection('My Account', accountMenuItems)}

          {/* SETTINGS Section */}
          {renderSection('Settings', settingsMenuItems)}

          {/* Sign Out Button */}
          <TouchableOpacity
            style={[styles.signOutButton, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 59, 48, 0.1)' }]}
            onPress={handleLogout}
          >
            <AntDesignIcon name="logout" size={18} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxl,
  },
  loginButton: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderRadius: 70,
    padding: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
    letterSpacing: 1,
  },
  menuContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    minHeight: 64,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
});
