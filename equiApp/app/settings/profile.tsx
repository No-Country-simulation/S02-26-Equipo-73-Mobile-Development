/**
 * Pantalla de Datos Personales
 * Permite ver y editar los datos personales del usuario
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText, ThemedInput, ThemedButton } from '@/src';
import { useAuth } from '@/src/hooks/useAuth';
import { getUserData, updateUserData } from '@/src/services/user.service';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import type { User, UpdateProfileData } from '@/src/types/user.types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileScreen() {
  const router = useRouter();
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
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const response = await getUserData();
      const data = response.data;
      setUserData(data);

      // Poblar el formulario con los datos existentes
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setPhone(data.phone || '');
      if (data.dateOfBirth) {
        setDateOfBirth(new Date(data.dateOfBirth));
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los datos');
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
      setUserData(response.data);

      Alert.alert('Éxito', 'Datos actualizados correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron actualizar los datos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Seleccionar fecha';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>Cargando datos...</ThemedText>
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
            <AntDesignIcon name="left" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>Datos Personales</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Email (solo lectura) */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Email
            </ThemedText>
            <View style={[styles.readOnlyField, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText style={styles.readOnlyText}>{userData?.email || user?.email}</ThemedText>
            </View>
            <ThemedText style={[styles.helperText, { color: colors.textSecondary }]}>
              El email no se puede modificar
            </ThemedText>
          </View>

          {/* First Name */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Nombre
            </ThemedText>
            <ThemedInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ingresa tu nombre"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Last Name */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Apellido
            </ThemedText>
            <ThemedInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Ingresa tu apellido"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Fecha de Nacimiento
            </ThemedText>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <AntDesignIcon name="calendar" size={20} color={colors.text} />
              <ThemedText style={[styles.dateText, !dateOfBirth && styles.datePlaceholder]}>
                {formatDate(dateOfBirth)}
              </ThemedText>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                locale="es-ES"
              />
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Teléfono
            </ThemedText>
            <ThemedInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+54 9 11 1234-5678"
              keyboardType="phone-pad"
              returnKeyType="done"
            />
          </View>

          {/* Botón de guardar */}
          <ThemedButton
            label={isSaving ? 'Guardando...' : 'Guardar Cambios'}
            onPress={handleSave}
            isLoading={isSaving}
            style={styles.saveButton}
          />

          {/* Info adicional */}
          <View style={[styles.infoBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <AntDesignIcon name="info" size={16} color={colors.primary} style={styles.infoIcon} />
            <ThemedText style={[styles.infoText, { color: colors.text }]}>
              Tus datos personales están protegidos y solo se usan para mejorar tu experiencia.
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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  dateText: {
    flex: 1,
  },
  datePlaceholder: {
    opacity: 0.5,
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

