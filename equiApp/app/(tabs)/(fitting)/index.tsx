import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
  onPress?: () => void;
};

/**
 * Pantalla de Fitting
 * Muestra el establo de caballos y las medidas del jinete
 */
export default function FittingScreen() {
  const { isAuthenticated, user, isInitialized } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Helper para adaptar colores al tema
  const getIconBg = (baseColor: string, opacity: number = 0.15) => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const finalOpacity = colorScheme === 'dark' ? opacity * 1.3 : opacity;
    return `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
  };

  // Mostrar loading mientras se inicializa
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
            <ThemedText variant='subheading1'>Fitting</ThemedText>
          </View>
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyStateIcon, { backgroundColor: colors.primary + '20' }]}>
              <AntDesignIcon name="star" size={64} color={colors.primary} />
            </View>
            <ThemedText style={styles.emptyStateTitle}>Inicia sesión</ThemedText>
            <ThemedText style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Para acceder a tu establo y medidas, inicia sesión o crea una cuenta nueva
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

  // Sección MY STABLE
  const stableMenuItems: MenuItem[] = [
    {
      id: 'horses',
      title: 'Manage Horses',
      subtitle: 'Gestiona tu establo de caballos',
      icon: 'star',
      iconColor: colors.primary,
      iconBg: getIconBg(colors.primary),
      onPress: () => router.push('/horses'),
    },
  ];

  // Sección RIDER MEASUREMENTS
  const measurementsMenuItems: MenuItem[] = [
    {
      id: 'measurements',
      title: 'Mis Medidas',
      subtitle: 'Medidas del jinete',
      icon: 'profile',
      iconColor: colors.secondary,
      iconBg: getIconBg(colors.secondary),
      onPress: () => router.push('/measurements'),
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
            <AntDesignIcon name="right" size={16} color={colors.textSecondary} />
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
          <ThemedText variant='subheading1'>Fitting</ThemedText>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: `${colors.primary}15` }]}>
            <View style={styles.infoCardContent}>
              <AntDesignIcon name="star" size={32} color={colors.primary} />
              <View style={styles.infoCardText}>
                <ThemedText style={styles.infoCardTitle}>
                  Establo & Medidas
                </ThemedText>
                <ThemedText style={[styles.infoCardSubtitle, { color: colors.textSecondary }]}>
                  Gestiona tu establo y tus medidas personales
                </ThemedText>
              </View>
            </View>
          </View>

          {/* MY STABLE Section */}
          {renderSection('My Stable', stableMenuItems)}

          {/* RIDER MEASUREMENTS Section */}
          {renderSection('Rider', measurementsMenuItems)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  infoCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoCardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
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
    minHeight: 72,
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
    fontSize: 13,
    marginTop: 2,
  },
});
