import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { 
  getSystemLanguage, 
  LANGUAGE_KEY, 
  LANGUAGE_PREFERENCE_KEY,
  SUPPORTED_LANGUAGES 
} from '@/src/locales/i18nConfig';

export type LanguageOption = 'system' | 'en-US' | 'es-ES';

interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGE_OPTIONS: Record<LanguageOption, LanguageInfo> = {
  system: {
    code: 'system',
    name: 'Use device language',
    nativeName: 'Use device language',
  },
  'en-US': {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
  },
};

export const useLanguage = () => {
  const { i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18nInstance.language);
  const [languagePreference, setLanguagePreference] = useState<LanguageOption>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencia al montar
  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const preference = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_KEY);
      const actualLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      
      setLanguagePreference((preference as LanguageOption) || 'system');
      if (actualLanguage) {
        setCurrentLanguage(actualLanguage);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (option: LanguageOption) => {
    try {
      let languageToUse: string;

      if (option === 'system') {
        // Usar idioma del sistema
        languageToUse = getSystemLanguage();
        await AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, 'system');
      } else {
        // Usar idioma específico
        languageToUse = option;
        await AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, option);
      }

      // Guardar el idioma actual y cambiar
      await AsyncStorage.setItem(LANGUAGE_KEY, languageToUse);
      await i18nInstance.changeLanguage(languageToUse);
      
      setLanguagePreference(option);
      setCurrentLanguage(languageToUse);
      
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  };

  // Obtener el nombre del idioma actual
  const getCurrentLanguageName = () => {
    if (languagePreference === 'system') {
      const systemLang = getSystemLanguage();
      const langInfo = LANGUAGE_OPTIONS[systemLang as LanguageOption];
      const systemLangName = langInfo ? langInfo.nativeName : systemLang;
      
      // Si el idioma actual es español, mostrar en español
      if (currentLanguage === 'es-ES') {
        return `${systemLangName} (Automático)`;
      }
      return `${systemLangName} (Auto)`;
    }
    
    const langInfo = LANGUAGE_OPTIONS[languagePreference];
    return langInfo?.nativeName || languagePreference;
  };

  return {
    currentLanguage,
    languagePreference,
    isLoading,
    changeLanguage,
    getCurrentLanguageName,
    availableLanguages: SUPPORTED_LANGUAGES,
    languageOptions: LANGUAGE_OPTIONS,
  };
};
