import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText, ThemedInput, ThemedButton } from '@/src';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { supabase } from '@/src/lib/supabase';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/src/schemas/auth.schema';
import { Colors, Spacing, BorderRadius } from '@/src/constants';

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
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.accent} />
        <ThemedText style={styles.loadingText}>Validando enlace...</ThemedText>
      </ThemedView>
    );
  }

  // Token inválido
  if (isValidToken === false) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
        <ThemedText variant="heading2" style={styles.errorTitle}>Enlace Inválido</ThemedText>
        <ThemedText variant="bodyRegular" style={styles.errorMessage}>
          El enlace de recuperación es inválido o ha expirado
        </ThemedText>
      </ThemedView>
    );
  }

  // Form para cambiar contraseña
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Nueva Contraseña</ThemedText>
        <ThemedText style={styles.subtitle}>
          Ingresa tu nueva contraseña
        </ThemedText>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                leftIcon="lock-closed-outline"
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                autoCapitalize="none"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                editable={!isLoading}
                error={errors.password?.message}
              />
            )}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                leftIcon="lock-closed-outline"
                placeholder="Repite tu contraseña"
                secureTextEntry
                autoCapitalize="none"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                editable={!isLoading}
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </View>

        {/* Submit Button */}

        <ThemedButton 
          label='Actualizar Contraseña'
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.replace('/auth/login')}
          disabled={isLoading}
          style={styles.cancelButton}
        >
          <ThemedText variant="bodyRegular" lightColor={Colors.light.accent} darkColor={Colors.dark.accent}>
            Cancelar
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    marginTop: Spacing.md,
    opacity: 0.7,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    textAlign: 'center',
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: Spacing.xxl,
    opacity: 0.7,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  cancelButton: {
    padding: Spacing.sm,
    alignItems: 'center',
  },
});
