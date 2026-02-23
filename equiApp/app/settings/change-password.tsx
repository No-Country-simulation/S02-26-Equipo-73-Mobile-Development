/**
 * Pantalla para Cambiar Contraseña
 * Permite al usuario cambiar su contraseña actual
 */

import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedView, ThemedText } from '@/src';
import { changePasswordSchema, type ChangePasswordFormData } from '@/src/schemas/auth.schema';
import { changePassword } from '@/src/services/auth.service';
import { Spacing, BorderRadius } from '@/src/constants';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      await changePassword(data);
      
      Alert.alert(
        'Éxito',
        'Tu contraseña ha sido cambiada correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText style={styles.backButton}>← Volver</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title" style={styles.title}>
              Cambiar Contraseña
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Asegúrate de usar una contraseña segura
            </ThemedText>
          </View>

          {/* Contraseña Actual */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Contraseña Actual</ThemedText>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors.currentPassword && styles.inputError]}
                    placeholder="Ingresa tu contraseña actual"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPasswords.current}
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                    }
                  >
                    <ThemedText>{showPasswords.current ? '👁️' : '👁️‍🗨️'}</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.currentPassword && (
              <ThemedText style={styles.errorText}>
                {errors.currentPassword.message}
              </ThemedText>
            )}
          </View>

          {/* Nueva Contraseña */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Nueva Contraseña</ThemedText>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors.newPassword && styles.inputError]}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPasswords.new}
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    <ThemedText>{showPasswords.new ? '👁️' : '👁️‍🗨️'}</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.newPassword && (
              <ThemedText style={styles.errorText}>
                {errors.newPassword.message}
              </ThemedText>
            )}
          </View>

          {/* Confirmar Nueva Contraseña */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Confirmar Nueva Contraseña</ThemedText>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="Repite la nueva contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPasswords.confirm}
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                    }
                  >
                    <ThemedText>{showPasswords.confirm ? '👁️' : '👁️‍🗨️'}</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <ThemedText style={styles.errorText}>
                {errors.confirmPassword.message}
              </ThemedText>
            )}
          </View>

          {/* Botón de Guardar */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Cambiar Contraseña</ThemedText>
            )}
          </TouchableOpacity>

          {/* Información de seguridad */}
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoTitle}>💡 Consejos de seguridad</ThemedText>
            <ThemedText style={styles.infoText}>
              • Usa al menos 8 caracteres{'\n'}
              • Combina mayúsculas, minúsculas y números{'\n'}
              • Evita información personal obvia{'\n'}
              • No reutilices contraseñas de otras cuentas
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: Spacing.sm,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    paddingRight: 50,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
});
