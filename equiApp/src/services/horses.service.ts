import { apiClient, handleApiError } from '@/src/config/api';
import type {
  Horse,
  HorseReference,
  CreateHorseDto,
  UpdateHorseDto,
} from '@/src/types/horse.types';
import type { ApiResponse } from '@/src/types/common.types';

/**
 * Get reference data for horses (breeds, disciplines, levels)
 * @returns Reference data for creating/editing horses
 */
export const getHorseReference = async (): Promise<ApiResponse<HorseReference>> => {
  try {
    console.log('🐴 Getting horse reference data...');
    
    const response = await apiClient.get<ApiResponse<HorseReference>>('/horses/reference');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error getting horse reference data');
    }

    console.log('✅ Horse reference data retrieved:', {
      breeds: response.data.data.breeds.length,
      disciplines: response.data.data.disciplines.length,
      levels: response.data.data.levels.length,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error getting horse reference data:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error getting horse reference data');
  }
};

/**
 * Get list of user's horses
 * @returns List of horses
 */
export const getHorses = async (): Promise<ApiResponse<Horse[]>> => {
  try {
    console.log('🐴 Getting horses list...');
    
    const response = await apiClient.get<ApiResponse<Horse[]>>('/horses');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error getting horses list');
    }

    console.log('✅ Horses list retrieved:', {
      count: response.data.data?.length || 0,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error getting horses list:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error getting horses list');
  }
};

/**
 * Get horse details by ID
 * @param id - Horse ID
 * @returns Horse details
 */
export const getHorseById = async (id: number): Promise<ApiResponse<Horse>> => {
  try {
    console.log(`🐴 Getting horse ${id} details...`);
    
    const response = await apiClient.get<ApiResponse<Horse>>(`/horses/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error getting horse details');
    }

    console.log('✅ Horse details retrieved:', {
      id: response.data.data.id,
      name: response.data.data.name,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error getting horse details:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error getting horse details');
  }
};

/**
 * Create a new horse
 * @param data - Horse data to create
 * @returns Created horse
 */
export const createHorse = async (data: CreateHorseDto): Promise<ApiResponse<Horse>> => {
  try {
    console.log('🐴 Creating horse...', data);
    
    const response = await apiClient.post<ApiResponse<Horse>>('/horses', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error creating horse');
    }

    console.log('✅ Horse created:', {
      id: response.data.data.id,
      name: response.data.data.name,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error creating horse:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error creating horse');
  }
};

/**
 * Update an existing horse
 * @param id - Horse ID
 * @param data - Data to update
 * @returns Updated horse
 */
export const updateHorse = async (
  id: number,
  data: UpdateHorseDto
): Promise<ApiResponse<Horse>> => {
  try {
    console.log(`🐴 Updating horse ${id}...`, data);
    
    const response = await apiClient.put<ApiResponse<Horse>>(`/horses/${id}`, data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error updating horse');
    }

    console.log('✅ Horse updated:', {
      id: response.data.data.id,
      name: response.data.data.name,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error updating horse:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error updating horse');
  }
};

/**
 * Delete a horse
 * @param id - Horse ID to delete
 */
export const deleteHorse = async (id: number): Promise<void> => {
  try {
    console.log(`🗑️ Deleting horse ${id}...`);
    
    await apiClient.delete(`/horses/${id}`);
    
    console.log('✅ Horse deleted');
  } catch (error) {
    console.error('❌ Error deleting horse:', error);
    const apiError = handleApiError(error);
    throw new Error(apiError.message || 'Error deleting horse');
  }
};
