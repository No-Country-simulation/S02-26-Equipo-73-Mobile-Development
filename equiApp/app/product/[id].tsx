import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView, ThemedText, ThemedActionSheet } from '@/src';
import { useProduct, useSizeGuide, type ProductVariant } from '@/src/services/products.service';
import { Colors, Spacing, BorderRadius } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import { useCart } from '@/src/stores/cart.store';

const { width } = Dimensions.get('window');

/**
 * Pantalla de detalle de producto
 * Diseño moderno con carousel, selección de variantes y análisis de compatibilidad
 */
export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id || '0');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { addItem } = useCart();
  const insets = useSafeAreaInsets();

  const { data: product, isLoading, error } = useProduct(productId);
  
  // Obtener size guide
  const { data: sizeGuide } = useSizeGuide(product?.brandId, product?.categoryId);

  // Estados locales
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Obtener tamaños únicos de las variantes activas
  const availableSizes = useMemo(() => {
    if (!product?.variants) return [];
    const uniqueSizes = new Map<string, ProductVariant>();
    product.variants.forEach(v => {
      if (v.isActive && !uniqueSizes.has(v.sizeLabel)) {
        uniqueSizes.set(v.sizeLabel, v);
      }
    });
    return Array.from(uniqueSizes.values());
  }, [product]);

  // Obtener colores disponibles para el tamaño seleccionado
  const availableColors = useMemo(() => {
    if (!product?.variants || !selectedSize) return [];
    const variantsForSize = product.variants.filter(
      v => v.isActive && v.sizeLabel === selectedSize && v.color
    );
    const uniqueColors = new Map<string, ProductVariant>();
    variantsForSize.forEach(v => {
      if (v.color && !uniqueColors.has(v.color)) {
        uniqueColors.set(v.color, v);
      }
    });
    return Array.from(uniqueColors.values());
  }, [product, selectedSize]);

  // Obtener variante seleccionada según tamaño y color
  const selectedVariant = useMemo(() => {
    if (!product?.variants || !selectedSize) return null;
    
    // Si hay color seleccionado, buscar por tamaño + color
    if (selectedColor) {
      return product.variants.find(
        v => v.isActive && v.sizeLabel === selectedSize && v.color === selectedColor
      );
    }
    
    // Si no hay color, buscar por tamaño solamente
    return product.variants.find(
      v => v.isActive && v.sizeLabel === selectedSize
    );
  }, [product, selectedSize, selectedColor]);

  // Obtener disciplina de las especificaciones
  const discipline = useMemo(() => {
    if (!product?.specifications) return null;
    const disciplineSpec = product.specifications.find(
      spec => spec.key.toLowerCase() === 'discipline' || spec.key.toLowerCase() === 'disciplina'
    );
    return disciplineSpec?.value || null;
  }, [product]);

  // Seleccionar primer tamaño por defecto
  useMemo(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0].sizeLabel);
    }
  }, [availableSizes, selectedSize]);

  // Seleccionar primer color por defecto cuando cambia el tamaño
  useMemo(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0].color);
    } else if (availableColors.length === 0) {
      setSelectedColor(null);
    }
  }, [availableColors, selectedColor]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>Cargando producto...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ Error al cargar el producto</ThemedText>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]} 
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const images = product.media && product.media.length > 0 
    ? product.media.map(m => m.url)
    : ['https://via.placeholder.com/400'];

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      Alert.alert('Selecciona una talla', 'Por favor selecciona una talla antes de agregar al carrito');
      return;
    }

    if (selectedVariant.stock === 0) {
      Alert.alert('Sin stock', 'Este producto no está disponible en este momento');
      return;
    }

    addItem(product, selectedVariant, 1);
    
    Alert.alert(
      '¡Agregado al carrito!',
      `${product.name}\nTalla: ${selectedVariant.sizeLabel}${selectedVariant.color ? `\nColor: ${selectedVariant.color}` : ''}`,
      [
        { text: 'Seguir comprando', style: 'cancel' },
        { 
          text: 'Ver carrito', 
          onPress: () => router.push('/(tabs)/cart')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header flotante */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerRightButtons}>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              onPress={() => {/* TODO: Compartir */}}
            >
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Ionicons 
                name={isFavorite ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Carousel de imágenes */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              keyExtractor={(item, index) => `image-${index}`}
              renderItem={({ item }) => (
                <Image 
                  source={{ uri: item }} 
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              )}
            />
            
            {/* Indicadores de página */}
            <View style={styles.paginationContainer}>
              {images.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[
                    styles.paginationDot,
                    {
                      backgroundColor: currentImageIndex === index 
                        ? colors.accent 
                        : 'rgba(255,255,255,0.5)',
                      width: currentImageIndex === index ? 24 : 6,
                    }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Contenido principal */}
          <View style={[styles.content, { backgroundColor: colors.background }]}>
            {/* Nombre y precio */}
            <View style={styles.titleSection}>
              <View style={styles.titleLeft}>
                <ThemedText type="title" style={styles.productName}>
                  {product.name}
                </ThemedText>
                
                {/* Rating - simulado */}
                {/* <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons 
                      key={star} 
                      name="star" 
                      size={14} 
                      color="#FFB800" 
                    />
                  ))}
                  <ThemedText style={styles.reviewCount}>(42 Reviews)</ThemedText>
                </View> */}
              </View>
              
              <View style={styles.priceSection}>
                <ThemedText style={styles.priceLabel}>Price</ThemedText>
                <ThemedText style={[styles.price, { color: colors.accent }]}>
                  ${selectedVariant?.price?.toFixed(2) || product.price.toFixed(2)}
                </ThemedText>
              </View>
            </View>

            {/* 98% Match Card */}
            {/* <View style={[styles.matchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.matchLeft}>
                <View style={[styles.matchIconContainer, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="analytics" size={24} color={colors.accent} />
                </View>
                <View>
                  <ThemedText type="defaultSemiBold" style={styles.matchTitle}>
                    98% Match
                  </ThemedText>
                  <ThemedText style={styles.matchSubtitle}>
                    for 'Midnight Star'
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity>
                <ThemedText style={[styles.viewAnalysisButton, { color: colors.accent }]}>
                  View Analysis
                </ThemedText>
              </TouchableOpacity>
            </View> */}

            {/* Selector de tamaño */}
            {availableSizes.length > 0 && (
              <View style={styles.selectorSection}>
                <View style={styles.selectorHeader}>
                  <ThemedText type="defaultSemiBold">Select Size</ThemedText>
                  <TouchableOpacity onPress={() => setShowSizeGuide(true)}>
                    <ThemedText style={[styles.guideLink, { color: colors.accent }]}>
                      Size Guide
                    </ThemedText>
                  </TouchableOpacity>
                </View>
                <View style={styles.sizeOptions}>
                  {availableSizes.map((variant) => {
                    const isSelected = selectedSize === variant.sizeLabel;
                    const isOutOfStock = variant.stock === 0;
                    return (
                      <TouchableOpacity
                        key={variant.id}
                        style={[
                          styles.sizeButton,
                          {
                            backgroundColor: isSelected ? colors.card : colors.card,
                            borderColor: isSelected ? colors.accent : colors.border,
                            borderWidth: 2,
                            opacity: isOutOfStock ? 0.4 : 1
                          }
                        ]}
                        onPress={() => {
                          if (!isOutOfStock) {
                            setSelectedSize(variant.sizeLabel);
                            setSelectedColor(null); // Reset color al cambiar tamaño
                          }
                        }}
                        disabled={isOutOfStock}
                      >
                        <ThemedText 
                          style={[
                            styles.sizeText,
                            { color: isSelected ? colors.accent : colors.text }
                          ]}
                        >
                          {variant.sizeLabel}
                        </ThemedText>
                        {isSelected && (
                          <View style={[styles.checkmark, { backgroundColor: colors.accent }]}>
                            <Ionicons name="checkmark" size={10} color="#fff" />
                          </View>
                        )}
                        {variant.stock < 5 && variant.stock > 0 && (
                          <ThemedText style={styles.lowStockBadge}>
                            {variant.stock} left
                          </ThemedText>
                        )}
                        {isOutOfStock && (
                          <ThemedText style={styles.outOfStockText}>Out</ThemedText>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Selector de color */}
            {availableColors.length > 0 && selectedSize && (
              <View style={styles.selectorSection}>
                <ThemedText type="defaultSemiBold">
                  Color {availableColors.length > 1 ? `(${availableColors.length} disponibles para talla ${selectedSize})` : ''}
                </ThemedText>
                <View style={styles.colorOptions}>
                  {availableColors.map((variant) => {
                    const isSelected = selectedColor === variant.color;
                    const isOutOfStock = variant.stock === 0;
                    return (
                      <TouchableOpacity
                        key={variant.id}
                        style={[
                          styles.colorButton,
                          {
                            borderColor: isSelected ? colors.accent : 'transparent',
                            opacity: isOutOfStock ? 0.4 : 1
                          }
                        ]}
                        onPress={() => !isOutOfStock && setSelectedColor(variant.color)}
                        disabled={isOutOfStock}
                      >
                        <View 
                          style={[
                            styles.colorCircle, 
                            { backgroundColor: variant.color || colors.border }
                          ]} 
                        />
                        {isOutOfStock && (
                          <View style={styles.colorOutOfStock}>
                            <Ionicons name="close" size={24} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Descripción */}
            <View style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Description
              </ThemedText>
              <ThemedText style={styles.description}>
                {product.description || "Engineered with a lightweight carbon fiber tree and premium French calfskin, the Aero-Form reduces weight by 20% while maximizing close contact. The ergonomic panels are designed to free the horse's shoulder for extended movement."}
              </ThemedText>
            </View>

            {/* Especificaciones */}
            <View style={styles.specsContainer}>
              {selectedVariant?.weight && (
                <View style={styles.specCard}>
                  <View style={[styles.specIcon, { backgroundColor: colors.accent + '20' }]}>
                    <Ionicons name="barbell-outline" size={24} color={colors.accent} />
                  </View>
                  <ThemedText style={styles.specLabel}>WEIGHT</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.specValue}>
                    {selectedVariant.weight}kg
                  </ThemedText>
                </View>
              )}

              {selectedVariant?.material && (
                <View style={styles.specCard}>
                  <View style={[styles.specIcon, { backgroundColor: colors.accent + '20' }]}>
                    <Ionicons name="shirt-outline" size={24} color={colors.accent} />
                  </View>
                  <ThemedText style={styles.specLabel}>MATERIAL</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.specValue}>
                    {selectedVariant.material}
                  </ThemedText>
                </View>
              )}

              {discipline ? (
                <View style={styles.specCard}>
                  <View style={[styles.specIcon, { backgroundColor: colors.accent + '20' }]}>
                    <Ionicons name="ribbon-outline" size={24} color={colors.accent} />
                  </View>
                  <ThemedText style={styles.specLabel}>DISCIPLINE</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.specValue}>
                    {discipline}
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.specCard}>
                  <View style={[styles.specIcon, { backgroundColor: colors.accent + '20' }]}>
                    <Ionicons name="pricetag-outline" size={24} color={colors.accent} />
                  </View>
                  <ThemedText style={styles.specLabel}>CATEGORY</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.specValue}>
                    {product.categoryName}
                  </ThemedText>
                </View>
              )}

              {selectedVariant && (
                <View style={styles.specCard}>
                  <View style={[styles.specIcon, { backgroundColor: colors.accent + '20' }]}>
                    <Ionicons name="cube-outline" size={24} color={colors.accent} />
                  </View>
                  <ThemedText style={styles.specLabel}>STOCK</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.specValue}>
                    {selectedVariant.stock} units
                  </ThemedText>
                </View>
              )}
            </View>

            {/* EquiData Insight */}
            <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.insightHeader}>
                <Ionicons name="sparkles" size={20} color={colors.accent} />
                <ThemedText type="defaultSemiBold" style={styles.insightTitle}>
                  EquiData Insight
                </ThemedText>
              </View>
              <ThemedText style={styles.insightText}>
                Based on your last 3 riding sessions, this saddle's deep seat aligns perfectly with your improving sitting trot metrics. The narrow twist supports your hip geometry.
              </ThemedText>
            </View>

            {/* Espaciado para el bottom bar */}
            <View style={{ height: 120 }} />
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={[
          styles.bottomBar, 
          { 
            backgroundColor: colors.card, 
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.md,
          }
        ]}>
          <TouchableOpacity 
            style={[styles.chatButton, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={() => {/* TODO: Abrir chat */}}
          >
            <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.addToCartButton, 
              { backgroundColor: (!selectedVariant || selectedVariant.stock === 0) ? colors.border : colors.accent }
            ]}
            onPress={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
          >
            <Text style={[styles.addToCartText, (!selectedVariant || selectedVariant.stock === 0) && { opacity: 0.6 }]}>
              {!selectedVariant ? 'Select Size' : selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Text>
            <View style={styles.priceTag}>
              <Ionicons name="pricetag" size={16} color={colors.accent} />
              <Text style={[styles.priceTagText, { color: colors.accent }]}>
                ${selectedVariant?.price.toFixed(0) || product.price.toFixed(0)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Size Guide Modal */}
        <ThemedActionSheet
          visible={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          title="Size Guide"
          snapPoint="large"
          scrollable
        >
          {sizeGuide ? (
            <View style={styles.sizeGuideContent}>
              <View style={styles.sizeGuideHeader}>
                <ThemedText type="defaultSemiBold" style={styles.sizeGuideBrand}>
                  {sizeGuide.brandName}
                  {sizeGuide.categoryName && ` - ${sizeGuide.categoryName}`}
                </ThemedText>
              </View>

              <View style={styles.sizeGuideTable}>
                <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: colors.card }]}>
                  <ThemedText style={[styles.tableCell, styles.tableCellHeader]}>EU</ThemedText>
                  <ThemedText style={[styles.tableCell, styles.tableCellHeader]}>US</ThemedText>
                  <ThemedText style={[styles.tableCell, styles.tableCellHeader]}>UK</ThemedText>
                  <ThemedText style={[styles.tableCell, styles.tableCellHeader]}>CM</ThemedText>
                </View>
                
                {sizeGuide.sizes.map((size, index) => (
                  <View 
                    key={`${size.euLabel}-${index}`}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 && { backgroundColor: colors.card + '50' }
                    ]}
                  >
                    <ThemedText style={styles.tableCell}>{size.euLabel}</ThemedText>
                    <ThemedText style={styles.tableCell}>{size.usLabel || '-'}</ThemedText>
                    <ThemedText style={styles.tableCell}>{size.ukLabel || '-'}</ThemedText>
                    <ThemedText style={styles.tableCell}>
                      {size.footLengthMinCm && size.footLengthMaxCm 
                        ? `${size.footLengthMinCm}-${size.footLengthMaxCm}`
                        : '-'
                      }
                    </ThemedText>
                  </View>
                ))}
              </View>

              <View style={[styles.sizeGuideNote, { backgroundColor: colors.card }]}>
                <Ionicons name="information-circle" size={20} color={colors.accent} />
                <ThemedText style={styles.sizeGuideNoteText}>
                  Measure your foot length for the most accurate fit. If between sizes, we recommend sizing up.
                </ThemedText>
              </View>
            </View>
          ) : (
            <View style={styles.sizeGuideLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
              <ThemedText style={styles.sizeGuideLoadingText}>Loading size guide...</ThemedText>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  carouselContainer: {
    position: 'relative',
  },
  carouselImage: {
    width: width,
    height: width * 1.1,
    backgroundColor: '#000',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
  },
  content: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -20,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  titleLeft: {
    flex: 1,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    lineHeight: 34,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  matchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  matchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  matchIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 16,
  },
  matchSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  viewAnalysisButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectorSection: {
    marginBottom: Spacing.lg,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  guideLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sizeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowStockBadge: {
    position: 'absolute',
    bottom: 4,
    fontSize: 9,
    opacity: 0.6,
  },
  outOfStockText: {
    position: 'absolute',
    bottom: 4,
    fontSize: 8,
    fontWeight: '600',
    opacity: 0.6,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  colorButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorOutOfStock: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.7,
  },
  specsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  specCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  specIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  specLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  specValue: {
    fontSize: 14,
  },
  insightCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  insightTitle: {
    fontSize: 16,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.sm,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    gap: 4,
  },
  priceTagText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sizeGuideContent: {
    gap: Spacing.lg,
  },
  sizeGuideHeader: {
    marginBottom: Spacing.sm,
  },
  sizeGuideBrand: {
    fontSize: 16,
  },
  sizeGuideTable: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  tableCellHeader: {
    fontWeight: '600',
  },
  sizeGuideNote: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  sizeGuideNoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  sizeGuideLoading: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  sizeGuideLoadingText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
