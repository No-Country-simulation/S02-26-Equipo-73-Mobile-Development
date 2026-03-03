
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import translationEn from "@/src/locales/en-US/translation.json";
import translationEs from "@/src/locales/es-ES/translation.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "app-language";
const LANGUAGE_PREFERENCE_KEY = "app-language-preference"; // 'system' o código de idioma

const resources = {
  "en-US": {
    translation: translationEn,
  },
  "es-ES": {
    translation: translationEs,
  },
};

// Idiomas soportados
export const SUPPORTED_LANGUAGES = ["en-US", "es-ES"];

// Obtener idioma del sistema
const getSystemLanguage = (): string => {
  const deviceLanguage = Localization.getLocales()[0]?.languageTag || "en-US";
  
  // Si el idioma del dispositivo está soportado, usarlo
  if (SUPPORTED_LANGUAGES.includes(deviceLanguage)) {
    return deviceLanguage;
  }
  
  // Intentar con solo el código de idioma (ej: 'es' de 'es-AR')
  const languageCode = deviceLanguage.split('-')[0];
  const matchedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.startsWith(languageCode));
  
  // Si encontramos un idioma que coincida, usarlo, sino inglés
  return matchedLanguage || "en-US";
};

const initI18n = async () => {
  const preference = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_KEY);
  
  let languageToUse: string;
  
  if (preference === "system" || !preference) {
    // Usar idioma del sistema
    languageToUse = getSystemLanguage();
  } else {
    // Usar idioma guardado manualmente
    languageToUse = preference;
  }

  await AsyncStorage.setItem(LANGUAGE_KEY, languageToUse);

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: languageToUse,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export { getSystemLanguage, LANGUAGE_KEY, LANGUAGE_PREFERENCE_KEY };
export default i18n;