import { useAuthStore } from '@/src/stores/auth.store';
import { useUserStore } from '@/src/stores/user.store';
import type { LoginCredentials, RegisterData } from '@/src/types/auth.types';

/**
 * Hook personalizado para manejar autenticación
 */
export const useAuth = () => {
  const {
    user,
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
    return isAuthenticated && !!user;
  };

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,

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
