import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser, AuthTokens, LoginCredentials, RegisterData } from '@/src/types/auth.types';
import { apiClient, handleApiError, type ApiResponse } from '@/src/config/api';
import { setToken, clearToken, saveUserData, clearUserData, setRefreshToken } from '@/src/utils/secure-storage';

interface AuthState {
  // Estado
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
  clearError: () => void;
  setInitialized: (value: boolean) => void;
}

/**
 * Store de autenticación con Zustand
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      /**
       * Iniciar sesión
       */
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await apiClient.post<ApiResponse<{
            user: AuthUser;
            accessToken: string;
            refreshToken?: string;
          }>>('/auth/login', credentials);

          const { user, accessToken, refreshToken } = response.data.data!;

          // Guardar tokens de forma segura
          await setToken(accessToken);
          if (refreshToken) {
            await setRefreshToken(refreshToken);
          }
          
          // Guardar datos del usuario
          await saveUserData(user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const apiError = handleApiError(error);
          set({
            isLoading: false,
            error: apiError.message,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      /**
       * Registrar nuevo usuario
       */
      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await apiClient.post<ApiResponse<{
            user: AuthUser;
            accessToken: string;
            refreshToken?: string;
          }>>('/auth/register', data);

          const { user, accessToken, refreshToken } = response.data.data!;

          // Guardar tokens de forma segura
          await setToken(accessToken);
          if (refreshToken) {
            await setRefreshToken(refreshToken);
          }
          
          // Guardar datos del usuario
          await saveUserData(user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const apiError = handleApiError(error);
          set({
            isLoading: false,
            error: apiError.message,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      /**
       * Cerrar sesión
       */
      logout: async () => {
        try {
          // Opcional: Llamar al endpoint de logout en el servidor
          try {
            await apiClient.post('/auth/logout');
          } catch {
            // Ignorar errores del servidor al hacer logout
          }

          // Limpiar tokens y datos
          await clearToken();
          await clearUserData();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Error en logout:', error);
          // Limpiar estado de todas formas
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      /**
       * Verificar autenticación (al iniciar la app)
       */
      checkAuth: async () => {
        try {
          set({ isLoading: true });

          const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
          const user = response.data.data!;

          await saveUserData(user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          // Si falla, limpiar autenticación
          await clearToken();
          await clearUserData();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      /**
       * Actualizar datos del usuario
       */
      updateUser: (userData: Partial<AuthUser>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          saveUserData(updatedUser);
          set({ user: updatedUser });
        }
      },

      /**
       * Limpiar error
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Marcar como inicializado
       */
      setInitialized: (value: boolean) => {
        set({ isInitialized: value });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
