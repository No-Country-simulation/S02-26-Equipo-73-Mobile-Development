import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { AppProvider } from '@/src/providers/AppProvider';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/src/hooks';

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Cargar fuentes personalizadas (puedes agregar más fuentes aquí)
  const [fontsLoaded] = useFonts({
    // Ejemplo: 'CustomFont': require('../assets/fonts/CustomFont.ttf'),
    // Por ahora usamos las fuentes del sistema
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Ocultar el splash screen cuando las fuentes estén cargadas
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // No renderizar nada hasta que las fuentes estén cargadas
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="theme-demo" />
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
            <Stack.Screen 
              name="settings" 
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
