import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/stores/auth.store';

/**
 * Callback para deep linking de Supabase
 * Maneja la confirmación de email al registrarse
 * 
 * URL: equiapp://auth/callback?access_token=xxx&refresh_token=yyy
 */
export default function AuthCallback() {
  const router = useRouter();
  const url = Linking.useLinkingURL();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu email...');
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    if (url) {
      handleCallback(url);
    }
  }, [url]);

  const handleCallback = async (linkUrl: string) => {
    try {
      // Parsear la URL con expo-linking
      const { queryParams } = Linking.parse(linkUrl);
      console.log('URL recibida en callback:', linkUrl);
      const access_token = queryParams?.access_token as string | undefined;
      const refresh_token = queryParams?.refresh_token as string | undefined;
      const error = queryParams?.error as string | undefined;
      const error_description = queryParams?.error_description as string | undefined;
      console.log('Tokens recibidos:', { access_token, refresh_token, error, error_description });

      // Si hay error en los parámetros
      if (error) {
        setStatus('error');
        setMessage(error_description || error);
        setTimeout(() => router.replace('/auth/login'), 3000);
        return;
      }

      // Si tenemos tokens, establecer la sesión
      if (access_token && refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (sessionError) throw sessionError;

        // Actualizar el store
        await checkAuth();

        setStatus('success');
        setMessage('¡Email confirmado! Bienvenido');

        // Redirigir a la app
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 2000);
      } else {
        throw new Error('No se recibieron tokens de autenticación');
      }
    } catch (error: any) {
      console.error('Error en callback:', error);
      setStatus('error');
      setMessage(error.message || 'Error al confirmar el email');
      setTimeout(() => router.replace('/auth/login'), 3000);
    }
  };

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
