import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/src/config/api';
import { queryKeys } from '@/src/config/query-client';
import type { User, UpdateProfileData } from '@/src/types/user.types';
import type { ApiResponse } from '@/src/types/common.types';

/**
 * User API Services
 */
export const userService = {
  /**
   * Get current user data
   */
  getUserData: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/user/me');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error getting user data');
    }

    return response.data.data;
  },

  /**
   * Update current user profile
   */
  updateUserData: async (data: UpdateProfileData): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/user/me', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error updating user data');
    }

    return response.data.data;
  },
};

/**
 * Hook to get current user data
 */
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user.me,
    queryFn: () => userService.getUserData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateUserData(data),
    onSuccess: (updatedUser) => {
      // Update the cached user data
      queryClient.setQueryData(queryKeys.user.me, updatedUser);
      // Also invalidate to trigger a background refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me });
    },
  });
};

// Legacy exports for backward compatibility (deprecated, use hooks instead)
export const getUserData = userService.getUserData;
export const updateUserData = userService.updateUserData;
