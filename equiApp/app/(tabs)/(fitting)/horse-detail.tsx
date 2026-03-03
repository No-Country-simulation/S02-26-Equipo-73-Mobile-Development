/**
 * Horse Detail Screen
 * Shows complete information about a horse including measurements
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText, ThemedView, ThemedButton } from '@/src';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import { useHorse, useDeleteHorse } from '@/src/services/horses.service';
import type { Horse } from '@/src/types/horse.types';
import {
  getSexLabel,
  getBackTypeLabel,
  getWithersTypeLabel,
  getShoulderTypeLabel,
} from '@/src/types/horse.types';

export default function HorseDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const horseId = params.horseId ? Number(params.horseId) : null;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // React Query hooks
  const { data: horse, isLoading, error, refetch, isRefetching } = useHorse(horseId);
  const deleteMutation = useDeleteHorse();

  useEffect(() => {
    if (!horseId) {
      router.back();
    }
  }, [horseId]);

  const handleEdit = () => {
    if (horse) {
      router.push({
        pathname: '/horse-form',
        params: { horseId: horse.id },
      });
    }
  };

  const handleDelete = () => {
    if (!horse) return;

    Alert.alert(
      'Delete Horse',
      `Are you sure you want to delete ${horse.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(horse.id);
              Alert.alert('Success', 'Horse deleted successfully', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Could not delete horse');
            }
          },
        },
      ]
    );
  };

  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    if (years < 1) {
      return `${Math.max(1, months)} month${months !== 1 ? 's' : ''} old`;
    }

    return `${years} year${years !== 1 ? 's' : ''} old`;
  };

  const renderInfoRow = (label: string, value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') return null;

    return (
      <View style={styles.infoRow}>
        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
          {label}
        </ThemedText>
        <ThemedText style={styles.infoValue}>{value}</ThemedText>
      </View>
    );
  };

  const renderMeasurementCard = (
    title: string,
    value: number | null | undefined,
    unit: string = 'cm'
  ) => {
    if (value === null || value === undefined) return null;

    return (
      <View style={[styles.measurementCard, { backgroundColor: colors.card }]}>
        <ThemedText style={[styles.measurementLabel, { color: colors.textSecondary }]}>
          {title}
        </ThemedText>
        <ThemedText style={styles.measurementValue}>
          {value} {unit}
        </ThemedText>
      </View>
    );
  };

  const renderTypeCard = (title: string, value: string) => {
    return (
      <View style={[styles.typeCard, { backgroundColor: colors.card }]}>
        <ThemedText style={[styles.typeLabel, { color: colors.textSecondary }]}>
          {title}
        </ThemedText>
        <ThemedText style={styles.typeValue}>{value}</ThemedText>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>Loading horse details...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!horse) {
    return null;
  }

  const hasMeasurements =
    horse.measurement &&
    (horse.measurement.withersHeight ||
      horse.measurement.backLength ||
      horse.measurement.chestCircumference ||
      horse.measurement.withersWidth ||
      horse.measurement.neckLength ||
      horse.measurement.cannonCircumference ||
      horse.measurement.headLength);

  const hasBodyTypes =
    horse.measurement &&
    (horse.measurement.backType !== null ||
      horse.measurement.withersType !== null ||
      horse.measurement.shoulderType !== null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesignIcon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Horse Details</ThemedText>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <AntDesignIcon name="edit" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Hero Section */}
          <View style={[styles.heroSection, { backgroundColor: colors.card }]}>
            <View style={[styles.horseIcon, { backgroundColor: `${colors.primary}20` }]}>
              <AntDesignIcon name="star" size={48} color={colors.primary} />
            </View>
            <ThemedText style={styles.horseName}>{horse.name}</ThemedText>
            <View style={styles.horseMeta}>
              <View style={[styles.metaBadge, { backgroundColor: `${colors.secondary}15` }]}>
                <ThemedText style={[styles.metaBadgeText, { color: colors.secondary }]}>
                  {getSexLabel(horse.sex)}
                </ThemedText>
              </View>
              <ThemedText style={[styles.ageText, { color: colors.textSecondary }]}>
                {calculateAge(horse.birthDate)}
              </ThemedText>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              {renderInfoRow('Breed', horse.breedName)}
              {renderInfoRow('Discipline', horse.disciplineName)}
              {renderInfoRow('Level', horse.levelName)}
              {renderInfoRow(
                'Birth Date',
                new Date(horse.birthDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              )}
              {renderInfoRow('Status', horse.isActive ? 'Active' : 'Inactive')}
            </View>
          </View>

          {/* Measurements */}
          {hasMeasurements && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Measurements</ThemedText>
              <View style={styles.measurementsGrid}>
                {renderMeasurementCard('Withers Height', horse.measurement.withersHeight)}
                {renderMeasurementCard('Back Length', horse.measurement.backLength)}
                {renderMeasurementCard('Chest Circumference', horse.measurement.chestCircumference)}
                {renderMeasurementCard('Withers Width', horse.measurement.withersWidth)}
                {renderMeasurementCard('Neck Length', horse.measurement.neckLength)}
                {renderMeasurementCard('Cannon Circumference', horse.measurement.cannonCircumference)}
                {renderMeasurementCard('Head Length', horse.measurement.headLength)}
              </View>
            </View>
          )}

          {/* Body Types */}
          {hasBodyTypes && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Body Type</ThemedText>
              <View style={styles.typesContainer}>
                {horse.measurement.backType !== null &&
                  horse.measurement.backType !== undefined &&
                  renderTypeCard('Back Type', getBackTypeLabel(horse.measurement.backType))}
                {horse.measurement.withersType !== null &&
                  horse.measurement.withersType !== undefined &&
                  renderTypeCard('Withers Type', getWithersTypeLabel(horse.measurement.withersType))}
                {horse.measurement.shoulderType !== null &&
                  horse.measurement.shoulderType !== undefined &&
                  renderTypeCard('Shoulder Type', getShoulderTypeLabel(horse.measurement.shoulderType))}
              </View>
            </View>
          )}

          {/* Metadata */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Record Information</ThemedText>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              {renderInfoRow(
                'Created',
                new Date(horse.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              )}
              {renderInfoRow(
                'Last Updated',
                new Date(horse.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              )}
            </View>
          </View>

          {/* Delete Button */}
          <View style={styles.dangerZone}>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.deleteButton, { borderColor: '#FF3B30', backgroundColor: 'transparent' }]}
            >
              <ThemedText style={styles.deleteButtonText}>Delete Horse</ThemedText>
            </TouchableOpacity>
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
  editButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  heroSection: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  horseIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  horseName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  horseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  metaBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ageText: {
    fontSize: 16,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  infoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  measurementCard: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  measurementLabel: {
    fontSize: 13,
  },
  measurementValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  typesContainer: {
    gap: Spacing.md,
  },
  typeCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 15,
  },
  typeValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerZone: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,59,48,0.2)',
  },
  deleteButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 16,
  },
});
