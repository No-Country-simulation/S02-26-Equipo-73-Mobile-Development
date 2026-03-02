import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/src/config/api';
import { queryKeys } from '@/src/config/query-client';
import type {
  Horse,
  HorseReference,
  CreateHorseDto,
  UpdateHorseDto,
} from '@/src/types/horse.types';
import type { ApiResponse } from '@/src/types/common.types';

/**
 * Horse API Services
 */
export const horseService = {
  /**
   * Get reference data for horses (breeds, disciplines, levels)
   */
  getReference: async (): Promise<HorseReference> => {
    const response = await apiClient.get<ApiResponse<HorseReference>>('/horses/reference');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error getting horse reference data');
    }

    return response.data.data;
  },

  /**
   * Get list of user's horses
   */
  getHorses: async (): Promise<Horse[]> => {
    const response = await apiClient.get<ApiResponse<Horse[]>>('/horses');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error getting horses list');
    }

    return response.data.data || [];
  },

  /**
   * Get horse details by ID
   */
  getHorseById: async (id: number): Promise<Horse> => {
    const response = await apiClient.get<ApiResponse<Horse>>(`/horses/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error getting horse details');
    }

    return response.data.data;
  },

  /**
   * Create a new horse
   */
  createHorse: async (data: CreateHorseDto): Promise<Horse> => {
    const response = await apiClient.post<ApiResponse<Horse>>('/horses', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error creating horse');
    }

    return response.data.data;
  },

  /**
   * Update an existing horse
   */
  updateHorse: async (id: number, data: UpdateHorseDto): Promise<Horse> => {
    const response = await apiClient.put<ApiResponse<Horse>>(`/horses/${id}`, data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error updating horse');
    }

    return response.data.data;
  },

  /**
   * Delete a horse
   */
  deleteHorse: async (id: number): Promise<void> => {
    await apiClient.delete(`/horses/${id}`);
  },
};

/**
 * Hook to get horse reference data
 */
export const useHorseReference = () => {
  return useQuery({
    queryKey: queryKeys.horses.reference,
    queryFn: () => horseService.getReference(),
    staleTime: 1000 * 60 * 30, // 30 minutes (reference data doesn't change often)
  });
};

/**
 * Hook to get list of horses
 */
export const useHorses = () => {
  return useQuery({
    queryKey: queryKeys.horses.list,
    queryFn: () => horseService.getHorses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get a specific horse
 */
export const useHorse = (id: number | null) => {
  return useQuery({
    queryKey: queryKeys.horses.detail(id!),
    queryFn: () => horseService.getHorseById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to create a horse
 */
export const useCreateHorse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHorseDto) => horseService.createHorse(data),
    onSuccess: () => {
      // Invalidate horses list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.horses.list });
    },
  });
};

/**
 * Hook to update a horse
 */
export const useUpdateHorse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHorseDto }) =>
      horseService.updateHorse(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific horse
      queryClient.invalidateQueries({ queryKey: queryKeys.horses.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.horses.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a horse
 */
export const useDeleteHorse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => horseService.deleteHorse(id),
    onSuccess: (_, id) => {
      // Invalidate list and remove the specific horse from cache
      queryClient.invalidateQueries({ queryKey: queryKeys.horses.list });
      queryClient.removeQueries({ queryKey: queryKeys.horses.detail(id) });
    },
  });
};

// Legacy exports for backward compatibility (deprecated, use hooks instead)
export const getHorseReference = horseService.getReference;
export const getHorses = horseService.getHorses;
export const getHorseById = horseService.getHorseById;
export const createHorse = horseService.createHorse;
export const updateHorse = horseService.updateHorse;
export const deleteHorse = horseService.deleteHorse;
