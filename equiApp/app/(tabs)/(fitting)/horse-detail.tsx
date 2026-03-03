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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      t('fitting.horses.deleteHorse'),
      t('fitting.horses.deleteConfirmPermanent', { name: horse.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(horse.id);
              Alert.alert(t('common.success'), t('fitting.horses.deleteSuccess'), [
                { text: t('common.confirm'), onPress: () => router.back() },
              ]);
            } catch (error: any) {
              Alert.alert(t('common.error'), error.message || t('common.error'));
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
          <ThemedText style={styles.loadingText}>{t('common.loading')}</ThemedText>
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
          <ThemedText style={styles.headerTitle}>{t('fitting.horses.horseDetails')}</ThemedText>
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
            <ThemedText style={styles.sectionTitle}>{t('fitting.horses.basicInfo')}</ThemedText>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              {renderInfoRow(t('fitting.horses.breed'), horse.breedName)}
              {renderInfoRow(t('fitting.horses.discipline'), horse.disciplineName)}
              {renderInfoRow(t('fitting.horses.form.fields.level'), horse.levelName)}
              {renderInfoRow(
                t('fitting.horses.birthDate'),
                new Date(horse.birthDate).toLocaleDateString(t('dates.locale'), {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              )}
              {renderInfoRow(t('fitting.horses.status'), horse.isActive ? t('fitting.horses.active') : t('fitting.horses.inactive'))}
            </View>
          </View>

          {/* Measurements */}
          {hasMeasurements && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>{t('fitting.horses.measurements')}</ThemedText>
              <View style={styles.measurementsGrid}>
                {renderMeasurementCard(t('fitting.horses.form.fields.withersHeight'), horse.measurement.withersHeight)}
                {renderMeasurementCard(t('fitting.horses.form.fields.backLength'), horse.measurement.backLength)}
                {renderMeasurementCard(t('fitting.horses.form.fields.chestCircumference'), horse.measurement.chestCircumference)}
                {renderMeasurementCard(t('fitting.horses.form.fields.withersWidth'), horse.measurement.withersWidth)}
                {renderMeasurementCard(t('fitting.horses.form.fields.neckLength'), horse.measurement.neckLength)}
                {renderMeasurementCard(t('fitting.horses.form.fields.cannonCircumference'), horse.measurement.cannonCircumference)}
                {renderMeasurementCard(t('fitting.horses.form.fields.headLength'), horse.measurement.headLength)}
              </View>
            </View>
          )}

          {/* Body Types */}
          {hasBodyTypes && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>{t('fitting.horses.bodyType')}</ThemedText>
              <View style={styles.typesContainer}>
                {horse.measurement.backType !== null &&
                  horse.measurement.backType !== undefined &&
                  renderTypeCard(t('fitting.horses.backType'), getBackTypeLabel(horse.measurement.backType))}
                {horse.measurement.withersType !== null &&
                  horse.measurement.withersType !== undefined &&
                  renderTypeCard(t('fitting.horses.withersType'), getWithersTypeLabel(horse.measurement.withersType))}
                {horse.measurement.shoulderType !== null &&
                  horse.measurement.shoulderType !== undefined &&
                  renderTypeCard(t('fitting.horses.shoulderType'), getShoulderTypeLabel(horse.measurement.shoulderType))}
              </View>
            </View>
          )}

          {/* Metadata */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('fitting.horses.recordInfo')}</ThemedText>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              {renderInfoRow(
                t('fitting.horses.createdAt'),
                new Date(horse.createdAt).toLocaleDateString(t('dates.locale'), {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              )}
              {renderInfoRow(
                t('fitting.horses.updatedAt'),
                new Date(horse.updatedAt).toLocaleDateString(t('dates.locale'), {
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
              <ThemedText style={styles.deleteButtonText}>{t('fitting.horses.deleteHorse')}</ThemedText>
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
