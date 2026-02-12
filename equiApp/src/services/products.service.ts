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
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
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
