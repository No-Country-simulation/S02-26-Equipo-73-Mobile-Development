/**
 * Archivo central de exportaciones para facilitar imports
 */

// Config
export { ENV, validateEnv } from './config/env';
export { apiClient, handleApiError, type ApiResponse, type ApiError } from './config/api';
export { queryClient, queryKeys } from './config/query-client';

// Stores
export { useAuthStore } from './stores/auth.store';
export { useUserStore } from './stores/user.store';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useUser } from './hooks/useUser';

// Providers
export { AppProvider } from './providers/AppProvider';

// Components
export { ProtectedRoute, PublicRoute, withAuth } from './components/auth';

// Types
export type * from './types/auth.types';
export type * from './types/user.types';

// Schemas
export * from './schemas/auth.schema';

// Utils
export {
  secureStore,
  getToken,
  setToken,
  clearToken,
  getRefreshToken,
  setRefreshToken,
  saveUserData,
  getUserData,
  clearUserData,
  savePreferences,
  getPreferences,
} from './utils/secure-storage';
