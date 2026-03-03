import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedText, ThemedView } from '@/src';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import { useCart } from '@/src/stores/cart.store';
import type { CartItem } from '@/src/types/cart.types';

/**
 * Pantalla del carrito de compras
 * Muestra los productos agregados, permite modificar cantidades y finalizar la compra
 */
export default function CartScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { items, isLoading, removeItem, updateQuantity, clearCart, summary, loadCart } = useCart();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const successScale = new Animated.Value(0);

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemoveItem = (item: CartItem) => {
    Alert.alert(
      t('cart.removeItem'),
      t('cart.removeItemConfirm', { name: item.product.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => removeItem(item.id),
        },
      ]
    );
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleClearCart = () => {
    Alert.alert(
      t('cart.clearCart'),
      t('cart.clearConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('cart.clearCart'),
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Simular proceso de pago
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
      
      // Animar el ícono de éxito
      Animated.spring(successScale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
      
      // Limpiar el carrito después de la animación
      setTimeout(() => {
        clearCart();
      }, 1500);
    }, 2000);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    successScale.setValue(0);
    router.back();
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderCartItem = (item: CartItem) => {
    const primaryMedia = item.product.media.find(m => m.isPrimary) || item.product.media[0];
    const itemTotal = item.variant.price * item.quantity;

    return (
      <View
        key={item.id}
        style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        {/* Imagen del producto */}
        <View style={styles.itemImageContainer}>
          {primaryMedia ? (
            <Image
              source={{ uri: primaryMedia.url }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: `${colors.primary}20` }]}>
              <AntDesignIcon name="picture" size={32} color={colors.primary} />
            </View>
          )}
        </View>

        {/* Información del producto */}
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemName} numberOfLines={2}>
            {item.product.name}
          </ThemedText>
          <ThemedText style={[styles.itemBrand, { color: colors.textSecondary }]}>
            {item.product.brandName}
          </ThemedText>
          <View style={styles.itemVariant}>
            <Text style={[styles.variantText, { color: colors.textSecondary }]}>
              {t('cart.size')}: {item.variant.sizeLabel}
            </Text>
            {item.variant.color && (
              <Text style={[styles.variantText, { color: colors.textSecondary }]}>
                {' • '}{t('cart.color')}: {item.variant.color}
              </Text>
            )}
          </View>
          <ThemedText style={[styles.itemPrice, { color: colors.primary }]}>
            {formatPrice(item.variant.price)}
          </ThemedText>
        </View>

        {/* Botón de eliminar */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveItem(item)}
        >
          <AntDesignIcon name="delete" size={20} color="#FF3B30" />
        </TouchableOpacity>

        {/* Control de cantidad */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.border }]}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <AntDesignIcon
              name="minus"
              size={14}
              color={item.quantity <= 1 ? colors.textSecondary : colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: colors.text }]}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.primary }]}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            <AntDesignIcon name="plus" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Subtotal del item */}
        <View style={styles.itemTotalContainer}>
          <ThemedText style={styles.itemTotal}>
            {formatPrice(itemTotal)}
          </ThemedText>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('common.loading')}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesignIcon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText variant="subheading1">{t('cart.title')}</ThemedText>
          {items.length > 0 && (
            <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
              <ThemedText style={[styles.clearButtonText, { color: '#FF3B30' }]}>
                {t('cart.clearCart')}
              </ThemedText>
            </TouchableOpacity>
          )}
          {items.length === 0 && <View style={{ width: 60 }} />}
        </View>

        {/* Contenido */}
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}20` }]}>
              <AntDesignIcon name="shopping-cart" size={64} color={colors.primary} />
            </View>
            <ThemedText style={styles.emptyTitle}>{t('cart.empty')}</ThemedText>
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('cart.emptyMessage')}
            </ThemedText>
            <TouchableOpacity
              style={[styles.shopButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/products')}
            >
              <ThemedText style={styles.shopButtonText}>{t('cart.goToShop')}</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Lista de productos */}
              <View style={styles.itemsList}>
                {items.map(renderCartItem)}
              </View>
            </ScrollView>

            {/* Resumen y Checkout */}
            <View style={[styles.summaryContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>{t('cart.subtotal')}</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {formatPrice(summary.subtotal)}
                </ThemedText>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <ThemedText style={styles.totalLabel}>{t('cart.total')}</ThemedText>
                <ThemedText style={[styles.totalValue, { color: colors.primary }]}>
                  {formatPrice(summary.total)}
                </ThemedText>
              </View>
              <ThemedText style={[styles.itemsCount, { color: colors.textSecondary }]}>
                {t('cart.itemsCount', { count: summary.itemsCount })}
              </ThemedText>
              
              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  { backgroundColor: colors.primary },
                  isProcessing && styles.checkoutButtonDisabled,
                ]}
                onPress={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <AntDesignIcon name="check-circle" size={20} color="#fff" />
                    <Text style={styles.checkoutButtonText}>{t('cart.checkout')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Modal de éxito */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={handleCloseSuccessModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Animated.View
                style={[
                  styles.successIconContainer,
                  { transform: [{ scale: successScale }] },
                ]}
              >
                <View style={[styles.successIcon, { backgroundColor: '#34C759' }]}>
                  <AntDesignIcon name="check" size={48} color="#fff" />
                </View>
              </Animated.View>
              <ThemedText style={styles.successTitle}>{t('cart.success.title')}</ThemedText>
              <ThemedText style={[styles.successText, { color: colors.textSecondary }]}>
                {t('cart.success.message')}
              </ThemedText>
              <TouchableOpacity
                style={[styles.successButton, { backgroundColor: colors.primary }]}
                onPress={handleCloseSuccessModal}
              >
                <Text style={styles.successButtonText}>{t('common.continue')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  loadingText: {
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  clearButton: {
    padding: 4,
    width: 60,
    alignItems: 'flex-end',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxl,
  },
  shopButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xl,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  itemsList: {
    gap: Spacing.md,
  },
  cartItem: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageContainer: {
    marginBottom: Spacing.sm,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: BorderRadius.md,
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginBottom: Spacing.sm,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemVariant: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  variantText: {
    fontSize: 13,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    padding: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotalContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryContainer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  itemsCount: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.sm,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  successIconContainer: {
    marginBottom: Spacing.lg,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  successButton: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
