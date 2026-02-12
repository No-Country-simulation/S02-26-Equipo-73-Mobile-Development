/**
 * Tipos comunes utilizados en toda la aplicación
 */

// Tipos de paginación
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Tipos de filtros comunes
export interface DateRange {
  from?: Date | string;
  to?: Date | string;
}

export interface PriceRange {
  min?: number;
  max?: number;
}

// Tipos de respuesta base
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Estados de carga
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
}

// Tipos de imagen/archivo
export interface ImageFile {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

// Tipos de notificación
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Tipos de búsqueda
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
}

// Tipos de acciones CRUD
export type CRUDAction = 'create' | 'read' | 'update' | 'delete';

// Helper types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Omit multiple keys
export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Make specific properties required
export type RequireProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Make specific properties partial
export type PartialProperties<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
