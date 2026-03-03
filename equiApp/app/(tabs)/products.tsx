import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/hooks/useAuth';
import { useProducts, type SortBy, type Product, type ProductVariant } from '@/src/services/products.service';
import { ThemedText, ThemedView, ThemedActionSheet, ThemedButton } from '@/src';
import { Colors, Spacing, BorderRadius } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import { useCart } from '@/src/stores/cart.store';

type Category = 'All' | 'Dressage' | 'Jumping' | 'Eventing';

/**
 * Pantalla de catálogo de productos (pública)
 * Consume la API de productos con scroll infinito
 * Diseño moderno con búsqueda, filtros y categorías
 */
export default function ProductsScreen() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { addItem, summary } = useCart();

  // Estado de búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [smartFitEnabled, setSmartFitEnabled] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Estado para selección de variante
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Estado de filtros y paginación
  const [sortBy, setSortBy] = useState<SortBy>('Id');
  const [sortDescending, setSortDescending] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [pageNumber, setPageNumber] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  // Obtener productos
  const { data, isLoading, error, refetch } = useProducts({
    SortBy: sortBy,
    SortDescending: sortDescending,
    PageNumber: pageNumber,
    PageSize: pageSize,
    MinPrice: minPrice,
    MaxPrice: maxPrice,
  });

  // Acumular productos cuando llegan nuevos datos
  useEffect(() => {
    if (data?.items) {
      if (pageNumber === 1) {
        // Primera carga o refresh: reemplazar todos
        setAllProducts(data.items);
      } else {
        // Carga de más páginas: agregar al final
        setAllProducts((prev) => [...prev, ...data.items]);
      }
      setHasMore(data.hasNext);
    }
  }, [data, pageNumber]);

  // Aplicar filtros
  const handleApplyFilters = () => {
    setPageNumber(1);
    setAllProducts([]);
    setHasMore(true);
    setShowFilters(false);
    refetch();
  };

  // Refresh desde el inicio
  const handleRefresh = useCallback(() => {
    setPageNumber(1);
    setAllProducts([]);
    setHasMore(true);
    refetch();
  }, [refetch]);

  // Cargar más productos al llegar al final
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPageNumber((prev) => prev + 1);
    }
  };

  // Determinar badge del producto (simulado)
  const getProductBadge = (product: Product, index: number) => {
    if (smartFitEnabled && index % 3 === 0) return 'Compatible';
    if (index % 5 === 0) return 'NEW';
    if (index % 4 === 0) return 'Validate';
    return null;
  };

  // Manejar apertura del selector de variantes
  const handleOpenVariantSelector = (product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      Alert.alert('Sin variantes', 'Este producto no tiene variantes disponibles');
      return;
    }
    
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0]); // Pre-seleccionar la primera variante
    setShowVariantSelector(true);
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant) return;
    
    addItem(selectedProduct, selectedVariant, 1);
    setShowVariantSelector(false);
    
    // Mostrar confirmación
    Alert.alert(
      t('cart.addedToCart.title'),
      `${selectedProduct.name} - ${selectedVariant.sizeLabel}`,
      [{ text: 'OK' }]
    );
    
    // Limpiar selección
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  // Renderizar cada producto
  const renderProduct = ({ item, index }: { item: Product; index: number }) => {
    const primaryImage = item.media?.find((m) => m.isPrimary)?.url || item.media?.[0]?.url;
    const badge = getProductBadge(item, index);

    return (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        {/* Imagen con badge */}
        <View style={styles.imageContainer}>
          {primaryImage ? (
            <Image source={{ uri: primaryImage }} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.noImage, { backgroundColor: colors.border }]}>
              <ThemedText style={styles.noImageText}>{t('common.loading')}</ThemedText>
            </View>
          )}
          
          {/* Badge superior */}
          {badge && (
            <View style={[
              styles.badge,
              badge === 'Compatible' && styles.badgeCompatible,
              badge === 'Validate' && styles.badgeValidate,
              badge === 'NEW' && styles.badgeNew,
            ]}>
              <Ionicons 
                name={badge === 'Compatible' ? 'checkmark-circle' : badge === 'Validate' ? 'alert-circle' : 'star'} 
                size={12} 
                color="#fff" 
              />
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}

          {/* Botón de favorito */}
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: 'rgba(255,255,255,0.9)' }]}
            onPress={(e) => {
              e.stopPropagation();
              // TODO: Implementar lógica de favoritos
            }}
          >
            <Ionicons name="heart" size={18} color={colors.background} />
          </TouchableOpacity>
        </View>

        {/* Info del producto */}
        <View style={styles.productInfo}>
          <ThemedText style={styles.productBrand} numberOfLines={1}>
            {item.brandName}
          </ThemedText>
          <ThemedText style={styles.productName} numberOfLines={2}>
            {item.name}
          </ThemedText>
          
          <View style={styles.productFooter}>
            <ThemedText style={[styles.productPrice, { color: colors.primary }]}>
              ${item.price.toFixed(0)}
            </ThemedText>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.text }]}
              onPress={(e) => {
                e.stopPropagation();
                handleOpenVariantSelector(item);
              }}
            >
              <Ionicons name="add" size={20} color={colors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Footer de loading al cargar más
  const renderFooter = () => {
    if (!isLoading || pageNumber === 1) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  // Renderizar cuando no hay productos
  const renderEmpty = () => {
    if (isLoading && pageNumber === 1) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('products.empty')}</Text>
      </View>
    );
  };

  console.log("Categoría seleccionada:", selectedCategory);
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <ThemedText type='title' style={styles.headerTitle}>{t('products.title')}</ThemedText>
          
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {summary.itemsCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.cartBadgeText}>
                  {summary.itemsCount > 99 ? '99+' : summary.itemsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('products.search')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Categorías */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {(['All', 'Dressage', 'Jumping', 'Eventing'] as Category[]).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category ? colors.text : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  { color: selectedCategory === category ? colors.background : colors.text }
                ]}
              >
                {t(`products.categories.${category.toLowerCase()}`)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Smart Fit Toggle */}
        <View style={[styles.smartFitContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.smartFitLeft}>
            <Ionicons name="sparkles" size={20} color={colors.accent} />
            <View>
              <ThemedText type="defaultSemiBold" style={styles.smartFitTitle}>
                {t('products.smartFit.title')}
              </ThemedText>
              <ThemedText style={styles.smartFitSubtitle}>
                {t('products.smartFit.subtitle')}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              { backgroundColor: smartFitEnabled ? colors.accent : colors.border }
            ]}
            onPress={() => setSmartFitEnabled(!smartFitEnabled)}
          >
            <View style={[
              styles.toggleThumb,
              { backgroundColor: colors.background },
              smartFitEnabled && styles.toggleThumbActive
            ]} />
          </TouchableOpacity>
        </View>

        {/* Lista de productos */}
        {isLoading && pageNumber === 1 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <ThemedText style={styles.loadingText}>{t('products.loadMore')}</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{t('products.error')}</ThemedText>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colors.primary }]} 
              onPress={() => refetch()}
            >
              <ThemedText style={styles.retryButtonText}>{t('common.retry')}</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={allProducts}
            renderItem={renderProduct}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            numColumns={2}
            contentContainerStyle={styles.productsList}
            columnWrapperStyle={styles.productRow}
            refreshControl={
              <RefreshControl
                refreshing={isLoading && pageNumber === 1}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
          />
        )}

        {/* ActionSheet de Filtros */}
        <ThemedActionSheet
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          title={t('products.filters.title')}
          snapPoint="large"
        >
          <View style={styles.filtersContent}>
            {/* Ordenamiento */}
            <View style={styles.filterSection}>
              <ThemedText type="defaultSemiBold" style={styles.filterSectionTitle}>
                {t('products.filters.sortBy')}
              </ThemedText>
              <View style={styles.sortOptions}>
                {(['Id', 'Name', 'Price'] as SortBy[]).map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      styles.sortOption,
                      {
                        backgroundColor: sortBy === sort ? colors.primary : colors.card,
                        borderColor: sortBy === sort ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => setSortBy(sort)}
                  >
                    <ThemedText 
                      style={[
                        styles.sortOptionText,
                        { color: sortBy === sort ? '#fff' : colors.text }
                      ]}
                    >
                      {t(`products.filters.${sort.toLowerCase()}`)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Dirección de ordenamiento */}
            <View style={styles.filterSection}>
              <ThemedText type="defaultSemiBold" style={styles.filterSectionTitle}>
                {t('products.filters.direction')}
              </ThemedText>
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor: !sortDescending ? colors.primary : colors.card,
                      borderColor: !sortDescending ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => setSortDescending(false)}
                >
                  <Ionicons 
                    name="arrow-up" 
                    size={16} 
                    color={!sortDescending ? '#fff' : colors.text} 
                  />
                  <ThemedText 
                    style={[
                      styles.sortOptionText,
                      { color: !sortDescending ? '#fff' : colors.text }
                    ]}
                  >
                    {t('products.filters.ascending')}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor: sortDescending ? colors.primary : colors.card,
                      borderColor: sortDescending ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => setSortDescending(true)}
                >
                  <Ionicons 
                    name="arrow-down" 
                    size={16} 
                    color={sortDescending ? '#fff' : colors.text} 
                  />
                  <ThemedText 
                    style={[
                      styles.sortOptionText,
                      { color: sortDescending ? '#fff' : colors.text }
                    ]}
                  >
                    {t('products.filters.descending')}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rango de precios */}
            <View style={styles.filterSection}>
              <ThemedText type="defaultSemiBold" style={styles.filterSectionTitle}>
                {t('products.filters.priceRange')}
              </ThemedText>
              <View style={styles.priceInputs}>
                <View style={styles.priceInputWrapper}>
                  <ThemedText style={styles.priceLabel}>{t('products.filters.minPrice')}</ThemedText>
                  <TextInput
                    style={[
                      styles.priceInput,
                      { 
                        backgroundColor: colors.card, 
                        borderColor: colors.border,
                        color: colors.text 
                      }
                    ]}
                    value={minPrice.toString()}
                    onChangeText={(text) => setMinPrice(Number(text) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                <ThemedText style={styles.priceSeparator}>-</ThemedText>
                <View style={styles.priceInputWrapper}>
                  <ThemedText style={styles.priceLabel}>{t('products.filters.maxPrice')}</ThemedText>
                  <TextInput
                    style={[
                      styles.priceInput,
                      { 
                        backgroundColor: colors.card, 
                        borderColor: colors.border,
                        color: colors.text 
                      }
                    ]}
                    value={maxPrice.toString()}
                    onChangeText={(text) => setMaxPrice(Number(text) || 10000)}
                    keyboardType="numeric"
                    placeholder="10000"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>
            </View>

            {/* Botón aplicar */}
            <ThemedButton
              label={t('products.filters.applyFilters')}
              onPress={handleApplyFilters}
              style={styles.applyButton}
            />
          </View>
        </ThemedActionSheet>

        {/* ActionSheet para Seleccionar Variante */}
        <ThemedActionSheet
          visible={showVariantSelector}
          onClose={() => {
            setShowVariantSelector(false);
            setSelectedProduct(null);
            setSelectedVariant(null);
          }}
          title={t('productDetail.selectSize')}
          snapPoint="medium"
        >
          <View style={styles.variantSelectorContent}>
            {selectedProduct && (
              <>
                {/* Info del producto */}
                <View style={styles.variantProductInfo}>
                  <Image
                    source={{ uri: selectedProduct.media?.[0]?.url }}
                    style={styles.variantProductImage}
                  />
                  <View style={styles.variantProductDetails}>
                    <ThemedText style={styles.variantProductName} numberOfLines={2}>
                      {selectedProduct.name}
                    </ThemedText>
                    <ThemedText style={[styles.variantProductBrand, { color: colors.textSecondary }]}>
                      {selectedProduct.brandName}
                    </ThemedText>
                  </View>
                </View>

                {/* Selector de variantes */}
                <View style={styles.variantsContainer}>
                  <ThemedText type="defaultSemiBold" style={styles.variantsTitle}>
                    {t('productDetail.selectSize')}
                  </ThemedText>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.variantsList}
                    contentContainerStyle={styles.variantsListContent}
                  >
                    {selectedProduct.variants?.map((variant) => (
                      <TouchableOpacity
                        key={variant.id}
                        style={[
                          styles.variantOption,
                          {
                            backgroundColor: selectedVariant?.id === variant.id ? colors.primary : colors.card,
                            borderColor: selectedVariant?.id === variant.id ? colors.primary : colors.border,
                          }
                        ]}
                        onPress={() => setSelectedVariant(variant)}
                        disabled={!variant.isActive || variant.stock <= 0}
                      >
                        <ThemedText
                          style={[
                            styles.variantSizeText,
                            { color: selectedVariant?.id === variant.id ? '#fff' : colors.text },
                            (!variant.isActive || variant.stock <= 0) && styles.variantDisabled,
                          ]}
                        >
                          {variant.sizeLabel}
                        </ThemedText>
                        {variant.stock > 0 && variant.stock <= 5 && (
                          <ThemedText
                            style={[
                              styles.variantStock,
                              { color: selectedVariant?.id === variant.id ? '#fff' : colors.textSecondary }
                            ]}
                          >
                            {t('productDetail.lowStock', { count: variant.stock })}
                          </ThemedText>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Precio de la variante seleccionada */}
                {selectedVariant && (
                  <View style={styles.variantPriceContainer}>
                    <ThemedText style={styles.variantPriceLabel}>{t('productDetail.price')}:</ThemedText>
                    <ThemedText style={[styles.variantPrice, { color: colors.primary }]}>
                      ${selectedVariant.price.toFixed(2)}
                    </ThemedText>
                  </View>
                )}

                {/* Botón agregar */}
                <ThemedButton
                  label={t('productDetail.addToCart')}
                  onPress={handleAddToCart}
                  disabled={!selectedVariant || !selectedVariant.isActive || selectedVariant.stock <= 0}
                  style={styles.addToCartButton}
                />
              </>
            )}
          </View>
        </ThemedActionSheet>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  cartButton: {
    padding: Spacing.xs,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    maxHeight: 52,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600'
  },
  smartFitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  smartFitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  smartFitTitle: {
    fontSize: 15,
  },
  smartFitSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  productsList: {
    padding: Spacing.sm,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  productCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    margin: Spacing.xs,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '48%',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 12,
    opacity: 0.5,
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  badgeCompatible: {
    backgroundColor: '#34C759',
  },
  badgeValidate: {
    backgroundColor: '#8E8E93',
  },
  badgeNew: {
    backgroundColor: '#00C7BE',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    padding: Spacing.md,
  },
  productBrand: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  filtersContent: {
    gap: Spacing.xl,
  },
  filterSection: {
    gap: Spacing.md,
  },
  filterSectionTitle: {
    fontSize: 16,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  priceInputWrapper: {
    flex: 1,
    gap: Spacing.xs,
  },
  priceLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  priceInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: 15,
  },
  priceSeparator: {
    fontSize: 18,
    marginBottom: Spacing.sm,
  },
  applyButton: {
    marginTop: Spacing.md,
  },
  // Variant Selector Styles
  variantSelectorContent: {
    gap: Spacing.lg,
  },
  variantProductInfo: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  variantProductImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  variantProductDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  variantProductName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  variantProductBrand: {
    fontSize: 14,
  },
  variantsContainer: {
    gap: Spacing.md,
  },
  variantsTitle: {
    fontSize: 16,
  },
  variantsList: {
    maxHeight: 120,
  },
  variantsListContent: {
    gap: Spacing.sm,
  },
  variantOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    minWidth: 70,
    alignItems: 'center',
  },
  variantSizeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  variantStock: {
    fontSize: 11,
    marginTop: 2,
  },
  variantDisabled: {
    opacity: 0.3,
  },
  variantPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  variantPriceLabel: {
    fontSize: 16,
  },
  variantPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  addToCartButton: {
    marginTop: Spacing.sm,
  },
});
