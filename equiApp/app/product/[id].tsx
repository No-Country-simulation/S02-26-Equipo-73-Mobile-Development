import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProduct } from '@/src/services/products.service';

const { width } = Dimensions.get('window');

/**
 * Pantalla de detalle de producto
 * Accesible desde la lista de productos
 */
export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id || '0');

  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Error al cargar el producto</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  }

  const primaryImage = product.media?.find((m) => m.isPrimary)?.url || product.media?.[0]?.url;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Imagen principal */}
      {primaryImage ? (
        <Image source={{ uri: primaryImage }} style={styles.mainImage} resizeMode="cover" />
      ) : (
        <View style={[styles.mainImage, styles.noImage]}>
          <Text style={styles.noImageText}>Sin imagen</Text>
        </View>
      )}

      {/* Galería de imágenes */}
      {product.media && product.media.length > 1 && (
        <ScrollView horizontal style={styles.gallery} showsHorizontalScrollIndicator={false}>
          {product.media.map((media) => (
            <Image
              key={media.id}
              source={{ uri: media.url }}
              style={styles.galleryImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Información del producto */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        
        <View style={styles.metaInfo}>
          <Text style={styles.brand}>🏷️ {product.brandName}</Text>
          <Text style={styles.category}>📦 {product.categoryName}</Text>
        </View>

        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        <View style={styles.divider} />

        <Text style={styles.descriptionTitle}>Descripción</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Variantes (si existen) */}
        {product.variants && product.variants.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.variantsTitle}>Variantes disponibles</Text>
            {product.variants.map((variant) => (
              <View key={variant.id} style={styles.variantCard}>
                <Text style={styles.variantName}>{variant.name}</Text>
                {variant.price && (
                  <Text style={styles.variantPrice}>${variant.price.toFixed(2)}</Text>
                )}
                {variant.stock !== undefined && (
                  <Text style={styles.variantStock}>Stock: {variant.stock}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>🛒 Agregar al carrito</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.favoriteButton}>
            <Text style={styles.favoriteButtonText}>❤️</Text>
          </TouchableOpacity>
        </View>

        {/* Info adicional */}
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoText}>
            ✅ Producto {product.isActive ? 'disponible' : 'no disponible'}
          </Text>
          <Text style={styles.additionalInfoText}>📍 Envío a todo el país</Text>
          <Text style={styles.additionalInfoText}>🔒 Compra segura</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 24,
    textAlign: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  mainImage: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#f0f0f0',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 16,
  },
  gallery: {
    padding: 16,
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  brand: {
    fontSize: 14,
    color: '#666',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  variantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  variantCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  variantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  variantPrice: {
    fontSize: 14,
    color: '#007AFF',
  },
  variantStock: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 56,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  additionalInfo: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#666',
  },
});
