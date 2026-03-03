import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks';
import { ThemedView, ThemedText } from '@/src';
import { Colors, Spacing, BorderRadius } from '@/src/constants';
import { useHorses } from '@/src/services/horses.service';
import { useProducts } from '@/src/services/products.service';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import type { Horse } from '@/src/types/horse.types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - Spacing.lg * 2;

/**
 * Home Screen - EquiData Dashboard
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // React Query hooks - Solo cargar horses si está autenticado
  const { data: horses = [], isLoading: horsesLoading } = useHorses();
  const { data: productsData, isLoading: productsLoading } = useProducts({
    PageNumber: 1,
    PageSize: 6,
  });

  const products = productsData?.items || [];

  // Handler para navegar con verificación de autenticación
  const handleNavigateProtected = (path: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      router.push(path as any);
    }
  };

  // Calculate age from birth date
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return t('home.months', { count: months });
    } else if (months < 0) {
      return t('home.years', { count: years - 1 });
    } else {
      return t('home.years', { count: years });
    }
  };

  // Calculate days since last scan (mock for now)
  const getDaysSinceLastScan = (horse: Horse) => {
    // Mock: return 2 days for now
    return t('home.daysAgo', { count: 2 });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.logoText}>{t('home.title')}</ThemedText>
            <TouchableOpacity style={styles.notificationButton}>
              <AntDesignIcon name="bell" size={24} color={colors.text} />
              {/* <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
                <ThemedText style={styles.notificationBadgeText}>2</ThemedText>
              </View> */}
            </TouchableOpacity>
          </View>

          {/* Quick Access */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>{t('home.quickAccess')}</ThemedText>
              {/* <TouchableOpacity>
                <ThemedText style={[styles.editButton, { color: colors.info }]}>Edit</ThemedText>
              </TouchableOpacity> */}
            </View>
                
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity
                style={[styles.quickAccessCard, { backgroundColor: colors.card }]}
                onPress={() => handleNavigateProtected('/settings/horses')}
                disabled={!isAuthenticated}
                activeOpacity={isAuthenticated ? 0.7 : 1}
              >
                <ImageBackground
                  source={{ uri: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400' }}
                  style={styles.quickAccessBg}
                  imageStyle={[styles.quickAccessBgImage, !isAuthenticated && { opacity: 0.4 }]}
                >
                  <LinearGradient
                    colors={!isAuthenticated ? ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)'] : ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
                    style={styles.quickAccessGradient}
                  >
                    {!isAuthenticated && (
                      <View style={styles.lockOverlay}>
                        <View style={[styles.lockIcon, { backgroundColor: colors.primary }]}>
                          <AntDesignIcon name="lock" size={24} color="#fff" />
                        </View>
                      </View>
                    )}
                    <View style={[styles.quickAccessIcon, { backgroundColor: colors.info, opacity: isAuthenticated ? 1 : 0.6 }]}>
                      <AntDesignIcon name="star" size={20} color="#fff" />
                    </View>
                    <ThemedText style={[styles.quickAccessTitle, !isAuthenticated && { opacity: 0.7 }]}>{t('home.myHorses')}</ThemedText>
                    <ThemedText style={[styles.quickAccessSubtitle, !isAuthenticated && { opacity: 0.7 }]}>
                      {isAuthenticated ? t('home.profilesActive', { count: horses.length }) : t('home.loginRequired')}
                    </ThemedText>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickAccessCard, { backgroundColor: colors.card }]}
                onPress={() => handleNavigateProtected('/settings/measurements')}
                disabled={!isAuthenticated}
                activeOpacity={isAuthenticated ? 0.7 : 1}
              >
                <ImageBackground
                  source={{ uri: 'https://images.unsplash.com/photo-1598662957477-3eed86f54020?w=400' }}
                  style={styles.quickAccessBg}
                  imageStyle={[styles.quickAccessBgImage, !isAuthenticated && { opacity: 0.4 }]}
                >
                  <LinearGradient
                    colors={!isAuthenticated ? ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)'] : ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
                    style={styles.quickAccessGradient}
                  >
                    {!isAuthenticated && (
                      <View style={styles.lockOverlay}>
                        <View style={[styles.lockIcon, { backgroundColor: colors.primary }]}>
                          <AntDesignIcon name="lock" size={24} color="#fff" />
                        </View>
                      </View>
                    )}
                    <View style={[styles.quickAccessIcon, { backgroundColor: colors.secondary, opacity: isAuthenticated ? 1 : 0.6 }]}>
                      <AntDesignIcon name="profile" size={20} color="#fff" />
                    </View>
                    <ThemedText style={[styles.quickAccessTitle, !isAuthenticated && { opacity: 0.7 }]}>{t('home.measurements')}</ThemedText>
                    <ThemedText style={[styles.quickAccessSubtitle, !isAuthenticated && { opacity: 0.7 }]}>
                      {isAuthenticated ? t('home.lastUpdated', { time: '2d ago' }) : t('home.loginRequired')}
                    </ThemedText>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>

          {/* My Stable */}
          {isAuthenticated && horses.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>{t('home.myStable')}</ThemedText>
                <TouchableOpacity onPress={() => router.push('/settings/horses')}>
                  <ThemedText style={[styles.viewAllButton, { color: colors.info }]}>
                    {t('home.viewAll')}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horseCardsContainer}
              >
                {horses.slice(0, 3).map((horse) => (
                  <TouchableOpacity
                    key={horse.id}
                    style={[styles.horseCard, { backgroundColor: colors.card }]}
                    onPress={() =>
                      router.push({
                        pathname: '/settings/horse-detail',
                        params: { horseId: horse.id },
                      })
                    }
                  >
                    <ImageBackground
                      source={{ uri: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600' }}
                      style={styles.horseCardImage}
                      imageStyle={styles.horseCardImageStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                        style={styles.horseCardGradient}
                      >
                        <View style={[styles.optimalBadge, { backgroundColor: colors.success }]}>
                          <ThemedText style={styles.optimalBadgeText}>{t('home.optimal')}</ThemedText>
                        </View>
                        <View style={styles.horseCardInfo}>
                          <ThemedText style={styles.horseCardName}>{horse.name}</ThemedText>
                          <ThemedText style={styles.horseCardMeta}>
                            {t('home.lastScan', { time: getDaysSinceLastScan(horse) })}
                          </ThemedText>
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                    {/* <View style={styles.horseCardActions}>
                      <TouchableOpacity
                        style={[
                          styles.horseCardButton,
                          { backgroundColor: colors.backgroundSecondary },
                        ]}
                        onPress={() =>
                          router.push({
                            pathname: '/settings/horse-detail',
                            params: { horseId: horse.id },
                          })
                        }
                      >
                        <ThemedText
                          style={[styles.horseCardButtonText, { color: colors.text }]}
                        >
                          Profile
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.horseCardButton, { backgroundColor: colors.info }]}
                      >
                        <ThemedText style={[styles.horseCardButtonText, { color: '#fff' }]}>
                          New Scan
                        </ThemedText>
                      </TouchableOpacity>
                    </View> */}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* For Your Equipment - Siempre visible */}
          <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>{t('home.forYourEquipment')}</ThemedText>
                <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
                  <ThemedText style={[styles.viewAllButton, { color: colors.info }]}>
                    {t('home.viewAll')}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {productsLoading ? (
                <View style={styles.loadingContainer}>
                  <ThemedText style={{ color: colors.textSecondary }}>{t('home.loadingProducts')}</ThemedText>
                </View>
              ) : products.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <ThemedText style={{ color: colors.textSecondary }}>{t('home.noProducts')}</ThemedText>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productCardsContainer}
                >
                  {products.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={[styles.productCard, { backgroundColor: colors.card }]}
                    onPress={() =>
                      router.push({
                        pathname: '/product/[id]',
                        params: { id: product.id },
                      })
                    }
                  >
                    <View style={styles.productImageContainer}>
                      <Image
                        source={{
                          uri:
                            product.media.length > 0 ? product.media[0].url :
                            'https://via.placeholder.com/200',
                        }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity style={styles.favoriteButton}>
                        <AntDesignIcon name="heart" size={20} color={colors.text} />
                      </TouchableOpacity>
                      {/* {product. > 0 && ( */}
                        <View style={[styles.fitBadge, { backgroundColor: colors.success }]}>
                          <AntDesignIcon name="check" size={12} color="#fff" />
                          <ThemedText style={styles.fitBadgeText}>
                            {t('home.fit', { percent: Math.round(Math.random() * 20 + 80) })}
                          </ThemedText>
                        </View>
                       {/* )} */}
                    </View>
                    <View style={styles.productInfo}>
                      <ThemedText
                        style={styles.productName}
                        numberOfLines={2}
                      >
                        {product.name}
                      </ThemedText>
                      <ThemedText style={[styles.productPrice, { color: colors.primary }]}>
                        ${product.price.toFixed(2)}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

          {/* CTA for non-authenticated users */}
          {!isAuthenticated && (
            <View style={[styles.ctaCard, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.ctaTitle}>{t('home.startJourney')}</ThemedText>
              <ThemedText style={styles.ctaDescription}>
                {t('home.joinDescription')}
              </ThemedText>
              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: '#fff' }]}
                onPress={() => router.push('/auth/login')}
              >
                <ThemedText style={[styles.ctaButtonText, { color: colors.primary }]}>
                  {t('home.getStarted')}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Section
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Quick Access
  quickAccessGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  quickAccessCard: {
    flex: 1,
    height: 160,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAccessBg: {
    flex: 1,
  },
  quickAccessBgImage: {
    borderRadius: BorderRadius.xl,
  },
  quickAccessGradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'flex-end',
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  quickAccessSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  lockIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Horse Cards
  horseCardsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  horseCard: {
    width: 280,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  horseCardImage: {
    width: '100%',
    height: 280,
  },
  horseCardImageStyle: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  horseCardGradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  optimalBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  optimalBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  horseCardInfo: {
    gap: 4,
  },
  horseCardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  horseCardMeta: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  horseCardActions: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  horseCardButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  horseCardButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Product Cards
  productCardsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  productCard: {
    width: 180,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fitBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  fitBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: Spacing.md,
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    height: 36,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // CTA Card
  ctaCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  ctaButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Loading & Empty states
  loadingContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
});
