import { Stack } from 'expo-router';
import { AppProvider } from '@/src/providers/AppProvider';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="auth" 
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="product/[id]" 
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}
