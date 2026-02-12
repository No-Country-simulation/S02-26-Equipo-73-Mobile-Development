import { useUserStore } from '@/src/stores/user.store';
import { apiClient, handleApiError, type ApiResponse } from '@/src/config/api';
import type { UserProfile, UpdateProfileData } from '@/src/types/user.types';

/**
 * Hook personalizado para manejar el perfil de usuario
 */
export const useUser = () => {
  const {
    profile,
    preferences,
    isLoading,
    error,
    setProfile,
    updateProfile: updateProfileState,
    updatePreferences,
    clearProfile,
    setLoading,
    setError,
  } = useUserStore();

  /**
   * Obtener perfil del usuario desde la API
   */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<ApiResponse<UserProfile>>('/user/profile');
      const userProfile = response.data.data!;

      setProfile(userProfile);
      return userProfile;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar perfil del usuario
   */
  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.put<ApiResponse<UserProfile>>('/user/profile', data);
      const updatedProfile = response.data.data!;

      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar avatar del usuario
   */
  const updateAvatar = async (imageUri: string) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const response = await apiClient.post<ApiResponse<UserProfile>>(
        '/user/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedProfile = response.data.data!;
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    profile,
    preferences,
    isLoading,
    error,

    // Acciones
    fetchProfile,
    updateProfile,
    updateAvatar,
    updatePreferences,
    clearProfile,
  };
};
