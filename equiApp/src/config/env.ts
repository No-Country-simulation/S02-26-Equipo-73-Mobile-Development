import Constants from 'expo-constants';

/**
 * Configuración de variables de entorno
 * Lee las variables desde .env
 */
export const ENV = {
  API_URL: Constants.expoConfig?.extra?.API_URL || process.env.EXPO_PUBLIC_API_URL || '',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY || '',
  
  // Agregar más variables según sea necesario
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
} as const;

/**
 * Validar que las variables de entorno requeridas estén configuradas
 */
export const validateEnv = () => {
  if (!ENV.SUPABASE_URL) {
    console.error('❌ EXPO_PUBLIC_SUPABASE_URL no está configurada en .env');
    throw new Error('EXPO_PUBLIC_SUPABASE_URL es requerida');
  }
  
  if (!ENV.SUPABASE_ANON_KEY) {
    console.error('❌ EXPO_PUBLIC_SUPABASE_ANON_KEY no está configurada en .env');
    throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY es requerida');
  }
  
  if (ENV.API_URL) {
    console.log('✅ Variables de entorno configuradas correctamente');
  }
};
