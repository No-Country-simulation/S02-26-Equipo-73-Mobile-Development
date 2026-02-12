import Constants from 'expo-constants';

/**
 * Configuración de variables de entorno
 * Lee las variables desde .env
 */
export const ENV = {
  API_URL: Constants.expoConfig?.extra?.API_URL || process.env.EXPO_PUBLIC_API_URL || '',
  
  // Agregar más variables según sea necesario
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
} as const;

/**
 * Validar que las variables de entorno requeridas estén configuradas
 */
export const validateEnv = () => {
  if (!ENV.API_URL) {
    console.warn('⚠️ API_URL no está configurada en .env');
  }
};
