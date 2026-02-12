import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, UpdateProfileData, UserPreferences } from '@/src/types/user.types';

interface UserState {
  // Estado
  profile: UserProfile | null;
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;

  // Acciones
  setProfile: (profile: UserProfile) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Store de usuario con Zustand
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      profile: null,
      preferences: {
        notifications: true,
        theme: 'system',
        language: 'es',
      },
      isLoading: false,
      error: null,

      /**
       * Establecer perfil completo
       */
      setProfile: (profile: UserProfile) => {
        set({ profile, error: null });
      },

      /**
       * Actualizar perfil parcialmente
       */
      updateProfile: (data: Partial<UserProfile>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: { ...currentProfile, ...data },
            error: null,
          });
        }
      },

      /**
       * Actualizar preferencias
       */
      updatePreferences: (newPreferences: Partial<UserPreferences>) => {
        const currentPreferences = get().preferences;
        set({
          preferences: { ...currentPreferences, ...newPreferences },
        });
      },

      /**
       * Limpiar perfil
       */
      clearProfile: () => {
        set({
          profile: null,
          error: null,
        });
      },

      /**
       * Establecer estado de carga
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Establecer error
       */
      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        preferences: state.preferences,
      }),
    }
  )
);
