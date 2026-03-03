import { useAuthStore } from '@/src/stores/auth.store';
import { useUserStore } from '@/src/stores/user.store';
import { getToken } from '@/src/utils/secure-storage';
import type { LoginCredentials, RegisterData } from '@/src/types/auth.types';
import { useEffect, useState } from 'react';

/**
 * Hook personalizado para manejar autenticación con Supabase
 * Todo el estado está centralizado en Zustand
 */
export const useAuth = () => {
  const {
    user,
    session,
    profile,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login: loginAction,
    register: registerAction,
    logout: logoutAction,
    checkAuth,
    updateUser,
    clearError,
  } = useAuthStore();

  const { clearProfile } = useUserStore();
  const [hasApiToken, setHasApiToken] = useState(false);

  // Verificar si existe token de API
  useEffect(() => {
    const checkApiToken = async () => {
      const apiToken = await getToken();
      setHasApiToken(!!apiToken);
    };
    checkApiToken();
  }, [session]);

  /**
   * Usuario está completamente autenticado si tiene sesión de Supabase Y token de API
   */
  const isFullyAuthenticated = isAuthenticated && !!session && hasApiToken;

  /**
   * Iniciar sesión
   */
  const login = async (credentials: LoginCredentials) => {
    await loginAction(credentials);
  };

  /**
   * Registrar usuario
   */
  const register = async (data: RegisterData) => {
    await registerAction(data);
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    await logoutAction();
    clearProfile();
  };

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuth = (): boolean => {
    return isAuthenticated && !!user && !!session;
  };

  return {
    // Estado
    user,
    session,
    profile,
    isAuthenticated: isFullyAuthenticated,
    isLoading,
    isInitialized,
    error,
    hasApiToken,

    // Acciones
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    clearError,

    // Utilidades
    hasRole,
    isAuth,
  };
};
