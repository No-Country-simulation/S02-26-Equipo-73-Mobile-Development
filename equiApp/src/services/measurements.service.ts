import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/src/config/api';
import { queryKeys } from '@/src/config/query-client';
import type {
  Measurement,
  MeasurementReference,
  CreateMeasurementDto,
  UpdateMeasurementDto,
} from '@/src/types/measurement.types';
import type { ApiResponse } from '@/src/types/common.types';

/**
 * Measurement API Services
 */
export const measurementService = {
  /**
   * Get reference data for measurements (types, units)
   */
  getReference: async (): Promise<MeasurementReference> => {
    const response = await apiClient.get<ApiResponse<MeasurementReference>>('/Measurement/reference');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error getting measurement reference data');
    }

    return response.data.data;
  },

  /**
   * Get user measurements
   */
  getUserMeasurements: async (): Promise<Measurement[]> => {
    const response = await apiClient.get<ApiResponse<Measurement[]>>('/user/measurements');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error getting user measurements');
    }

    return response.data.data || [];
  },

  /**
   * Create a new user measurement
   */
  createUserMeasurement: async (data: CreateMeasurementDto): Promise<Measurement> => {
    const response = await apiClient.post<ApiResponse<Measurement>>('/user/measurements', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error creating measurement');
    }

    return response.data.data;
  },

  /**
   * Update an existing user measurement
   */
  updateUserMeasurement: async (id: number, data: UpdateMeasurementDto): Promise<Measurement> => {
    const response = await apiClient.put<ApiResponse<Measurement>>(
      `/user/measurements/${id}`,
      data
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error updating measurement');
    }

    return response.data.data;
  },

  /**
   * Delete a user measurement
   */
  deleteUserMeasurement: async (id: number): Promise<void> => {
    await apiClient.delete(`/user/measurements/${id}`);
  },
};

/**
 * Hook to get measurement reference data
 */
export const useMeasurementReference = () => {
  return useQuery({
    queryKey: queryKeys.measurements.reference,
    queryFn: () => measurementService.getReference(),
    staleTime: 1000 * 60 * 30, // 30 minutes (reference data doesn't change often)
  });
};

/**
 * Hook to get user measurements
 */
export const useUserMeasurements = () => {
  return useQuery({
    queryKey: queryKeys.measurements.user,
    queryFn: () => measurementService.getUserMeasurements(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to create a user measurement
 */
export const useCreateUserMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeasurementDto) => measurementService.createUserMeasurement(data),
    onSuccess: () => {
      // Invalidate user measurements to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.measurements.user });
    },
  });
};

/**
 * Hook to update a user measurement
 */
export const useUpdateUserMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMeasurementDto }) =>
      measurementService.updateUserMeasurement(id, data),
    onSuccess: () => {
      // Invalidate user measurements to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.measurements.user });
    },
  });
};

/**
 * Hook to delete a user measurement
 */
export const useDeleteUserMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => measurementService.deleteUserMeasurement(id),
    onSuccess: () => {
      // Invalidate user measurements to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.measurements.user });
    },
  });
};

// Legacy exports for backward compatibility (deprecated, use hooks instead)
export const getMeasurementReference = measurementService.getReference;
export const getUserMeasurements = measurementService.getUserMeasurements;
export const createUserMeasurement = measurementService.createUserMeasurement;
export const updateUserMeasurement = measurementService.updateUserMeasurement;
export const deleteUserMeasurement = measurementService.deleteUserMeasurement;
