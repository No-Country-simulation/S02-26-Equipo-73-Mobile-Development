/**
 * Formulario de Medida
 * Permite agregar o editar una medida del usuario
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText, ThemedView, ThemedInput, ThemedButton } from '@/src';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import {
  getMeasurementReference,
  getUserMeasurements,
  createUserMeasurement,
  updateUserMeasurement,
} from '@/src/services/measurements.service';
import type {
  MeasurementReference,
  MeasurementType,
  Unit,
  Measurement,
} from '@/src/types/measurement.types';

export default function MeasurementFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const measurementId = params.measurementId ? Number(params.measurementId) : null;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [reference, setReference] = useState<MeasurementReference | null>(null);
  const [currentMeasurement, setCurrentMeasurement] = useState<Measurement | null>(null);

  // Estados del formulario
  const [selectedMeasurementType, setSelectedMeasurementType] = useState<MeasurementType | null>(
    null
  );
  const [value, setValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Estados de modales
  const [showMeasurementTypePicker, setShowMeasurementTypePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Cargar referencia
      const refResponse = await getMeasurementReference();
      setReference(refResponse.data);

      // Si es edición, cargar la medida actual
      if (measurementId) {
        const measurementsResponse = await getUserMeasurements();
        const measurement = measurementsResponse.data.find((m) => m.id === measurementId);

        if (measurement) {
          setCurrentMeasurement(measurement);

          // Buscar el tipo de medida
          const entityType = refResponse.data.entityTypes.find(
            (et) => et.name.toLowerCase() === measurement.entityTypeName.toLowerCase()
          );
          const measurementType = entityType?.measurementTypes.find(
            (mt) => mt.id === measurement.measurementTypeId
          );

          setSelectedMeasurementType(measurementType || null);
          setValue(measurement.value.toString());

          // Buscar la unidad
          const unit = refResponse.data.units.find((u) => u.id === measurement.unitId);
          setSelectedUnit(unit || null);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los datos');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validaciones
    if (!selectedMeasurementType) {
      Alert.alert('Error', 'Debes seleccionar un tipo de medida');
      return;
    }

    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      Alert.alert('Error', 'Debes ingresar un valor válido mayor a 0');
      return;
    }

    if (!selectedUnit) {
      Alert.alert('Error', 'Debes seleccionar una unidad');
      return;
    }

    try {
      setIsSaving(true);

      const data = {
        measurementTypeId: selectedMeasurementType.id,
        value: Number(value),
        unitId: selectedUnit.id,
      };

      if (measurementId) {
        // Actualizar medida existente
        await updateUserMeasurement(measurementId, data);
        Alert.alert('Éxito', 'Medida actualizada correctamente');
      } else {
        // Crear nueva medida
        await createUserMeasurement(data);
        Alert.alert('Éxito', 'Medida creada correctamente');
      }

      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar la medida');
    } finally {
      setIsSaving(false);
    }
  };

  const getUserMeasurementTypes = (): MeasurementType[] => {
    if (!reference) return [];

    const userEntityType = reference.entityTypes.find(
      (et) => et.name.toLowerCase() === 'rider'
    );

    return userEntityType?.measurementTypes || [];
  };

  const renderMeasurementTypePicker = () => {
    const measurementTypes = getUserMeasurementTypes();
    return (
      <Modal
        visible={showMeasurementTypePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMeasurementTypePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText variant="subheading1">Selecciona tipo de medida</ThemedText>
              <TouchableOpacity onPress={() => setShowMeasurementTypePicker(false)}>
                <AntDesignIcon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {measurementTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.pickerItem,
                    { borderBottomColor: colors.border },
                    selectedMeasurementType?.id === type.id && {
                      backgroundColor: `${colors.primary}10`,
                    },
                  ]}
                  onPress={() => {
                    setSelectedMeasurementType(type);
                    setShowMeasurementTypePicker(false);
                  }}
                >
                  <ThemedText style={styles.pickerItemText}>{type.name}</ThemedText>
                  {selectedMeasurementType?.id === type.id && (
                    <AntDesignIcon name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderUnitPicker = () => {
    if (!reference) return null;

    return (
      <Modal
        visible={showUnitPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText variant="subheading1">Selecciona unidad</ThemedText>
              <TouchableOpacity onPress={() => setShowUnitPicker(false)}>
                <AntDesignIcon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {reference.units.map((unit) => (
                <TouchableOpacity
                  key={unit.id}
                  style={[
                    styles.pickerItem,
                    { borderBottomColor: colors.border },
                    selectedUnit?.id === unit.id && {
                      backgroundColor: `${colors.primary}10`,
                    },
                  ]}
                  onPress={() => {
                    setSelectedUnit(unit);
                    setShowUnitPicker(false);
                  }}
                >
                  <View style={styles.unitInfo}>
                    <ThemedText style={styles.pickerItemText}>{unit.name}</ThemedText>
                    <ThemedText style={[styles.unitSymbol, { color: colors.textSecondary }]}>
                      ({unit.symbol})
                    </ThemedText>
                  </View>
                  {selectedUnit?.id === unit.id && (
                    <AntDesignIcon name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>Cargando...</ThemedText>
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
          <ThemedText variant="subheading1">
            {measurementId ? 'Editar Medida' : 'Nueva Medida'}
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Tipo de medida */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Tipo de medida *
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.selectButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setShowMeasurementTypePicker(true)}
              disabled={!!measurementId} // No permitir cambiar tipo en edición
            >
              <ThemedText
                style={[
                  styles.selectButtonText,
                  !selectedMeasurementType && { color: colors.textSecondary },
                ]}
              >
                {selectedMeasurementType?.name || 'Selecciona un tipo'}
              </ThemedText>
              <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {measurementId && (
              <ThemedText style={[styles.helperText, { color: colors.textSecondary }]}>
                No se puede cambiar el tipo de medida en edición
              </ThemedText>
            )}
          </View>

          {/* Valor */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Valor *
            </ThemedText>
            <ThemedInput
              value={value}
              onChangeText={setValue}
              placeholder="Ingresa el valor"
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>

          {/* Unidad */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Unidad *
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.selectButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setShowUnitPicker(true)}
            >
              <ThemedText
                style={[
                  styles.selectButtonText,
                  !selectedUnit && { color: colors.textSecondary },
                ]}
              >
                {selectedUnit
                  ? `${selectedUnit.name} (${selectedUnit.symbol})`
                  : 'Selecciona una unidad'}
              </ThemedText>
              <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: `${colors.info}10` }]}>
            <AntDesignIcon name="info-circle" size={20} color={colors.info} />
            <ThemedText style={[styles.infoText, { color: colors.info }]}>
              Estas medidas te ayudarán a encontrar productos que se ajusten mejor a tu talla
            </ThemedText>
          </View>

          {/* Botón guardar */}
          <ThemedButton
            label={measurementId ? 'Actualizar Medida' : 'Guardar Medida'}
            onPress={handleSave}
            isLoading={isSaving}
            disabled={isSaving}
          />
        </ScrollView>

        {/* Modales */}
        {renderMeasurementTypePicker()}
        {renderUnitPicker()}
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
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    minHeight: 56,
  },
  selectButtonText: {
    fontSize: 16,
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    marginTop: Spacing.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalScroll: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  pickerItemText: {
    fontSize: 16,
  },
  unitInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  unitSymbol: {
    fontSize: 14,
  },
});
