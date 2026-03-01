/**
 * Horses Management Screen
 * Allows viewing, editing, and deleting horses
 */

import React, { useEffect, useState } from 'react';
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
import { getHorses, deleteHorse } from '@/src/services/horses.service';
import type { Horse } from '@/src/types/horse.types';
import { getSexLabel } from '@/src/types/horse.types';

export default function HorsesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isLoading, setIsLoading] = useState(true);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHorses();
  }, []);

  const loadHorses = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await getHorses();
      setHorses(response.data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not load horses');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadHorses(true);
  };

  const handleDelete = async (horse: Horse) => {
    Alert.alert(
      'Delete Horse',
      `Are you sure you want to delete ${horse.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHorse(horse.id);
              setHorses((prev) => prev.filter((h) => h.id !== horse.id));
              Alert.alert('Success', 'Horse deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Could not delete horse');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (horse: Horse) => {
    router.push({
      pathname: '/settings/horse-form',
      params: { horseId: horse.id },
    });
  };

  const handleViewDetails = (horse: Horse) => {
    router.push({
      pathname: '/settings/horse-detail',
      params: { horseId: horse.id },
    });
  };

  const handleAddNew = () => {
    router.push('/settings/horse-form');
  };

  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years < 1) {
      return `${Math.max(1, months)} month${months !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    horse: Horse
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
            onPress={() => handleEdit(horse)}
          >
            <AntDesignIcon name="edit" size={20} color="#fff" />
            <Text style={styles.swipeButtonText}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ translateX: translateDelete }] }}>
          <TouchableOpacity
            style={[styles.swipeButton, { backgroundColor: '#FF3B30' }]}
            onPress={() => handleDelete(horse)}
          >
            <AntDesignIcon name="delete" size={20} color="#fff" />
            <Text style={styles.swipeButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderHorseItem = (horse: Horse) => (
    <Swipeable
      key={horse.id}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, horse)
      }
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity
        style={[styles.horseItem, { backgroundColor: colors.card }]}
        onPress={() => handleViewDetails(horse)}
        activeOpacity={0.7}
      >
        <View style={styles.horseContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <AntDesignIcon name="star" size={24} color={colors.primary} />
          </View>
          <View style={styles.horseInfo}>
            <ThemedText style={styles.horseName}>{horse.name}</ThemedText>
            <View style={styles.horseDetails}>
              <ThemedText style={[styles.horseDetail, { color: colors.textSecondary }]}>
                {getSexLabel(horse.sex)} • {calculateAge(horse.birthDate)}
              </ThemedText>
            </View>
            <View style={styles.horseTags}>
              <View style={[styles.tag, { backgroundColor: `${colors.secondary}15` }]}>
                <ThemedText style={[styles.tagText, { color: colors.secondary }]}>
                  {horse.breedName}
                </ThemedText>
              </View>
              <View style={[styles.tag, { backgroundColor: `${colors.primary}15` }]}>
                <ThemedText style={[styles.tagText, { color: colors.primary }]}>
                  {horse.disciplineName}
                </ThemedText>
              </View>
            </View>
          </View>
          <AntDesignIcon name="right" size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>Loading horses...</ThemedText>
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
            <ThemedText style={styles.headerTitle}>My Horses</ThemedText>
            <View style={{ width: 24 }} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            {horses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <AntDesignIcon name="star" size={64} color={colors.textSecondary} />
                <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                  No horses yet
                </ThemedText>
                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Add your first horse to start tracking measurements and details
                </ThemedText>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {horses.map((horse) => renderHorseItem(horse))}
              </View>
            )}
          </ScrollView>

          {/* Floating Action Button */}
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary }]}
            onPress={handleAddNew}
            activeOpacity={0.8}
          >
            <AntDesignIcon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  listContainer: {
    gap: Spacing.md,
  },
  horseItem: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  horseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horseInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  horseName: {
    fontSize: 17,
    fontWeight: '600',
  },
  horseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horseDetail: {
    fontSize: 14,
  },
  horseTags: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
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
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 22,
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
