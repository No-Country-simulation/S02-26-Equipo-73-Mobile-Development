import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText, ThemedButton } from '@/src';
import { useAuth } from '@/src/hooks/useAuth';
import { Spacing, BorderRadius, Colors } from '@/src/constants';
import { useColorScheme, useOnboarding } from '@/src/hooks';
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
    const { isAuthenticated, user, logout } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { resetOnboarding } = useOnboarding();
    const { preferences, updatePreferences } = useUserStore();
    
    // Estados locales para switches
    const [notifications, setNotifications] = useState(true);

    // Handler para cambiar el tema
    const handleThemeToggle = (enabled: boolean) => {
        updatePreferences({ theme: enabled ? 'dark' : 'light' });
    };

    // Función helper para adaptar colores al tema
    const getIconBg = (lightColor: string, darkColor: string) =>
        colorScheme === 'dark' ? darkColor : lightColor;
    const handleResetOnboarding = () => {
        Alert.alert(
            'Reiniciar Tutorial',
            '¿Deseas ver el tutorial de bienvenida nuevamente? La app se reiniciará.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Reiniciar',
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
            title: 'Dark Mode',
            icon: 'bulb',
            iconColor: '#8B7FD8',
            iconBg: getIconBg('#F0EEFF', 'rgba(139, 127, 216, 0.2)'),
            hasSwitch: true,
            switchValue: colorScheme === 'dark',
            onSwitchChange: handleThemeToggle,
        },
        {
            id: 'language',
            title: 'Language',
            icon: 'global',
            iconColor: '#4CAF50',
            iconBg: getIconBg('#E8F5E9', 'rgba(76, 175, 80, 0.2)'),
            rightText: 'English (US)',
            onPress: () => router.push('/settings/preferences'),
        },
        {
            id: 'restartTuturial',
            title: 'Restart Tutorial',
            icon: 'backward',
            iconColor: '#e9e512',
            iconBg: getIconBg('#E8F5E9', 'rgba(76, 175, 80, 0.2)'),
            //   rightText: 'English (US)',
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

    const handleLogout = () => {
        logout();
    };

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
                    <ThemedText style={styles.headerTitle}>Settings</ThemedText>
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Usuario info si está autenticado */}
                    {isAuthenticated && user ? (
                        <View style={[styles.userCard, { backgroundColor: colors.card }]}>
                            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                <ThemedText style={styles.avatarText}>
                                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                </ThemedText>
                            </View>
                            <View style={styles.userInfo}>
                                <ThemedText style={styles.userName}>{user.name || 'Usuario'}</ThemedText>
                                <ThemedText style={[styles.userRole, { color: colors.textSecondary }]}>Premium Member</ThemedText>
                            </View>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => router.push('/(tabs)/profile')}
                            >
                                <AntDesignIcon name="edit" size={20} color="#00D4DD" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        /* Mensaje si no está autenticado */
                        <View style={[styles.loginPrompt, { backgroundColor: colors.backgroundSecondary }]}>
                            <ThemedText style={[styles.loginPromptText, { color: colors.textSecondary }]}>
                                Inicia sesión para acceder a más funciones
                            </ThemedText>
                            <ThemedButton
                                label='Iniciar Sesión'
                                onPress={() => router.push('/auth/login')}
                                style={styles.loginButton}
                            />
                        </View>
                    )}

                    {/* Preferences Section */}
                    {renderSection('Preferences', preferencesItems)}

                    {/* App Controls Section */}
                    {renderSection('App Controls', appControlsItems)}

                    {/* Sign Out Button - Solo si está autenticado */}
                    {isAuthenticated && (
                        <TouchableOpacity
                            style={[styles.signOutButton, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 59, 48, 0.15)' : '#FFF0F0' }]}
                            onPress={handleLogout}
                        >
                            <AntDesignIcon name="logout" size={18} color="#FF3B30" />
                            <Text style={styles.signOutText}>Sign Out</Text>
                        </TouchableOpacity>
                    )}
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
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
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
    editButton: {
        padding: Spacing.sm,
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
