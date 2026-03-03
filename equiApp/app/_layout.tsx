import '@/src/locales/i18nConfig';
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
import * as SystemUI from 'expo-system-ui';
import { useColorScheme } from '@/src/hooks';
import { Colors } from '@/src/constants';

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.setOptions({duration: 2000, fade: true});
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Cargar fuentes personalizadas Syne
  const [fontsLoaded] = useFonts({
    'Syne-Regular': require('../assets/fonts/Syne-Regular.ttf'),
    'Syne-Medium': require('../assets/fonts/Syne-Medium.ttf'),
    'Syne-SemiBold': require('../assets/fonts/Syne-SemiBold.ttf'),
    'Syne-Bold': require('../assets/fonts/Syne-Bold.ttf'),
    'Syne-ExtraBold': require('../assets/fonts/Syne-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Ocultar el splash screen cuando las fuentes estén cargadas
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Configurar el color de la barra de navegación del sistema globalmente
    const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [colorScheme]);

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
            <Stack.Screen 
              name="onboarding" 
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
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
