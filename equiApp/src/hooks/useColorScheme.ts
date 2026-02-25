import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useUserStore } from '@/src/stores/user.store';

/**
 * Hook para acceder al esquema de color actual (light/dark)
 * Lee la preferencia del usuario del store y resuelve el tema:
 * - 'system': usa el tema del dispositivo
 * - 'light' o 'dark': usa el tema seleccionado
 */
export const useColorScheme = (): 'light' | 'dark' => {
  const systemColorScheme = useSystemColorScheme();
  const themePreference = useUserStore((state) => state.preferences.theme);

  // Si el usuario eligió 'system' o no hay preferencia, usar el tema del dispositivo
  if (!themePreference || themePreference === 'system') {
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }

  // Retornar la preferencia explícita del usuario
  return themePreference as 'light' | 'dark';
};
