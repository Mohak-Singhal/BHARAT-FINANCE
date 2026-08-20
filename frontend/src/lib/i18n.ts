import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Language configurations
export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇮🇳' },
  hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  as: { name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' }
}

export const defaultLanguage = 'en'
export const supportedLanguages = Object.keys(languages)

import enTranslation from '../../public/locales/en/translation.json'

// Cache for loaded languages
const loadedLanguages = new Set(['en'])

// Optimized dynamic loading function
export const loadLanguage = async (lng: string) => {
  if (!supportedLanguages.includes(lng) || loadedLanguages.has(lng)) return

  try {
    const translationModule = await import(`../../public/locales/${lng}/translation.json`)
    i18n.addResourceBundle(lng, 'translation', translationModule.default)
    loadedLanguages.add(lng)
  } catch (error) {
    console.warn(`Failed to load language ${lng}:`, error)
  }
}

// Initialize i18n synchronously
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      }
    },
    fallbackLng: defaultLanguage,
    defaultNS: 'translation',
    ns: ['translation'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    },

    // Ensure immediate initialization
    initImmediate: false
  })

export default i18n