import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/src/config/api';
import { queryKeys } from '@/src/config/query-client';

/**
 * Tipos de la API de productos
 */

export interface ProductMedia {
  id: number;
  url: string;
  mediaType: 'image' | 'video';
  order: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sizeLabel: string;
  sizeSystem: string;
  price: number;
  stock: number;
  isActive: boolean;
  color: string | null;
  material: string | null;
  weight: number | null;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  media: ProductMedia[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
}

export interface SizeGuideSize {
  euLabel: string;
  usLabel: string | null;
  ukLabel: string | null;
  footLengthMinCm: number | null;
  footLengthMaxCm: number | null;
  footLengthMinIn: number | null;
  footLengthMaxIn: number | null;
}

export interface SizeGuide {
  brandId: number;
  brandName: string;
  categoryId: number | null;
  categoryName: string | null;
  sizes: SizeGuideSize[];
}

export interface SizeGuideResponse {
  success: boolean;
  message: string;
  data: SizeGuide;
  errors: string[] | null;
}

export type SortBy = 'Price' | 'Id' | 'Name';

export interface ProductFilters {
  MinPrice?: number;
  MaxPrice?: number;
  SortBy?: SortBy;
  SortDescending?: boolean;
  PageNumber?: number;
  PageSize?: number;
}

export interface PaginatedProducts {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: PaginatedProducts;
  errors: any;
}

/**
 * Servicios de API para productos
 */
export const productService = {
  /**
   * Obtener lista de productos con paginación
   */
  getProducts: async (filters?: ProductFilters): Promise<PaginatedProducts> => {
    const response = await apiClient.get<ProductsResponse>('/Products', {
      params: {
        MinPrice: filters?.MinPrice ?? 0,
        MaxPrice: filters?.MaxPrice,
        SortBy: filters?.SortBy ?? 'Id',
        SortDescending: filters?.SortDescending ?? false,
        PageNumber: filters?.PageNumber ?? 1,
        PageSize: filters?.PageSize ?? 20,
      },
    });
    return response.data.data;
  },

  /**
   * Obtener un producto por ID
   */
  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Product;
      errors: any;
    }>(`/Products/${id}`);
    return response.data.data;
  },

  /**
   * Obtener guía de tallas por marca y categoría
   */
  getSizeGuide: async (brandId: number, categoryId?: number): Promise<SizeGuide> => {
    const response = await apiClient.get<SizeGuideResponse>('/Products/size-guide', {
      params: {
        brandId,
        ...(categoryId && { categoryId }),
      },
    });
    return response.data.data;
  },
};

/**
 * Hook para obtener lista de productos
 */
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener un producto específico
 */
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: queryKeys.products.detail(String(id)),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

/**
 * Hook para obtener guía de tallas
 */
export const useSizeGuide = (brandId?: number, categoryId?: number) => {
  return useQuery({
    queryKey: ['sizeGuide', brandId, categoryId],
    queryFn: () => productService.getSizeGuide(brandId!, categoryId),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 60, // 1 hora (las guías de tallas no cambian frecuentemente)
  });
};
