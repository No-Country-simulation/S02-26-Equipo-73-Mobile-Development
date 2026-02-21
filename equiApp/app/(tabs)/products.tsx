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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { useProducts, type SortBy, type Product } from '@/src/services/products.service';
import { ThemedText, ThemedView } from '@/src';

/**
 * Pantalla de productos (pública)
 * Consume la API de productos con scroll infinito
 */
export default function ProductsScreen() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Estado de filtros y paginación
  const [sortBy, setSortBy] = useState<SortBy>('Id');
  const [sortDescending, setSortDescending] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;

  // Obtener productos
  const { data, isLoading, error, refetch } = useProducts({
    SortBy: sortBy,
    SortDescending: sortDescending,
    PageNumber: pageNumber,
    PageSize: pageSize,
    MinPrice: 0,
    MaxPrice: 10000,
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

  // Cambiar ordenamiento
  const handleSortChange = (newSort: SortBy) => {
    setSortBy(newSort);
    setPageNumber(1);
    setAllProducts([]);
    setHasMore(true);
  };

  // Cambiar dirección de ordenamiento
  const handleSortDirectionChange = () => {
    setSortDescending(!sortDescending);
    setPageNumber(1);
    setAllProducts([]);
    setHasMore(true);
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

  // Renderizar cada producto
  const renderProduct = ({ item }: { item: Product }) => {
    const primaryImage = item.media?.find((m) => m.isPrimary)?.url || item.media?.[0]?.url;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        {primaryImage ? (
          <Image source={{ uri: primaryImage }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.noImage]}>
            <ThemedText style={styles.noImageText}>Sin imagen</ThemedText>
          </View>
        )}
        <View style={styles.productInfo}>
          <ThemedText style={styles.productName} numberOfLines={2}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.productBrand}>{item.brandName}</ThemedText>
          <ThemedText style={styles.productCategory}>{item.categoryName}</ThemedText>
          <ThemedText style={styles.productPrice}>${item.price.toFixed(2)}</ThemedText>
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
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay productos disponibles</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type='title'>Catálogo de Productos</ThemedText>
          {!isAuthenticated && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          )}
          {isAuthenticated && (
            <ThemedText type='subtitle'>Hola, {user?.name || user?.email}! 👋</ThemedText>
          )}
        </View>

        {/* Filtros de ordenamiento */}
        <ThemedView style={styles.filtersContainer}>
          <ThemedText style={styles.filtersLabel}>Ordenar por:</ThemedText>
          <View style={styles.sortButtons}>
            {(['Id', 'Name', 'Price'] as SortBy[]).map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[styles.sortButton, sortBy === sort && styles.sortButtonActive]}
                onPress={() => handleSortChange(sort)}
              >
                <ThemedText
                  style={[styles.sortButtonText, sortBy === sort && styles.sortButtonTextActive]}
                >
                  {sort === 'Id' ? 'Recientes' : sort === 'Name' ? 'Nombre' : 'Precio'}
                </ThemedText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.sortButton, styles.orderButton]}
              onPress={handleSortDirectionChange}
            >
              <ThemedText style={styles.orderButtonText}>
                {sortDescending ? '↓ Desc' : '↑ Asc'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Lista de productos */}
        {isLoading && pageNumber === 1 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>Cargando productos...</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>❌ Error al cargar productos</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
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
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
          />
        )}

        {/* Info de resultados */}
        {data && allProducts.length > 0 && (
          <ThemedView style={styles.resultsInfo}>
            <ThemedText style={styles.resultsText}>
              Mostrando {allProducts.length} de {data.totalCount} productos
            </ThemedText>
          </ThemedView>
        )}
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
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  orderButton: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  orderButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    flex: 1,
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '48%',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    // color: '#999',
    fontSize: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  resultsInfo: {
    padding: 12,
    backgroundColor: '#c7c7c7',
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 12,
    color: '#666',
  },
});
