import { apiClient, handleApiError } from '@/src/config/api';
import type { User, UpdateProfileData } from '@/src/types/user.types';
import type { ApiResponse } from '@/src/types/common.types';

/**
 * Obtiene los datos del usuario actual
 * @returns Datos del usuario
 */
export const getUserData = async (): Promise<ApiResponse<User>> => {
  try {
    console.log('👤 Obteniendo datos del usuario...');
    
    const response = await apiClient.get<ApiResponse<User>>('/user/me');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al obtener datos del usuario');
    }

    console.log('✅ Datos del usuario obtenidos:', {
      id: response.data.data.id,
      email: response.data.data.email,
      firstName: response.data.data.firstName,
      lastName: response.data.data.lastName,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener datos del usuario:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al obtener datos del usuario');
  }
};

/**
 * Actualiza los datos personales del usuario
 * @param data - Datos a actualizar
 * @returns Usuario actualizado
 */
export const updateUserData = async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
  try {
    console.log('💾 Actualizando datos del usuario...', data);
    
    const response = await apiClient.put<ApiResponse<User>>('/user/me', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar datos del usuario');
    }

    console.log('✅ Datos del usuario actualizados:', {
      id: response.data.data.id,
      email: response.data.data.email,
      firstName: response.data.data.firstName,
      lastName: response.data.data.lastName,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar datos del usuario:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al actualizar datos del usuario');
  }
};
