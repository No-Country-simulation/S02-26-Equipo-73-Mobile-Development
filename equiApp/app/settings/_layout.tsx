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
        name="profile" 
        options={{
          title: 'Perfil de Usuario',
        }}
      />
      <Stack.Screen 
        name="change-password" 
        options={{
          title: 'Cambiar Contraseña',
        }}
      />
      <Stack.Screen 
        name="preferences" 
        options={{
          title: 'Preferencias',
        }}
      />
      <Stack.Screen 
        name="closet" 
        options={{
          title: 'Closet',
        }}
      />
      <Stack.Screen 
        name="horses" 
        options={{
          title: 'Mis Caballos',
        }}
      />
      <Stack.Screen 
        name="help" 
        options={{
          title: 'Ayuda',
        }}
      />
    </Stack>
  );
}
