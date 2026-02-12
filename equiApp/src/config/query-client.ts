import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

/**
 * Configuración de React Query
 */
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Tiempo en ms antes de considerar los datos como obsoletos
      staleTime: 1000 * 60 * 5, // 5 minutos
      
      // Tiempo que se mantienen los datos en cache sin usar
      gcTime: 1000 * 60 * 10, // 10 minutos (antes cacheTime)
      
      // Reintentar fallos automáticamente
      retry: 2,
      
      // No refetch automático en ciertos eventos por defecto
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
};

/**
 * Instancia del QueryClient
 */
export const queryClient = new QueryClient(queryClientConfig);

/**
 * Keys para las queries (mantener organizadas)
 */
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
    profile: ['auth', 'profile'] as const,
  },
  // Products
  products: {
    all: ['products'] as const,
    list: (filters?: any) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    categories: ['products', 'categories'] as const,
  },
  // User
  user: {
    profile: ['user', 'profile'] as const,
    orders: ['user', 'orders'] as const,
    favorites: ['user', 'favorites'] as const,
  },
} as const;
