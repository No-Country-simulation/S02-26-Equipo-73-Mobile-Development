/**
 * Pantalla de Mis Medidas
 * Permite ver, agregar, editar y eliminar medidas del usuario
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedText, ThemedView } from '@/src';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import {
  useUserMeasurements,
  useDeleteUserMeasurement,
} from '@/src/services/measurements.service';
import type { Measurement } from '@/src/types/measurement.types';

export default function MeasurementsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // React Query hooks
  const { data: allMeasurements = [], isLoading, error, refetch, isRefetching } = useUserMeasurements();
  const deleteMutation = useDeleteUserMeasurement();

  // Filter only user (rider) measurements
  const measurements = useMemo(() => {
    return allMeasurements.filter(
      (m: Measurement) => m.entityTypeName.toLowerCase() === 'rider'
    );
  }, [allMeasurements]);

  const handleDelete = async (measurement: Measurement) => {
    Alert.alert(
      'Eliminar medida',
      `¿Estás seguro de eliminar ${measurement.measurementTypeName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(measurement.id);
              Alert.alert('Éxito', 'Medida eliminada correctamente');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar la medida');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (measurement: Measurement) => {
    router.push({
      pathname: '/measurement-form',
      params: { measurementId: measurement.id },
    });
  };

  const handleAddNew = () => {
    router.push('/measurement-form');
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    measurement: Measurement
  ) => {
    const translateEdit = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [75, 0],
    });

    const translateDelete = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [150, 0],
    });

    return (
      <View style={styles.swipeActionsContainer}>
        <Animated.View style={{ transform: [{ translateX: translateEdit }] }}>
          <TouchableOpacity
            style={[styles.swipeButton, { backgroundColor: colors.info }]}
            onPress={() => handleEdit(measurement)}
          >
            <AntDesignIcon name="edit" size={20} color="#fff" />
            <Text style={styles.swipeButtonText}>Editar</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ translateX: translateDelete }] }}>
          <TouchableOpacity
            style={[styles.swipeButton, { backgroundColor: '#FF3B30' }]}
            onPress={() => handleDelete(measurement)}
          >
            <AntDesignIcon name="delete" size={20} color="#fff" />
            <Text style={styles.swipeButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderMeasurementItem = (measurement: Measurement) => (
    <Swipeable
      key={measurement.id}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, measurement)
      }
      overshootRight={false}
      friction={2}
    >
      <View style={[styles.measurementItem, { backgroundColor: colors.card }]}>
        <View style={styles.measurementContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <AntDesignIcon name="profile" size={22} color={colors.primary} />
          </View>
          <View style={styles.measurementInfo}>
            <ThemedText style={styles.measurementName}>
              {measurement.measurementTypeName}
            </ThemedText>
            <ThemedText style={[styles.measurementDate, { color: colors.textSecondary }]}>
              {new Date(measurement.updatedAt).toLocaleDateString('es', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </ThemedText>
          </View>
          <View style={styles.measurementValue}>
            <ThemedText style={styles.value}>
              {measurement.value}
            </ThemedText>
            <ThemedText style={[styles.unit, { color: colors.textSecondary }]}>
              {measurement.unitSymbol}
            </ThemedText>
          </View>
        </View>
      </View>
    </Swipeable>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>Cargando medidas...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesignIcon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText variant="subheading1">Mis Medidas</ThemedText>
          <TouchableOpacity onPress={() => refetch()} style={styles.refreshButton}>
            <AntDesignIcon name="reload" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {measurements.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}15` }]}>
                <AntDesignIcon name="profile" size={48} color={colors.primary} />
              </View>
              <ThemedText style={styles.emptyTitle}>No hay medidas</ThemedText>
              <ThemedText style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                Agrega tus medidas corporales para un mejor ajuste de los productos
              </ThemedText>
              <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                onPress={handleAddNew}
              >
                <AntDesignIcon name="plus" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Agregar primera medida</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Hint */}
              <View style={[styles.hintCard, { backgroundColor: `${colors.info}15` }]}>
                <AntDesignIcon name="info-circle" size={16} color={colors.info} />
                <ThemedText style={[styles.hintText, { color: colors.info }]}>
                  Desliza hacia la izquierda para editar o eliminar
                </ThemedText>
              </View>

              {/* Lista de medidas */}
              <View style={styles.measurementsList}>
                {measurements.map((measurement) => renderMeasurementItem(measurement))}
              </View>
            </>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        {measurements.length > 0 && (
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary }]}
            onPress={handleAddNew}
            activeOpacity={0.8}
          >
            <AntDesignIcon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        </ThemedView>
      </SafeAreaView>
    </GestureHandlerRootView>
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
  refreshButton: {
    padding: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
  },
  measurementsList: {
    gap: Spacing.md,
  },
  measurementItem: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  measurementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  measurementInfo: {
    flex: 1,
  },
  measurementName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  measurementDate: {
    fontSize: 12,
  },
  measurementValue: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  unit: {
    fontSize: 14,
    marginTop: 2,
  },
  swipeActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeButton: {
    width: 75,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  swipeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
