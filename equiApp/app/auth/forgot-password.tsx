import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText, ThemedInput } from '@/src';
import { useForm, Controller } from 'react-hook-form';
import { Colors, Spacing, BorderRadius } from '@/src/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/src/lib/supabase';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/src/schemas/auth.schema';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: 'equiapp://auth/callback',
      });

      if (error) throw error;
      
      Alert.alert(
        'Éxito',
        'Se ha enviado un enlace de recuperación a tu email',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error.message || 'Error al enviar el email';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Recuperar Contraseña</ThemedText>
        <ThemedText style={styles.subtitle}>
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </ThemedText>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                leftIcon="mail-outline"
                placeholder="tu@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                editable={!isLoading}
                error={errors.email?.message}
              />
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.light.primary} />
          ) : (
            <ThemedText variant="buttonRegular" lightColor={Colors.light.primary} style={styles.buttonText}>
              Enviar Enlace
            </ThemedText>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={isLoading}
          style={styles.backButton}
        >
          <ThemedText variant="bodyRegular" lightColor={Colors.light.accent} darkColor={Colors.dark.accent}>
            Volver al inicio de sesión
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
    lineHeight: 22,
    opacity: 0.7,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.light.accent,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.light.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '700',
  },
  backButton: {
    padding: Spacing.sm,
    alignItems: 'center',
  },
});
