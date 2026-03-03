/**
 * Pantalla de Datos Personales
 * Permite ver y editar los datos personales del usuario
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedView, ThemedText, ThemedInput, ThemedButton, DatePickerWithActionSheet } from '@/src';
import { useAuth } from '@/src/hooks/useAuth';
import { getUserData, updateUserData } from '@/src/services/user.service';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import type { User, UpdateProfileData } from '@/src/types/user.types';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  // Estados del formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const response = await getUserData();
      const data = response;
      setUserData(data);

      // Poblar el formulario con los datos existentes
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setPhone(data.phone || '');
      if (data.dateOfBirth) {
        setDateOfBirth(new Date(data.dateOfBirth));
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('settings.personalData.errors.load'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const updateData: UpdateProfileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        dateOfBirth: dateOfBirth?.toISOString(),
      };

      const response = await updateUserData(updateData);
      setUserData(response);

      Alert.alert(t('common.success'), t('settings.personalData.updateSuccess'));
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('settings.personalData.errors.update'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setDateOfBirth(date);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>{t('common.loading')}</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesignIcon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText variant='subheading1'>{t('settings.personalData.title')}</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Email (solo lectura) */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              {t('settings.personalData.email')}
            </ThemedText>
            <View style={[styles.readOnlyField, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText style={styles.readOnlyText}>{userData?.email || user?.email}</ThemedText>
            </View>
            <ThemedText style={[styles.helperText, { color: colors.textSecondary }]}>
              {t('settings.personalData.emailReadonly')}
            </ThemedText>
          </View>

          {/* First Name */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              {t('settings.personalData.name')}
            </ThemedText>
            <ThemedInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('settings.personalData.placeholders.name')}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Last Name */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              {t('settings.personalData.lastName')}
            </ThemedText>
            <ThemedInput
              value={lastName}
              onChangeText={setLastName}
              placeholder={t('settings.personalData.placeholders.lastName')}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.section}>
            <DatePickerWithActionSheet
              dateOfBirth={dateOfBirth}
              onDateChange={handleDateChange}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              {t('settings.personalData.phone')}
            </ThemedText>
            <ThemedInput
              value={phone}
              onChangeText={setPhone}
              placeholder={t('settings.personalData.placeholders.phone')}
              keyboardType="phone-pad"
              returnKeyType="done"
            />
          </View>

          {/* Botón de guardar */}
          <ThemedButton
            label={isSaving ? t('common.saving') : t('common.save')}
            onPress={handleSave}
            isLoading={isSaving}
            style={styles.saveButton}
          />

          {/* Info adicional */}
          <View style={[styles.infoBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <AntDesignIcon name="info" size={16} color={colors.primary} style={styles.infoIcon} />
            <ThemedText style={[styles.infoText, { color: colors.text }]}>
              {t('settings.personalData.privacyInfo')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: Spacing.sm,
    width: 40,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
    fontSize: 14,
  },
  readOnlyField: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  readOnlyText: {
    opacity: 0.7,
  },
  helperText: {
    fontSize: 12,
    marginTop: Spacing.xs,
    opacity: 0.6,
  },
  saveButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  infoBox: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
