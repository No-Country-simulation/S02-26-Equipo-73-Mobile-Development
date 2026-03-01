import { apiClient, handleApiError } from '@/src/config/api';
import type {
  Measurement,
  MeasurementReference,
  CreateMeasurementDto,
  UpdateMeasurementDto,
} from '@/src/types/measurement.types';
import type { ApiResponse } from '@/src/types/common.types';

/**
 * Obtiene la referencia de tipos de medidas y unidades disponibles
 * @returns Referencia de mediciones
 */
export const getMeasurementReference = async (): Promise<ApiResponse<MeasurementReference>> => {
  try {
    console.log('📏 Obteniendo referencia de mediciones...');
    
    const response = await apiClient.get<ApiResponse<MeasurementReference>>('/Measurement/reference');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al obtener referencia de mediciones');
    }

    console.log('✅ Referencia de mediciones obtenida:', {
      entityTypes: response.data.data.entityTypes.length,
      units: response.data.data.units.length,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener referencia de mediciones:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al obtener referencia de mediciones');
  }
};

/**
 * Obtiene las mediciones del usuario actual
 * @returns Lista de mediciones del usuario
 */
export const getUserMeasurements = async (): Promise<ApiResponse<Measurement[]>> => {
  try {
    console.log('📏 Obteniendo mediciones del usuario...');
    
    const response = await apiClient.get<ApiResponse<Measurement[]>>('/user/measurements');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener mediciones del usuario');
    }

    console.log('✅ Mediciones del usuario obtenidas:', {
      count: response.data.data?.length || 0,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener mediciones del usuario:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al obtener mediciones del usuario');
  }
};

/**
 * Crea una nueva medición para el usuario
 * @param data - Datos de la medición a crear
 * @returns Medición creada
 */
export const createUserMeasurement = async (
  data: CreateMeasurementDto
): Promise<ApiResponse<Measurement>> => {
  try {
    console.log('📏 Creando medición del usuario...', data);
    
    const response = await apiClient.post<ApiResponse<Measurement>>('/user/measurements', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al crear medición');
    }

    console.log('✅ Medición creada:', {
      id: response.data.data.id,
      type: response.data.data.measurementTypeName,
      value: response.data.data.value,
      unit: response.data.data.unitSymbol,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al crear medición:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al crear medición');
  }
};

/**
 * Actualiza una medición existente del usuario
 * @param id - ID de la medición
 * @param data - Datos a actualizar
 * @returns Medición actualizada
 */
export const updateUserMeasurement = async (
  id: number,
  data: UpdateMeasurementDto
): Promise<ApiResponse<Measurement>> => {
  try {
    console.log(`📏 Actualizando medición ${id}...`, data);
    
    const response = await apiClient.put<ApiResponse<Measurement>>(
      `/user/measurements/${id}`,
      data
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar medición');
    }

    console.log('✅ Medición actualizada:', {
      id: response.data.data.id,
      type: response.data.data.measurementTypeName,
      value: response.data.data.value,
      unit: response.data.data.unitSymbol,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar medición:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al actualizar medición');
  }
};

/**
 * Elimina una medición del usuario
 * @param id - ID de la medición a eliminar
 */
export const deleteUserMeasurement = async (id: number): Promise<void> => {
  try {
    console.log(`🗑️ Eliminando medición ${id}...`);
    
    await apiClient.delete(`/user/measurements/${id}`);
    
    console.log('✅ Medición eliminada');
  } catch (error) {
    console.error('❌ Error al eliminar medición:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error al eliminar medición');
  }
};
