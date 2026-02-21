import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { supabase } from '@/src/lib/supabase';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/src/schemas/auth.schema';

/**
 * Pantalla para resetear contraseña
 * Recibe el token del link de recuperación
 * 
 * URL: equiapp://auth/reset-password#access_token=xxx&type=recovery
 */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const url = Linking.useLinkingURL();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (url) {
      validateToken(url);
    }
  }, [url]);

  const validateToken = async (linkUrl: string) => {
    try {
      console.log('→ Validando token de recuperación:', linkUrl);

      const hash = linkUrl.split('#')[1];
      if (!hash) {
        throw new Error('Token no encontrado');
      }

      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const type = params.get('type');

      if (!access_token || type !== 'recovery') {
        throw new Error('Token inválido o tipo incorrecto');
      }

      // Establecer la sesión de recuperación
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token: params.get('refresh_token') || '',
      });

      if (error) throw error;

      setIsValidToken(true);
      console.log('✓ Token válido');
    } catch (error) {
      console.error('❌ Error validando token:', error);
      setIsValidToken(false);
      Alert.alert(
        'Error',
        'El enlace de recuperación es inválido o ha expirado',
        [
          {
            text: 'Volver',
            onPress: () => router.replace('/auth/forgot-password'),
          },
        ]
      );
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);

      console.log('→ Actualizando contraseña...');

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      console.log('✓ Contraseña actualizada');

      Alert.alert(
        '¡Éxito!',
        'Tu contraseña ha sido actualizada correctamente',
        [
          {
            text: 'Iniciar Sesión',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Error actualizando contraseña:', error);
      const errorMessage = error.message || 'Error al actualizar la contraseña';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state mientras valida
  if (isValidToken === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Validando enlace...</Text>
      </View>
    );
  }

  // Token inválido
  if (isValidToken === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Enlace Inválido</Text>
        <Text style={styles.errorMessage}>
          El enlace de recuperación es inválido o ha expirado
        </Text>
      </View>
    );
  }

  // Form para cambiar contraseña
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nueva Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu nueva contraseña
        </Text>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                editable={!isLoading}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                editable={!isLoading}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Actualizar Contraseña</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.replace('/auth/login')}
          disabled={isLoading}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
