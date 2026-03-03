/**
 * Horse Form Screen
 * Allows creating or editing a horse with optional measurements
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
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedText, ThemedView, ThemedInput, ThemedButton } from '@/src';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  useHorseReference,
  useHorse,
  useCreateHorse,
  useUpdateHorse,
} from '@/src/services/horses.service';
import {
  HorseReference,
  Breed,
  Discipline,
  Level,
  Horse,
  CreateHorseDto,
  UpdateHorseDto,
  SexType,
  BackType,
  WithersType,
  ShoulderType,
} from '@/src/types/horse.types';

export default function HorseFormScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const horseId = params.horseId ? Number(params.horseId) : null;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // React Query hooks
  const { data: reference, isLoading: isLoadingReference } = useHorseReference();
  const { data: currentHorse, isLoading: isLoadingHorse } = useHorse(horseId);
  const createMutation = useCreateHorse();
  const updateMutation = useUpdateHorse();

  const isLoading = isLoadingReference || (horseId ? isLoadingHorse : false);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Basic form fields
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sex, setSex] = useState<SexType>(SexType.Male);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  // Measurement fields (all optional)
  const [withersHeight, setWithersHeight] = useState('');
  const [backLength, setBackLength] = useState('');
  const [chestCircumference, setChestCircumference] = useState('');
  const [withersWidth, setWithersWidth] = useState('');
  const [neckLength, setNeckLength] = useState('');
  const [cannonCircumference, setCannonCircumference] = useState('');
  const [headLength, setHeadLength] = useState('');
  const [backType, setBackType] = useState<string | null>(null);
  const [withersType, setWithersType] = useState<string | null>(null);
  const [shoulderType, setShoulderType] = useState<string | null>(null);

  // Modal states
  const [showBreedPicker, setShowBreedPicker] = useState(false);
  const [showDisciplinePicker, setShowDisciplinePicker] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [showSexPicker, setShowSexPicker] = useState(false);
  const [showBackTypePicker, setShowBackTypePicker] = useState(false);
  const [showWithersTypePicker, setShowWithersTypePicker] = useState(false);
  const [showShoulderTypePicker, setShowShoulderTypePicker] = useState(false);

  // Load horse data when editing
  useEffect(() => {
    if (currentHorse && reference) {
      setName(currentHorse.name);
      setBirthDate(new Date(currentHorse.birthDate));
      setSex(currentHorse.sex === 'Male' ? SexType.Male : SexType.Female);

      // Set references
      const breed = reference.breeds.find((b) => b.id === currentHorse.breedId);
      setSelectedBreed(breed || null);

      const discipline = reference.disciplines.find((d) => d.id === currentHorse.disciplineId);
      setSelectedDiscipline(discipline || null);

      const level = reference.levels.find((l) => l.id === currentHorse.levelId);
      setSelectedLevel(level || null);

      // Set measurements if they exist
      if (currentHorse.measurement) {
        const m = currentHorse.measurement;
        if (m.withersHeight !== null && m.withersHeight !== undefined) setWithersHeight(m.withersHeight.toString());
        if (m.backLength !== null && m.backLength !== undefined) setBackLength(m.backLength.toString());
        if (m.chestCircumference !== null && m.chestCircumference !== undefined) setChestCircumference(m.chestCircumference.toString());
        if (m.withersWidth !== null && m.withersWidth !== undefined) setWithersWidth(m.withersWidth.toString());
        if (m.neckLength !== null && m.neckLength !== undefined) setNeckLength(m.neckLength.toString());
        if (m.cannonCircumference !== null && m.cannonCircumference !== undefined) setCannonCircumference(m.cannonCircumference.toString());
        if (m.headLength !== null && m.headLength !== undefined) setHeadLength(m.headLength.toString());
        if (m.backType !== null && m.backType !== undefined) setBackType(m.backType);
        if (m.withersType !== null && m.withersType !== undefined) setWithersType(m.withersType);
        if (m.shoulderType !== null && m.shoulderType !== undefined) setShoulderType(m.shoulderType);
      }
    }
  }, [currentHorse, reference]);

  const handleSave = async () => {
    // Validations
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('fitting.horses.form.errors.name'));
      return;
    }

    if (!selectedBreed) {
      Alert.alert(t('common.error'), t('fitting.horses.form.errors.breed'));
      return;
    }

    if (!selectedDiscipline) {
      Alert.alert(t('common.error'), t('fitting.horses.form.errors.discipline'));
      return;
    }

    if (!selectedLevel) {
      Alert.alert(t('common.error'), t('fitting.horses.form.errors.level'));
      return;
    }

    try {
      // Build measurement object with only filled values
      const measurement: any = {};
      if (withersHeight) measurement.withersHeight = Number(withersHeight);
      if (backLength) measurement.backLength = Number(backLength);
      if (chestCircumference) measurement.chestCircumference = Number(chestCircumference);
      if (withersWidth) measurement.withersWidth = Number(withersWidth);
      if (neckLength) measurement.neckLength = Number(neckLength);
      if (cannonCircumference) measurement.cannonCircumference = Number(cannonCircumference);
      if (headLength) measurement.headLength = Number(headLength);
      if (backType !== null) measurement.backType = backType;
      if (withersType !== null) measurement.withersType = withersType;
      if (shoulderType !== null) measurement.shoulderType = shoulderType;

      if (horseId) {
        // Update existing horse
        const updateData: UpdateHorseDto = {
          name: name.trim(),
          birthDate: birthDate.toISOString(),
          sex,
          breedId: selectedBreed.id,
          disciplineId: selectedDiscipline.id,
          levelId: selectedLevel.id,
          measurement: Object.keys(measurement).length > 0 ? measurement : undefined,
        };

        await updateMutation.mutateAsync({ id: horseId, data: updateData });
        Alert.alert(t('common.success'), t('fitting.horses.form.updateSuccess'));
      } else {
        // Create new horse
        const createData: CreateHorseDto = {
          name: name.trim(),
          birthDate: birthDate.toISOString(),
          sex,
          breedId: selectedBreed.id,
          disciplineId: selectedDiscipline.id,
          levelId: selectedLevel.id,
          measurement: Object.keys(measurement).length > 0 ? measurement : undefined,
        };

        await createMutation.mutateAsync(createData);
        Alert.alert(t('common.success'), t('fitting.horses.form.createSuccess'));
      }

      router.back();
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('fitting.horses.form.errors.save'));
    }
  };

  const renderPicker = <T extends { id: number; name: string }>(
    items: T[],
    selectedItem: T | null,
    onSelect: (item: T) => void,
    onClose: () => void,
    title: string
  ) => (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <AntDesignIcon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScroll}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.pickerItem,
                { borderBottomColor: colors.border },
                selectedItem?.id === item.id && {
                  backgroundColor: `${colors.primary}10`,
                },
              ]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <ThemedText style={styles.pickerItemText}>{item.name}</ThemedText>
              {selectedItem?.id === item.id && (
                <AntDesignIcon name="check" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderEnumPicker = (
    options: { value: string; label: string }[],
    selectedValue: string | null,
    onSelect: (value: string | null) => void,
    onClose: () => void,
    title: string
  ) => (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <AntDesignIcon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScroll}>
          <TouchableOpacity
            style={[
              styles.pickerItem,
              { borderBottomColor: colors.border },
              selectedValue === null && { backgroundColor: `${colors.primary}10` },
            ]}
            onPress={() => {
              onSelect(null as any);
              onClose();
            }}
          >
            <ThemedText style={[styles.pickerItemText, { color: colors.textSecondary }]}>
              {t('fitting.horses.form.notSpecified')}
            </ThemedText>
            {selectedValue === null && (
              <AntDesignIcon name="check" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.pickerItem,
                { borderBottomColor: colors.border },
                selectedValue === option.value && {
                  backgroundColor: `${colors.primary}10`,
                },
              ]}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <ThemedText style={styles.pickerItemText}>{option.label}</ThemedText>
              {selectedValue === option.value && (
                <AntDesignIcon name="check" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderNumberPicker = <T extends number>(
    options: { value: T; label: string }[],
    selectedValue: T,
    onSelect: (value: T) => void,
    onClose: () => void,
    title: string
  ) => (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <AntDesignIcon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScroll}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.pickerItem,
                { borderBottomColor: colors.border },
                selectedValue === option.value && {
                  backgroundColor: `${colors.primary}10`,
                },
              ]}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <ThemedText style={styles.pickerItemText}>{option.label}</ThemedText>
              {selectedValue === option.value && (
                <AntDesignIcon name="check" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

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
          <ThemedText style={styles.headerTitle}>
            {horseId ? t('fitting.horses.form.title.edit') : t('fitting.horses.form.title.new')}
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Basic Information Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('fitting.horses.basicInfo')}</ThemedText>

            {/* Name */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>{t('fitting.horses.form.fields.name')} {t('fitting.horses.form.required')}</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder={t('fitting.horses.form.placeholders.name')}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Birth Date */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>{t('fitting.horses.form.fields.birthDate')} {t('fitting.horses.form.required')}</ThemedText>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.selectValue}>
                  {birthDate.toLocaleDateString(t('dates.locale'), {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </ThemedText>
                <AntDesignIcon name="calendar" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Sex */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>{t('fitting.horses.form.fields.sex')} {t('fitting.horses.form.required')}</ThemedText>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setShowSexPicker(true)}
              >
                <ThemedText style={styles.selectValue}>
                  {sex === SexType.Male ? t('fitting.horses.form.sex.male') : t('fitting.horses.form.sex.female')}
                </ThemedText>
                <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Breed */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>{t('fitting.horses.form.fields.breed')} {t('fitting.horses.form.required')}</ThemedText>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setShowBreedPicker(true)}
              >
                <ThemedText
                  style={[
                    styles.selectValue,
                    !selectedBreed && { color: colors.textSecondary },
                  ]}
                >
                  {selectedBreed?.name || t('fitting.horses.form.placeholders.selectBreed')}
                </ThemedText>
                <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Discipline */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>{t('fitting.horses.form.fields.discipline')} {t('fitting.horses.form.required')}</ThemedText>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setShowDisciplinePicker(true)}
              >
                <ThemedText
                  style={[
                    styles.selectValue,
                    !selectedDiscipline && { color: colors.textSecondary },
                  ]}
                >
                  {selectedDiscipline?.name || t('fitting.horses.form.placeholders.selectDiscipline')}
                </ThemedText>
                <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Level */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>{t('fitting.horses.form.fields.level')} {t('fitting.horses.form.required')}</ThemedText>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setShowLevelPicker(true)}
              >
                <ThemedText
                  style={[
                    styles.selectValue,
                    !selectedLevel && { color: colors.textSecondary },
                  ]}
                >
                  {selectedLevel?.name || t('fitting.horses.form.placeholders.selectLevel')}
                </ThemedText>
                <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Measurements Section (Optional) */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('fitting.horses.measurements')} {t('fitting.horses.form.optional')}</ThemedText>
            <ThemedText style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              {t('fitting.horses.form.measurementsInfo')}
            </ThemedText>

            {/* Linear Measurements (cm) */}
            <View style={styles.subsection}>
              <ThemedText style={styles.subsectionTitle}>{t('fitting.horses.form.dimensions')}</ThemedText>

              <View style={styles.row}>
                <View style={styles.halfField}>
                  <ThemedText style={styles.label}>{t('fitting.horses.form.fields.withersHeight')}</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={withersHeight}
                    onChangeText={setWithersHeight}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.halfField}>
                  <ThemedText style={styles.label}>{t('fitting.horses.form.fields.backLength')}</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={backLength}
                    onChangeText={setBackLength}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfField}>
                  <ThemedText style={styles.label}>{t('fitting.horses.form.fields.chestCircumference')}</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={chestCircumference}
                    onChangeText={setChestCircumference}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.halfField}>
                  <ThemedText style={styles.label}>{t('fitting.horses.form.fields.withersWidth')}</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={withersWidth}
                    onChangeText={setWithersWidth}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfField}>
                  <ThemedText style={styles.label}>{t('fitting.horses.form.fields.neckLength')}</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={neckLength}
                    onChangeText={setNeckLength}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.halfField}>
                  <ThemedText style={styles.label}>{t('fitting.horses.form.fields.cannonCircumference')}</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={cannonCircumference}
                    onChangeText={setCannonCircumference}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <ThemedText style={styles.label}>{t('fitting.horses.form.fields.headLength')}</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={headLength}
                  onChangeText={setHeadLength}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Body Type Characteristics */}
            <View style={styles.subsection}>
              <ThemedText style={styles.subsectionTitle}>{t('fitting.horses.bodyType')}</ThemedText>

              <View style={styles.field}>
                <ThemedText style={styles.label}>{t('fitting.horses.form.fields.backType')}</ThemedText>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => setShowBackTypePicker(true)}
                >
                  <ThemedText
                    style={[
                      styles.selectValue,
                      backType === null && { color: colors.textSecondary },
                    ]}
                  >
                    {backType || t('fitting.horses.form.notSpecified')}
                  </ThemedText>
                  <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <ThemedText style={styles.label}>{t('fitting.horses.form.fields.withersType')}</ThemedText>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => setShowWithersTypePicker(true)}
                >
                  <ThemedText
                    style={[
                      styles.selectValue,
                      withersType === null && { color: colors.textSecondary },
                    ]}
                  >
                    {withersType || t('fitting.horses.form.notSpecified')}
                  </ThemedText>
                  <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <ThemedText style={styles.label}>{t('fitting.horses.form.fields.shoulderType')}</ThemedText>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => setShowShoulderTypePicker(true)}
                >
                  <ThemedText
                    style={[
                      styles.selectValue,
                      shoulderType === null && { color: colors.textSecondary },
                    ]}
                  >
                    {shoulderType || t('fitting.horses.form.notSpecified')}
                  </ThemedText>
                  <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <ThemedButton
              label={isSaving ? t('common.saving') : horseId ? t('fitting.horses.form.title.edit') : t('fitting.horses.form.title.new')}
              onPress={handleSave}
              disabled={isSaving}
              isLoading={isSaving}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>

        {/* Modals */}
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setBirthDate(selectedDate);
              }
            }}
            maximumDate={new Date()}
          />
        )}

        <Modal
          visible={showBreedPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBreedPicker(false)}
        >
          {reference && renderPicker(
            reference.breeds,
            selectedBreed,
            setSelectedBreed,
            () => setShowBreedPicker(false),
            t('fitting.horses.form.placeholders.selectBreed')
          )}
        </Modal>

        <Modal
          visible={showDisciplinePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDisciplinePicker(false)}
        >
          {reference && renderPicker(
            reference.disciplines,
            selectedDiscipline,
            setSelectedDiscipline,
            () => setShowDisciplinePicker(false),
            t('fitting.horses.form.placeholders.selectDiscipline')
          )}
        </Modal>

        <Modal
          visible={showLevelPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLevelPicker(false)}
        >
          {reference && renderPicker(
            reference.levels,
            selectedLevel,
            setSelectedLevel,
            () => setShowLevelPicker(false),
            t('fitting.horses.form.placeholders.selectLevel')
          )}
        </Modal>

        <Modal
          visible={showSexPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSexPicker(false)}
        >
          {renderNumberPicker(
            [
              { value: SexType.Male, label: t('fitting.horses.form.sex.male') },
              { value: SexType.Female, label: t('fitting.horses.form.sex.female') },
            ],
            sex,
            setSex,
            () => setShowSexPicker(false),
            t('fitting.horses.form.fields.sex')
          )}
        </Modal>

        <Modal
          visible={showBackTypePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBackTypePicker(false)}
        >
          {renderEnumPicker(
            [
              { value: 'Straight', label: t('fitting.horses.form.backType.straight') },
              { value: 'Concave', label: t('fitting.horses.form.backType.concave') },
              { value: 'Convex', label: t('fitting.horses.form.backType.convex') },
              { value: 'Other', label: t('fitting.horses.form.backType.other') },
            ],
            backType,
            setBackType,
            () => setShowBackTypePicker(false),
            t('fitting.horses.form.fields.backType')
          )}
        </Modal>

        <Modal
          visible={showWithersTypePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowWithersTypePicker(false)}
        >
          {renderEnumPicker(
            [
              { value: 'Prominent', label: t('fitting.horses.form.withersType.prominent') },
              { value: 'Medium', label: t('fitting.horses.form.withersType.medium') },
              { value: 'Flat', label: t('fitting.horses.form.withersType.flat') },
              { value: 'Other', label: t('fitting.horses.form.withersType.other') },
            ],
            withersType,
            setWithersType,
            () => setShowWithersTypePicker(false),
            t('fitting.horses.form.fields.withersType')
          )}
        </Modal>

        <Modal
          visible={showShoulderTypePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowShoulderTypePicker(false)}
        >
          {renderEnumPicker(
            [
              { value: 'Inclined', label: t('fitting.horses.form.shoulderType.inclined') },
              { value: 'Straight', label: t('fitting.horses.form.shoulderType.straight') },
              { value: 'Other', label: t('fitting.horses.form.shoulderType.other') },
            ],
            shoulderType,
            setShoulderType,
            () => setShowShoulderTypePicker(false),
            t('fitting.horses.form.fields.shoulderType')
          )}
        </Modal>
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  subsection: {
    marginTop: Spacing.md,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  field: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  selectButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
  saveButton: {
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalScroll: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  pickerItemText: {
    fontSize: 16,
  },
});
