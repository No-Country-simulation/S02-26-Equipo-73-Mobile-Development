import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/auth.store';
import { exchangeToken } from '@/src/services/auth.service';

/**
 * Callback para deep linking de Supabase
 * Maneja la confirmación de email y recuperación de contraseña
 * 
 * URL registro: equiapp://auth/callback#access_token=xxx&refresh_token=yyy
 * URL recovery: equiapp://auth/callback#access_token=xxx&type=recovery
 */
export default function AuthCallback() {
  const router = useRouter();
  const url = Linking.useLinkingURL();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando...');
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const handleCallback = useCallback(async (linkUrl: string) => {
    try {
      console.log('Procesando callback con URL:', linkUrl);

      // Separar el fragmento después del #
      const hash = linkUrl.split('#')[1];

      if (!hash) {
        throw new Error('No se encontraron tokens en el callback');
      }

      // Convertir a URLSearchParams
      const params = new URLSearchParams(hash);

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');
      const error = params.get('error');
      const error_description = params.get('error_description');

      console.log('Params recibidos:', {
        access_token: access_token ? 'presente' : 'ausente',
        refresh_token: refresh_token ? 'presente' : 'ausente',
        type,
        error,
      });

      // Si es recuperación de contraseña, redirigir a reset-password
      if (type === 'recovery') {
        console.log('→ Tipo: Recovery - Redirigiendo a reset-password');
        setMessage('Redirigiendo a cambio de contraseña...');
        setTimeout(() => {
          router.replace(`/auth/reset-password`);
        }, 500);
        return;
      }

      // Manejar errores
      if (error) {
        setStatus('error');
        setMessage(error_description || error);
        setTimeout(() => router.replace('/auth/login'), 3000);
        return;
      }

      // Confirmación de email (registro)
      if (access_token && refresh_token) {
        console.log('→ Tipo: Email confirmation - Estableciendo sesión...');
        setMessage('Verificando tu email...');
        
        // Establecer sesión con los tokens (no esperar el await, el listener lo maneja)
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(({ error: sessionError }) => {
          console.log('→ SetSession completado:', sessionError ? 'ERROR' : 'OK');
          if (sessionError) {
            console.error('→ Error en setSession:', sessionError);
          }
        });

        // Esperar un momento para que el listener actualice el estado
        console.log('→ Esperando actualización de estado...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('→ Verificando estado de autenticación...');
        await checkAuth();

        // Exchange token con la API
        try {
          console.log('→ Intercambiando token con la API...');
          await exchangeToken(access_token);
          console.log('✅ Token intercambiado exitosamente');
        } catch (exchangeError: any) {
          console.warn('⚠️ Error en exchange de token:', exchangeError.message);
          // No bloquear el flujo si el exchange falla
        }

        console.log('✓ Sesión establecida correctamente');
        
        // Actualizar el estado de la UI
        setStatus('success');
        setMessage('¡Email confirmado! Bienvenido');

        // Navegar a la app
        setTimeout(() => {
          console.log('→ Navegando a tabs');
          router.replace('/(tabs)');
        }, 1500);
      } else {
        throw new Error('No se recibieron tokens de autenticación');
      }

    } catch (error: any) {
      console.error('❌ Error en callback:', error);
      console.error('❌ Error stack:', error.stack);
      setStatus('error');
      setMessage(error.message || 'Error al confirmar el email');
      setTimeout(() => router.replace('/auth/login'), 3000);
    }
  }, [router, checkAuth]);

  useEffect(() => {
    if (url) {
      handleCallback(url);
    }
  }, [url, handleCallback]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.message}>{message}</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={styles.successIcon}>
              <Text style={styles.iconText}>✓</Text>
            </View>
            <Text style={styles.successMessage}>{message}</Text>
            <Text style={styles.subMessage}>Redirigiendo a la app...</Text>
          </>
        )}

        {status === 'error' && (
          <>
            <View style={styles.errorIcon}>
              <Text style={styles.iconText}>✕</Text>
            </View>
            <Text style={styles.errorMessage}>{message}</Text>
            <Text style={styles.subMessage}>Redirigiendo al login...</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 8,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
