/**
 * Pantalla para Cambiar Contraseña
 * Permite al usuario cambiar su contraseña actual
 */

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedView, ThemedText, ThemedInput, ThemedButton } from '@/src';
import { changePasswordSchema, type ChangePasswordFormData } from '@/src/schemas/auth.schema';
import { changePassword } from '@/src/services/auth.service';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
        'Success',
        'Your password has been changed successfully',
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
      Alert.alert('Error', error.message || 'Could not change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesignIcon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Change Password</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Make sure to use a strong password
          </ThemedText>

          {/* Contraseña Actual */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Current Password</ThemedText>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <ThemedInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your current password"
                    secureTextEntry={!showPasswords.current}
                    autoCapitalize="none"
                    editable={!isLoading}
                    error={errors.currentPassword?.message}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                    }
                  >
                    <AntDesignIcon
                      name={showPasswords.current ? 'eye-invisible' : 'eye'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Nueva Contraseña */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>New Password</ThemedText>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <ThemedInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Minimum 6 characters"
                    secureTextEntry={!showPasswords.new}
                    autoCapitalize="none"
                    editable={!isLoading}
                    error={errors.newPassword?.message}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    <AntDesignIcon
                      name={showPasswords.new ? 'eye-invisible' : 'eye'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Confirmar Nueva Contraseña */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Confirm New Password</ThemedText>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <ThemedInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Repeat the new password"
                    secureTextEntry={!showPasswords.confirm}
                    autoCapitalize="none"
                    editable={!isLoading}
                    error={errors.confirmPassword?.message}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                    }
                  >
                    <AntDesignIcon
                      name={showPasswords.confirm ? 'eye-invisible' : 'eye'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Botón de Guardar */}
          <ThemedButton
            label={isLoading ? 'Saving...' : 'Change Password'}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            isLoading={isLoading}
            style={styles.button}
          />

          {/* Información de seguridad */}
          <View style={[styles.infoBox, { backgroundColor: `${colors.info}15` }]}>
            <View style={styles.infoHeader}>
              <AntDesignIcon name="info-circle" size={20} color={colors.info} />
              <ThemedText style={[styles.infoTitle, { color: colors.info }]}>
                Security Tips
              </ThemedText>
            </View>
            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
              • Use at least 8 characters{'\n'}
              • Combine uppercase, lowercase, and numbers{'\n'}
              • Avoid obvious personal information{'\n'}
              • Don't reuse passwords from other accounts
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.xl,
    lineHeight: 20,
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
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  button: {
    marginTop: Spacing.md,
    height: 50,
  },
  infoBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginLeft: Spacing.lg + 8,
  },
});
