import { apiClient, handleApiError } from '@/src/config/api';
import { setToken, setRefreshToken } from '@/src/utils/secure-storage';

/**
 * Respuesta del endpoint de exchange
 */
export interface AuthExchangeResponse {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  name?: string;
  claims?: Array<{
    type: string;
    value: string;
  }>;
  // Cuando el backend implemente el token JWT propio:
  token?: string;
  refreshToken?: string;
}

/**
 * Exchange token de Supabase por token de la API
 * @param supabaseToken - Token de acceso de Supabase
 * @returns Respuesta con la información del usuario autenticado
 */
export const exchangeToken = async (supabaseToken: string): Promise<AuthExchangeResponse> => {
  try {
    console.log('🔄 Intercambiando token con la API...');
    console.log('→ Token de Supabase:', supabaseToken)
    // Hacer la petición al endpoint de exchange
    // El token de Supabase se envía por Bearer
    const response = await apiClient.post<{ data: AuthExchangeResponse }>(
      '/auth/exchange',
      {}, // Body vacío
      {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      }
    );

    const exchangeData = response.data.data;
    
    console.log('✅ Exchange exitoso:', {
      isAuthenticated: exchangeData.isAuthenticated,
      userId: exchangeData.userId,
      email: exchangeData.email,
    });

    // Cuando el backend devuelva su propio token, guardarlo
    if (exchangeData.token) {
      console.log('💾 Guardando token de la API...');
      await setToken(exchangeData.token);
      
      if (exchangeData.refreshToken) {
        await setRefreshToken(exchangeData.refreshToken);
      }
    }

    return exchangeData;
  } catch (error) {
    console.error('❌ Error en exchange de token:', error);
    const apiError = handleApiError(error);
    
    // No bloquear el flujo si el exchange falla
    // El usuario puede seguir usando la app con el token de Supabase
    console.warn('⚠️ Exchange falló, continuando con token de Supabase');
    
    throw new Error(apiError.message || 'Error al intercambiar token');
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
