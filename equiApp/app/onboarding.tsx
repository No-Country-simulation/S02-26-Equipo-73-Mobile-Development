import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/src/components/ui';
import { Colors, Spacing, BorderRadius } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingPage = {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    titleKey: string;
    subtitleKey: string;
    descriptionKey: string;
};

const ONBOARDING_PAGES: OnboardingPage[] = [
    {
        id: '1',
        icon: 'shirt-outline',
        titleKey: 'onboarding.page1.title',
        subtitleKey: 'onboarding.page1.subtitle',
        descriptionKey: 'onboarding.page1.description',
    },
    {
        id: '2',
        icon: 'resize-outline',
        titleKey: 'onboarding.page2.title',
        subtitleKey: 'onboarding.page2.subtitle',
        descriptionKey: 'onboarding.page2.description',
    },
    {
        id: '3',
        icon: 'checkmark-circle-outline',
        titleKey: 'onboarding.page3.title',
        subtitleKey: 'onboarding.page3.subtitle',
        descriptionKey: 'onboarding.page3.description',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleSkip = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/(tabs)');
    };

    const handleNext = () => {
        if (currentIndex < ONBOARDING_PAGES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleSkip();
        }
    };

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index || 0);
            }
        }
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <LinearGradient
                colors={[Colors.light.primary, Colors.dark.tertiary]}
                style={StyleSheet.absoluteFill}
            />
            {/* Skip Button */}
            {currentIndex < ONBOARDING_PAGES.length - 1 && (
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <ThemedText
                        variant="bodyRegular"
                        lightColor={Colors.light.accent}
                        style={styles.skipText}
                    >
                        {t('onboarding.skip')}
                    </ThemedText>
                </TouchableOpacity>
            )}

            {/* Content */}
            <FlatList
                ref={flatListRef}
                data={ONBOARDING_PAGES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.page}>
                        {/* Icon Circle */}
                        <View style={styles.iconContainer}>
                            <View style={styles.iconCircle}>
                                <Ionicons
                                    name={item.icon}
                                    size={120}
                                    color={Colors.light.accent}
                                />
                            </View>
                            {/* <View style={styles.badge}>
                                <Ionicons name="shield-checkmark" size={16} color="#fff" />
                                <ThemedText
                                    variant="caption"
                                    style={styles.badgeText}
                                    lightColor="#fff"
                                >
                                    IA VALIDADA
                                </ThemedText>
                            </View> */}
                        </View>

                        {/* Title */}
                        <View style={styles.textContainer}>
                            <ThemedText variant="heading3" style={styles.title}>
                                {t(item.titleKey)}
                            </ThemedText>
                            <ThemedText
                                variant="heading3"
                                style={styles.subtitle}
                                lightColor={Colors.light.accent}
                            >
                                {t(item.subtitleKey)}
                            </ThemedText>

                            {/* Description */}
                            <ThemedText
                                variant="bodyRegular"
                                style={styles.description}
                                lightColor={Colors.light.textSecondary}
                            >
                                {t(item.descriptionKey)}
                            </ThemedText>
                        </View>
                    </View>
                )}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {ONBOARDING_PAGES.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor:
                                    index === currentIndex
                                        ? Colors.light.accent
                                        : 'rgba(26, 150, 212, 0.3)',
                                width: index === currentIndex ? 32 : 8,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <ThemedText
                    variant="buttonRegular"
                    style={styles.buttonText}
                    lightColor={Colors.light.primary}
                >
                    {currentIndex === ONBOARDING_PAGES.length - 1
                        ? t('onboarding.getStarted')
                        : t('onboarding.continue')}{' '}
                    →
                </ThemedText>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.primary,
        padding: Spacing.sm
    },
    skipButton: {
        position: 'absolute',
        top: Spacing.lg,
        right: Spacing.lg,
        zIndex: 10,
        padding: Spacing.sm,
    },
    skipText: {
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    page: {
        width: SCREEN_WIDTH,
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    iconCircle: {
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: '#0A1929',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderStyle: 'dashed',
        borderColor: Colors.light.tertiary,
        shadowColor: Colors.light.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        backgroundColor: Colors.light.tertiary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginTop: Spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    badgeText: {
        fontWeight: '600',
    },
    textContainer: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    title: {
        textAlign: 'center',
        color: '#fff',
    },
    subtitle: {
        textAlign: 'center',
        marginTop: -Spacing.xs,
    },
    description: {
        textAlign: 'center',
        marginTop: Spacing.lg,
        lineHeight: 26,
        color: '#B0BEC5',
        paddingHorizontal: Spacing.sm,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.xl,
    },
    dot: {
        height: 8,
        borderRadius: BorderRadius.full,
    },
    button: {
        marginHorizontal: Spacing.xl,
        marginBottom: Spacing.xl,
        backgroundColor: Colors.light.accent,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        shadowColor: Colors.light.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontWeight: '700',
    },
});
