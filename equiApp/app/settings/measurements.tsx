/**
 * Pantalla de Mis Medidas
 * Gestiona las medidas corporales del usuario para recomendaciones de productos
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText } from '@/src';
import { Spacing, BorderRadius } from '@/src/constants';
import AntDesignIcon from '@expo/vector-icons/AntDesign';

type MeasurementUnit = 'cm' | 'in';

export default function MeasurementsScreen() {
  const router = useRouter();

  // Estado de medidas (en producción vendrían de una API/store)
  const [unit, setUnit] = useState<MeasurementUnit>('cm');
  const [measurements, setMeasurements] = useState({
    height: '',
    chest: '',
    waist: '',
    hips: '',
    inseam: '',
    shoulders: '',
  });

  const handleSave = () => {
    Alert.alert(
      'Guardar Medidas',
      '¿Deseas guardar tus medidas actuales?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: () => {
            // TODO: Implementar guardado en API/store
            Alert.alert('Éxito', 'Tus medidas han sido guardadas');
          },
        },
      ]
    );
  };

  const measurementFields = [
    { key: 'height', label: 'Altura', icon: 'arrowsalt' },
    { key: 'chest', label: 'Pecho', icon: 'user' },
    { key: 'waist', label: 'Cintura', icon: 'user' },
    { key: 'hips', label: 'Cadera', icon: 'user' },
    { key: 'inseam', label: 'Entrepierna', icon: 'arrowsalt' },
    { key: 'shoulders', label: 'Hombros', icon: 'user' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesignIcon name="left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            Mis Medidas
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <AntDesignIcon name="info-circle" size={20} color="#007AFF" />
            <ThemedText style={styles.infoText}>
              Mantén tus medidas actualizadas para obtener mejores recomendaciones de productos
            </ThemedText>
          </View>

          {/* Unit Toggle */}
          <View style={styles.unitToggle}>
            <ThemedText style={styles.unitLabel}>Unidad de medida:</ThemedText>
            <View style={styles.unitButtons}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]}
                onPress={() => setUnit('cm')}
              >
                <ThemedText
                  style={[styles.unitButtonText, unit === 'cm' && styles.unitButtonTextActive]}
                >
                  cm
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'in' && styles.unitButtonActive]}
                onPress={() => setUnit('in')}
              >
                <ThemedText
                  style={[styles.unitButtonText, unit === 'in' && styles.unitButtonTextActive]}
                >
                  in
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Measurement Fields */}
          <View style={styles.measurementsContainer}>
            {measurementFields.map((field) => (
              <View key={field.key} style={styles.measurementField}>
                <View style={styles.measurementLabelRow}>
                  <AntDesignIcon name={field.icon as any} size={20} color="#666" />
                  <ThemedText style={styles.measurementLabel}>{field.label}</ThemedText>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={measurements[field.key as keyof typeof measurements]}
                    onChangeText={(text) =>
                      setMeasurements({ ...measurements, [field.key]: text })
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                  <ThemedText style={styles.unitText}>{unit}</ThemedText>
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <AntDesignIcon name="check" size={20} color="#fff" style={styles.saveIcon} />
            <ThemedText style={styles.saveButtonText}>Guardar Medidas</ThemedText>
          </TouchableOpacity>

          {/* Help Link */}
          <TouchableOpacity style={styles.helpLink}>
            <AntDesignIcon name="question-circle" size={16} color="#007AFF" />
            <ThemedText style={styles.helpLinkText}>¿Cómo tomar mis medidas?</ThemedText>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: Spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: '#e7f3ff',
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    opacity: 0.8,
  },
  unitToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  unitButtons: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.sm,
  },
  unitButtonActive: {
    backgroundColor: '#007AFF',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  unitButtonTextActive: {
    color: '#fff',
  },
  measurementsContainer: {
    gap: Spacing.md,
  },
  measurementField: {
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  measurementLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  measurementLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  unitText: {
    fontSize: 14,
    opacity: 0.6,
    marginLeft: Spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  saveIcon: {
    marginRight: Spacing.xs,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  helpLinkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
