/**
 * Pantalla de Preferencias
 * Permite configurar tema, idioma y otras opciones de la app
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView, ThemedText } from '@/src';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Spacing, BorderRadius } from '@/src/constants';

type Language = 'es' | 'en';
type ThemeMode = 'light' | 'dark' | 'system';

export default function PreferencesScreen() {
  const router = useRouter();
  const currentTheme = useColorScheme();
  
  // Estados locales (en producción estos vendrían de un store/AsyncStorage)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('es');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const languages = [
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  ];

  const themeModes = [
    { mode: 'light' as ThemeMode, name: 'Claro', icon: '☀️' },
    { mode: 'dark' as ThemeMode, name: 'Oscuro', icon: '🌙' },
    { mode: 'system' as ThemeMode, name: 'Sistema', icon: '⚙️' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>← Volver</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            Preferencias
          </ThemedText>
        </View>

        {/* Sección de Apariencia */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Apariencia</ThemedText>
          
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Tema</ThemedText>
            <View style={styles.themeOptions}>
              {themeModes.map((theme) => (
                <TouchableOpacity
                  key={theme.mode}
                  style={[
                    styles.themeButton,
                    themeMode === theme.mode && styles.themeButtonActive,
                  ]}
                  onPress={() => setThemeMode(theme.mode)}
                >
                  <ThemedText style={styles.themeIcon}>{theme.icon}</ThemedText>
                  <ThemedText
                    style={[
                      styles.themeText,
                      themeMode === theme.mode && styles.themeTextActive,
                    ]}
                  >
                    {theme.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <ThemedText style={styles.hint}>
              Tema actual: {currentTheme === 'dark' ? 'Oscuro' : 'Claro'}
            </ThemedText>
          </View>
        </View>

        {/* Sección de Idioma */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Idioma</ThemedText>
          
          <View style={styles.card}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  lang.code !== languages[languages.length - 1].code && styles.languageItemBorder,
                ]}
                onPress={() => setSelectedLanguage(lang.code)}
              >
                <View style={styles.languageLeft}>
                  <ThemedText style={styles.languageFlag}>{lang.flag}</ThemedText>
                  <ThemedText style={styles.languageName}>{lang.name}</ThemedText>
                </View>
                {selectedLanguage === lang.code && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sección de Notificaciones */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notificaciones</ThemedText>
          
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <ThemedText style={styles.settingTitle}>🔔 Push Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Recibe alertas sobre tu actividad
                </ThemedText>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#ddd', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingLeft}>
                <ThemedText style={styles.settingTitle}>📧 Email Updates</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Recibe novedades por correo
                </ThemedText>
              </View>
              <Switch
                value={emailUpdates}
                onValueChange={setEmailUpdates}
                trackColor={{ false: '#ddd', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Nota informativa */}
        <View style={styles.infoBox}>
          <ThemedText style={styles.infoText}>
            💡 Los cambios se aplicarán automáticamente
          </ThemedText>
        </View>
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
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: Spacing.sm,
  },
  title: {
    marginBottom: 0,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  themeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#e7f3ff',
  },
  themeIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  themeText: {
    fontSize: 14,
    opacity: 0.7,
  },
  themeTextActive: {
    fontWeight: '600',
    opacity: 1,
    color: '#007AFF',
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  languageItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  languageName: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  settingLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.8,
  },
});
