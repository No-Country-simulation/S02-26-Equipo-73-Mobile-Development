import { apiClient, handleApiError } from '@/src/config/api';
import { setToken, setRefreshToken } from '@/src/utils/secure-storage';
import type { AuthExchangeResponse, UserMeResponse, ChangePasswordData } from '@/src/types/auth.types';

/**
 * Exchange token de Supabase por token de la API
 * @param supabaseToken - Token de acceso de Supabase
 * @returns Respuesta con la información del usuario autenticado
 */
export const exchangeToken = async (supabaseToken: string): Promise<AuthExchangeResponse> => {
  try {
    console.log('🔄 Intercambiando token con la API...');
    
    // Hacer la petición al endpoint de exchange
    const response = await apiClient.post<AuthExchangeResponse>(
      '/auth/exchange',
      {}, // Body vacío
      {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      }
    );

    const exchangeData = response.data;
    
    if (!exchangeData.success || !exchangeData.data) {
      throw new Error(exchangeData.message || 'Error en el intercambio de token');
    }

    console.log('✅ Exchange exitoso:', {
      isAuthenticated: exchangeData.data.isAuthenticated,
      userId: exchangeData.data.userId,
      email: exchangeData.data.email,
    });

    // Guardar el token de la API
    if (exchangeData.data.accessToken) {
      console.log('💾 Guardando token de la API...');
      await setToken(exchangeData.data.accessToken);
      
      if (exchangeData.data.refreshToken) {
        await setRefreshToken(exchangeData.data.refreshToken);
      }
    }

    return exchangeData;
  } catch (error: any) {
    console.error('❌ Error en exchange de token:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // Manejar específicamente el error 400/401
    if (error.response?.status === 400 || error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || 'Token inválido o expirado';
      throw new Error(`Exchange token falló: ${errorMessage}`);
    }
    
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al intercambiar token');
  }
};

/**
 * Obtiene la información del usuario autenticado actual
 * @returns Datos del usuario desde el endpoint /me
 */
export const getUserProfile = async (): Promise<UserMeResponse> => {
  try {
    console.log('👤 Obteniendo perfil del usuario...');
    
    const response = await apiClient.get<UserMeResponse>('/auth/me');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al obtener perfil del usuario');
    }

    console.log('✅ Perfil obtenido:', {
      userId: response.data.data.userId,
      email: response.data.data.email,
      role: response.data.data.role,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener perfil del usuario:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al obtener perfil del usuario');
  }
};

/**
 * Cambia la contraseña del usuario
 * @param data - Datos para cambiar la contraseña
 */
export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  try {
    console.log('🔐 Cambiando contraseña...');
    
    const response = await apiClient.post('/auth/change-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    console.log('✅ Contraseña cambiada exitosamente');
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al cambiar contraseña');
  }
};

/**
 * Verifica si el token actual es válido
 * Útil para refresh de tokens
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/auth/verify');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
