import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Switch, Alert, Platform, ActionSheetIOS } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedView, ThemedText } from '@/src';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme, useOnboarding, useLanguage } from '@/src/hooks';
import { useUserStore } from '@/src/stores/user.store';
import AntDesignIcon from '@expo/vector-icons/AntDesign';

type MenuItem = {
    id: string;
    title: string;
    icon: string;
    iconColor: string;
    iconBg: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    rightText?: string;
    onPress?: () => void;
};

/**
 * Pantalla de Settings (pública)
 * Configuración general de la app disponible para todos los usuarios
 */
export default function SettingsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { resetOnboarding } = useOnboarding();
    const { updatePreferences } = useUserStore();
    const { getCurrentLanguageName, changeLanguage, languageOptions } = useLanguage();
    
    // Estados locales para switches
    const [notifications, setNotifications] = useState(true);

    // Handler para cambiar el tema
    const handleThemeToggle = (enabled: boolean) => {
        updatePreferences({ theme: enabled ? 'dark' : 'light' });
    };

    // Función helper para adaptar colores al tema
    const getIconBg = (lightColor: string, darkColor: string) =>
        colorScheme === 'dark' ? darkColor : lightColor;
    
    // Handler para cambiar idioma
    const handleLanguagePress = () => {
        const systemOption = t('settings.language.useDeviceLanguage');
        const englishOption = languageOptions['en-US'].nativeName;
        const spanishOption = languageOptions['es-ES'].nativeName;
        
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    title: t('settings.language.selectLanguage'),
                    options: [
                        t('common.cancel'),
                        systemOption,
                        englishOption,
                        spanishOption,
                    ],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) changeLanguage('system');
                    else if (buttonIndex === 2) changeLanguage('en-US');
                    else if (buttonIndex === 3) changeLanguage('es-ES');
                }
            );
        } else {
            Alert.alert(
                t('settings.language.selectLanguage'),
                '',
                [
                    { text: t('common.cancel'), style: 'cancel' },
                    {
                        text: systemOption,
                        onPress: () => changeLanguage('system'),
                    },
                    {
                        text: englishOption,
                        onPress: () => changeLanguage('en-US'),
                    },
                    {
                        text: spanishOption,
                        onPress: () => changeLanguage('es-ES'),
                    },
                ],
                { cancelable: true }
            );
        }
    };
    
    const handleResetOnboarding = () => {
        Alert.alert(
            t('settings.restartTutorial'),
            t('settings.restartTutorialConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.confirm'),
                    style: 'destructive',
                    onPress: async () => {
                        await resetOnboarding();
                        router.replace('/onboarding');
                    },
                },
            ]
        );
    };
    // Sección de Preferences
    const preferencesItems: MenuItem[] = [
        {
            id: 'theme',
            title: t('settings.darkMode'),
            icon: 'bulb',
            iconColor: '#8B7FD8',
            iconBg: getIconBg('#F0EEFF', 'rgba(139, 127, 216, 0.2)'),
            hasSwitch: true,
            switchValue: colorScheme === 'dark',
            onSwitchChange: handleThemeToggle,
        },
        {
            id: 'language',
            title: t('settings.language.title'),
            icon: 'global',
            iconColor: '#4CAF50',
            iconBg: getIconBg('#E8F5E9', 'rgba(76, 175, 80, 0.2)'),
            rightText: getCurrentLanguageName(),
            onPress: handleLanguagePress,
        },
        {
            id: 'restartTuturial',
            title: t('settings.restartTutorial'),
            icon: 'backward',
            iconColor: '#e9e512',
            iconBg: getIconBg('#E8F5E9', 'rgba(76, 175, 80, 0.2)'),
            onPress: handleResetOnboarding,
        },
    ];

    // Sección de App Controls
    const appControlsItems: MenuItem[] = [
        // {
        //     id: 'notifications',
        //     title: 'Push Notifications',
        //     icon: 'notification',
        //     iconColor: '#FF9800',
        //     iconBg: getIconBg('#FFF3E0', 'rgba(255, 152, 0, 0.2)'),
        //     hasSwitch: true,
        //     switchValue: notifications,
        //     onSwitchChange: setNotifications,
        // },
        // {
        //     id: 'privacy',
        //     title: 'Privacy Settings',
        //     icon: 'lock',
        //     iconColor: '#F44336',
        //     iconBg: getIconBg('#FFEBEE', 'rgba(244, 67, 54, 0.2)'),
        //     onPress: () => router.push('/settings/preferences'),
        // },
        // {
        //     id: 'storage',
        //     title: 'Data & Storage',
        //     icon: 'database',
        //     iconColor: '#2196F3',
        //     iconBg: getIconBg('#E3F2FD', 'rgba(33, 150, 243, 0.2)'),
        //     onPress: () => router.push('/settings/preferences'),
        // },
    ];

    const renderSection = (title: string, items: MenuItem[]) => (
        <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#8C8C8C' : '#8C8C8C' }]}>{title.toUpperCase()}</ThemedText>
            <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.menuItem,
                            index !== items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                        ]}
                        onPress={item.hasSwitch ? undefined : item.onPress}
                        disabled={item.hasSwitch}
                        activeOpacity={item.hasSwitch ? 1 : 0.7}
                    >
                        <View style={styles.menuItemContent}>
                            <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                                <AntDesignIcon name={item.icon as any} size={20} color={item.iconColor} />
                            </View>
                            <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                        </View>
                        {item.hasSwitch ? (
                            <Switch
                                value={item.switchValue}
                                onValueChange={item.onSwitchChange}
                                trackColor={{ false: '#D1D1D6', true: colors.success }}
                                thumbColor="#fff"
                            />
                        ) : item.rightText ? (
                            <View style={styles.rightContent}>
                                <ThemedText style={[styles.rightText, { color: colors.textSecondary }]}>{item.rightText}</ThemedText>
                                <AntDesignIcon name="right" size={16} color={colors.textSecondary} />
                            </View>
                        ) : (
                            <AntDesignIcon name="right" size={16} color={colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ThemedView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <AntDesignIcon name="arrow-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText variant='subheading1'>{t('settings.title')}</ThemedText>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Preferences Section */}
                    {renderSection(t('settings.preferences'), preferencesItems)}

                    {/* App Controls Section */}
                    {renderSection(t('settings.appControls'), appControlsItems)}
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
    },
    backButton: {
        padding: Spacing.sm,
    },
    placeholder: {
        width: 40,
    },
    content: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        backgroundColor: '#fff',
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    userInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
    },
    loginPrompt: {
        padding: Spacing.xl,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.xs,
        alignItems: 'center',
    },
    loginPromptText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    loginButton: {
        paddingVertical: 0,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: Spacing.md,
        marginLeft: Spacing.xs,
        letterSpacing: 0.5,
    },
    menuContainer: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        minHeight: 64,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    rightText: {
        fontSize: 14,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    signOutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: Spacing.md,
        marginBottom: Spacing.xl,
    },
});
