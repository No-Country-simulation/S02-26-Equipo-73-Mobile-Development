/**
 * Layout para las pantallas de Settings
 * Gestiona la navegación dentro del módulo de configuración
 */

import { Stack } from 'expo-router';
import { useColorScheme } from '@/src/hooks';

export default function SettingsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#f5f5f5',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Configuración',
        }}
      />
      <Stack.Screen 
        name="change-password" 
        options={{
          title: 'Cambiar Contraseña',
        }}
      />
    </Stack>
  );
}
