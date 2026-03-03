/**
 * Layout para las pantallas de Settings
 * Gestiona la navegación dentro del módulo de configuración
 */

import { Stack } from 'expo-router';
import { useColorScheme } from '@/src/hooks';

export default function fittingLayout() {
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
          title: 'Fitting',
        }}
      />
      <Stack.Screen 
        name="horses" 
        options={{
          title: 'Horses',
        }}
      />
      <Stack.Screen 
        name="measurements" 
        options={{
          title: 'My Measurements',
        }}
      />
    </Stack>
  );
}
