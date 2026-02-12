import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from './env';
import { getToken, clearToken } from '@/src/utils/secure-storage';

/**
 * Instancia principal de Axios configurada con la API_URL
 */
export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de peticiones: Agrega el token de autenticación
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas: Maneja errores globales
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Si el token expiró (401), limpiar autenticación
    if (error.response?.status === 401 && originalRequest) {
      await clearToken();
      // Aquí podrías disparar un evento o actualizar el store de auth
      // useAuthStore.getState().logout();
    }

    // Puedes manejar otros códigos de error aquí
    if (error.response?.status === 403) {
      console.error('Acceso prohibido');
    }

    return Promise.reject(error);
  }
);

/**
 * Tipos de respuesta API personalizados
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Helper para manejar errores de API
 */
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    
    return {
      message: axiosError.response?.data?.message || axiosError.message || 'Error de conexión',
      statusCode: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    };
  }
  
  return {
    message: 'Error desconocido',
  };
};
