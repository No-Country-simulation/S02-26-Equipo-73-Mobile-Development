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
import { ThemedText, ThemedView, ThemedInput, ThemedButton } from '@/src';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getHorseReference,
  getHorseById,
  createHorse,
  updateHorse,
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
  const params = useLocalSearchParams();
  const horseId = params.horseId ? Number(params.horseId) : null;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [reference, setReference] = useState<HorseReference | null>(null);
  const [currentHorse, setCurrentHorse] = useState<Horse | null>(null);

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load reference data
      const refResponse = await getHorseReference();
      setReference(refResponse.data);

      // If editing, load current horse
      if (horseId) {
        const horseResponse = await getHorseById(horseId);
        const horse = horseResponse.data;
        setCurrentHorse(horse);

        // Set basic fields
        setName(horse.name);
        setBirthDate(new Date(horse.birthDate));
        setSex(horse.sex === 'Male' ? SexType.Male : SexType.Female);

        // Set references
        const breed = refResponse.data.breeds.find((b) => b.id === horse.breedId);
        setSelectedBreed(breed || null);

        const discipline = refResponse.data.disciplines.find((d) => d.id === horse.disciplineId);
        setSelectedDiscipline(discipline || null);

        const level = refResponse.data.levels.find((l) => l.id === horse.levelId);
        setSelectedLevel(level || null);

        // Set measurements if they exist
        if (horse.measurement) {
          const m = horse.measurement;
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
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not load data');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validations
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the horse');
      return;
    }

    if (!selectedBreed) {
      Alert.alert('Error', 'Please select a breed');
      return;
    }

    if (!selectedDiscipline) {
      Alert.alert('Error', 'Please select a discipline');
      return;
    }

    if (!selectedLevel) {
      Alert.alert('Error', 'Please select a level');
      return;
    }

    try {
      setIsSaving(true);

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

        await updateHorse(horseId, updateData);
        Alert.alert('Success', 'Horse updated successfully');
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

        await createHorse(createData);
        Alert.alert('Success', 'Horse created successfully');
      }

      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not save horse');
    } finally {
      setIsSaving(false);
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
              Not specified
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
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
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
            {horseId ? 'Edit Horse' : 'New Horse'}
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
            <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>

            {/* Name */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Name *</ThemedText>
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
                placeholder="Enter horse name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Birth Date */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Birth Date *</ThemedText>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.selectValue}>
                  {birthDate.toLocaleDateString('en-US', {
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
              <ThemedText style={styles.label}>Sex *</ThemedText>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setShowSexPicker(true)}
              >
                <ThemedText style={styles.selectValue}>
                  {sex === SexType.Male ? 'Male' : 'Female'}
                </ThemedText>
                <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Breed */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Breed *</ThemedText>
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
                  {selectedBreed?.name || 'Select breed'}
                </ThemedText>
                <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Discipline */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Discipline *</ThemedText>
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
                  {selectedDiscipline?.name || 'Select discipline'}
                </ThemedText>
                <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Level */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Level *</ThemedText>
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
                  {selectedLevel?.name || 'Select level'}
                </ThemedText>
                <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Measurements Section (Optional) */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Measurements (Optional)</ThemedText>
            <ThemedText style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              All measurements are optional. Add only what you know.
            </ThemedText>

            {/* Linear Measurements (cm) */}
            <View style={styles.subsection}>
              <ThemedText style={styles.subsectionTitle}>Dimensions (cm)</ThemedText>

              <View style={styles.row}>
                <View style={styles.halfField}>
                  <ThemedText style={styles.label}>Withers Height</ThemedText>
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
                  <ThemedText style={styles.label}>Back Length</ThemedText>
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
                  <ThemedText style={styles.label}>Chest Circumference</ThemedText>
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
                  <ThemedText style={styles.label}>Withers Width</ThemedText>
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
                  <ThemedText style={styles.label}>Neck Length</ThemedText>
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
                  <ThemedText style={styles.label}>Cannon Circumference</ThemedText>
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
                <ThemedText style={styles.label}>Head Length</ThemedText>
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
              <ThemedText style={styles.subsectionTitle}>Body Type</ThemedText>

              <View style={styles.field}>
                <ThemedText style={styles.label}>Back Type</ThemedText>
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
                    {backType || 'Not specified'}
                  </ThemedText>
                  <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <ThemedText style={styles.label}>Withers Type</ThemedText>
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
                    {withersType || 'Not specified'}
                  </ThemedText>
                  <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <ThemedText style={styles.label}>Shoulder Type</ThemedText>
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
                    {shoulderType || 'Not specified'}
                  </ThemedText>
                  <AntDesignIcon name="down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <ThemedButton
              label={isSaving ? 'Saving...' : horseId ? 'Update Horse' : 'Create Horse'}
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
            'Select Breed'
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
            'Select Discipline'
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
            'Select Level'
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
              { value: SexType.Male, label: 'Male' },
              { value: SexType.Female, label: 'Female' },
            ],
            sex,
            setSex,
            () => setShowSexPicker(false),
            'Select Sex'
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
              { value: 'Straight', label: 'Straight' },
              { value: 'Concave', label: 'Concave' },
              { value: 'Convex', label: 'Convex' },
              { value: 'Other', label: 'Other' },
            ],
            backType,
            setBackType,
            () => setShowBackTypePicker(false),
            'Select Back Type'
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
              { value: 'Prominent', label: 'Prominent' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Flat', label: 'Flat' },
              { value: 'Other', label: 'Other' },
            ],
            withersType,
            setWithersType,
            () => setShowWithersTypePicker(false),
            'Select Withers Type'
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
              { value: 'Inclined', label: 'Inclined' },
              { value: 'Straight', label: 'Straight' },
              { value: 'Other', label: 'Other' },
            ],
            shoulderType,
            setShoulderType,
            () => setShowShoulderTypePicker(false),
            'Select Shoulder Type'
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
