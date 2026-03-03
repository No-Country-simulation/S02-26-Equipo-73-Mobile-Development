import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedView, ThemedText, ThemedInput, ThemedButton } from '@/src';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/src/hooks/useAuth';
import { PublicRoute } from '@/src/components/auth';
import { registerSchema, type RegisterFormData } from '@/src/schemas/auth.schema';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';

function RegisterScreenContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      Alert.alert(
        t('auth.register.registerSuccess'), 
        'Revisa tu email para confirmar tu cuenta',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (error: any) {
      const errorMessage = error.message || t('auth.register.registerError');
      Alert.alert(t('common.error'), errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings/help')}>
              <ThemedText variant="bodyRegular" lightColor={Colors.light.accent} darkColor={Colors.dark.accent}>
                {t('profile.help')}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Logo */}
          {/* <View style={styles.logoContainer}>
            <View style={[
              styles.iconCircle, 
              { 
                backgroundColor: colorScheme === 'dark' ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary,
                borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border
              }
            ]}>
              <Ionicons name="layers" size={40} color={Colors.light.accent} />
            </View>
          </View> */}

          {/* Title */}
          <ThemedText variant="heading3" style={styles.title}>
            {t('auth.register.title')}
          </ThemedText>
          <ThemedText variant="bodyRegular" style={styles.subtitle} lightColor={Colors.light.textSecondary} darkColor={Colors.dark.textSecondary}>
            Medición precisa y compras con IA para el ecuestre moderno
          </ThemedText>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  leftIcon="person-outline"
                  placeholder={t('auth.register.name')}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  editable={!isLoading}
                  error={errors.name?.message}
                />
              )}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  leftIcon="mail-outline"
                  placeholder={t('auth.register.email')}
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

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  leftIcon="lock-closed-outline"
                  rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  placeholder={t('auth.register.password')}
                  secureTextEntry={!showPassword}
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
                  placeholder={t('auth.register.confirmPassword')}
                  secureTextEntry={!showPassword}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  editable={!isLoading}
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </View>

          {/* Register Button */}

          <ThemedButton 
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            label={t('auth.register.registerButton')}
          
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border }]} />
            <ThemedText variant="bodySmall" style={styles.dividerText} lightColor={Colors.light.textSecondary} darkColor={Colors.dark.textSecondary}>
              O continuar con
            </ThemedText>
            <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border }]} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={[
              styles.socialButton, 
              { 
                backgroundColor: colorScheme === 'dark' ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary,
                borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border
              }
            ]} disabled={isLoading}>
              <Ionicons name="logo-google" size={24} color={colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon} />
              <ThemedText variant="bodyRegular" style={styles.socialText}>Google</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[
              styles.socialButton, 
              { 
                backgroundColor: colorScheme === 'dark' ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary,
                borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border
              }
            ]} disabled={isLoading}>
              <Ionicons name="logo-apple" size={24} color={colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon} />
              <ThemedText variant="bodyRegular" style={styles.socialText}>Apple</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.footer}>
            <ThemedText variant="bodyRegular" lightColor={Colors.light.textSecondary} darkColor={Colors.dark.textSecondary}>
              ¿Ya tienes cuenta?{' '}
            </ThemedText>
            <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
              <ThemedText variant="bodyRegular" lightColor={Colors.light.accent} darkColor={Colors.dark.accent} style={styles.link}>
                Inicia Sesión
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Browse as Guest */}
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            disabled={isLoading}
            style={styles.guestLink}
          >
            <ThemedText variant="bodyRegular" lightColor={Colors.light.textSecondary} darkColor={Colors.dark.textSecondary}>
              Explorar Catálogo como Invitado →
            </ThemedText>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backButton: {
    padding: Spacing.xs,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  socialText: {
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  link: {
    fontWeight: '600',
  },
  guestLink: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
});

export default function RegisterScreen() {
  return (
    <PublicRoute>
      <RegisterScreenContent />
    </PublicRoute>
  );
}
