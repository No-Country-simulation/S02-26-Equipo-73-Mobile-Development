import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Keys para el almacenamiento
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  APP_PREFERENCES: 'app_preferences',
} as const;

/**
 * Determina si usar SecureStore (móvil) o AsyncStorage (web)
 */
const isSecureStoreAvailable = Platform.OS !== 'web';

/**
 * Guardar un valor de forma segura
 */
export const secureStore = {
  /**
   * Guardar un valor
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error guardando ${key}:`, error);
      throw error;
    }
  },

  /**
   * Obtener un valor
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (isSecureStoreAvailable) {
        return await SecureStore.getItemAsync(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error(`Error obteniendo ${key}:`, error);
      return null;
    }
  },

  /**
   * Eliminar un valor
   */
  async deleteItem(key: string): Promise<void> {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error eliminando ${key}:`, error);
      throw error;
    }
  },

  /**
   * Limpiar todo
   */
  async clear(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await Promise.all(keys.map((key) => this.deleteItem(key)));
    } catch (error) {
      console.error('Error limpiando storage:', error);
      throw error;
    }
  },
};

/**
 * Funciones específicas para tokens
 */
export const getToken = async (): Promise<string | null> => {
  return secureStore.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setToken = async (token: string): Promise<void> => {
  return secureStore.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const clearToken = async (): Promise<void> => {
  await secureStore.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
  await secureStore.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return secureStore.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const setRefreshToken = async (token: string): Promise<void> => {
  return secureStore.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Funciones para datos de usuario
 */
export const saveUserData = async (userData: any): Promise<void> => {
  return secureStore.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

export const getUserData = async <T = any>(): Promise<T | null> => {
  const data = await secureStore.getItem(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
};

export const clearUserData = async (): Promise<void> => {
  return secureStore.deleteItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Funciones para preferencias de la app
 */
export const savePreferences = async (preferences: any): Promise<void> => {
  return AsyncStorage.setItem(STORAGE_KEYS.APP_PREFERENCES, JSON.stringify(preferences));
};

export const getPreferences = async <T = any>(): Promise<T | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_PREFERENCES);
  return data ? JSON.parse(data) : null;
};
