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

// Cache for loaded languages
const loadedLanguages = new Set(['en'])

// English translations (inline to avoid import issues)
const enTranslation = {
  "hero": {
    "title_part1": "Bharat Finance",
    "title_part2": "Intelligence Platform",
    "subtitle": "Empowering every Indian with AI-powered financial intelligence, real-time market insights, and personalized investment strategies in your preferred language.",
    "launchDashboard": "Launch Dashboard",
    "tryBudget": "Try Budget Analyzer"
  },
  "nav": {
    "home": "Home",
    "dashboard": "Dashboard", 
    "tools": "Tools",
    "investment": "Investment Calculator",
    "budget": "Budget Analyzer",
    "mutualFunds": "Mutual Funds",
    "policySimulator": "Policy Simulator",
    "aiCoach": "AI Coach",
    "learning": "Financial Learning",
    "stocks": "Stocks",
    "news": "News",
    "mandi": "Mandi Prices"
  },
  "features": {
    "investment": {
      "title": "Smart Investment Calculator",
      "description": "AI-powered SIP, PPF, NPS calculations with real-time mutual fund data"
    },
    "budget": {
      "title": "Professional Budget Analyzer", 
      "description": "Intelligent expense tracking with personalized recommendations"
    },
    "aiCoach": {
      "title": "AI Finance Coach",
      "description": "Get personalized financial advice from our advanced AI assistant"
    },
    "mutualFunds": {
      "title": "Mutual Fund Recommendations",
      "description": "Real-time fund analysis with performance metrics and ratings"
    },
    "policy": {
      "title": "Policy Impact Simulator",
      "description": "Understand how government policies affect your finances"
    },
    "literacy": {
      "title": "Multi-language Learning",
      "description": "Financial education in 6+ Indian languages with interactive content"
    },
    "stocks": {
      "title": "Stock Tracker",
      "description": "Track real-time stock prices and build your personal watchlist"
    },
    "news": {
      "title": "Financial News Feed",
      "description": "Follow topics that matter and get the latest finance updates"
    }
  },
  "stats": {
    "users": "Active Users",
    "calculations": "Calculations Done", 
    "languages": "Languages Supported",
    "success": "Success Rate"
  },
  "common": {
    "exploreFeature": "Explore Feature",
    "loading": "Loading...",
    "error": "Error occurred",
    "tryAgain": "Try Again",
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "refresh": "Refresh Data",
    "lastSync": "Last Server Sync"
  },
  "aiCoach": {
    "title": "AI Finance Coach",
    "subtitle": "Your personal financial advisor powered by Groq Llama 3",
    "suggestions": {
      "house": "I want to buy a house in 5 years",
      "investment": "How do I start investing with ₹5000?",
      "tax": "Best tax-saving options for me",
      "sip": "Should I invest lump sum or SIP?",
      "budget": "Help me create a budget",
      "emergency": "Emergency fund - how much do I need?"
    }
  },
  "dashboard": {
    "title": "Financial Dashboard",
    "subtitle": "Your complete financial overview",
    "portfolio": "Portfolio Value",
    "returns": "Returns",
    "goals": "Goals",
    "investments": "Investments",
    "expenses": "Expenses",
    "savings": "Savings",
    "markets": "Indian Markets",
    "noMarketData": "No market data available"
  }
}

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