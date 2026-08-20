'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'

interface LanguageSelectorProps {
  selectedLanguage: string
  onLanguageChange: (language: string) => void
}

const languages = [
  { code: 'english', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hindi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'marathi', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'tamil', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'telugu', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bengali', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
]

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode)
    setIsOpen(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Globe className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('literacy.chooseLanguage')}</h3>
            <p className="text-sm text-gray-600">Learn finance in your preferred language</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="text-xl">{selectedLang.flag}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">{selectedLang.native}</div>
              <div className="text-xs text-gray-500">{selectedLang.name}</div>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3 ${
                      selectedLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.native}</div>
                      <div className="text-xs opacity-75">{language.name}</div>
                    </div>
                    {selectedLanguage === language.code && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Language Features */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl mb-2">📚</div>
          <div className="text-sm font-medium text-gray-900">50+ {t('literacy.lessons')}</div>
          <div className="text-xs text-gray-600">In each language</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl mb-2">🧠</div>
          <div className="text-sm font-medium text-gray-900">{t('literacy.quiz')}</div>
          <div className="text-xs text-gray-600">Test your knowledge</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl mb-2">🏆</div>
          <div className="text-sm font-medium text-gray-900">Progress Tracking</div>
          <div className="text-xs text-gray-600">Monitor your learning</div>
        </div>
      </div>

      {/* Language Info */}
      <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-orange-200">
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🇮🇳</span>
          <h4 className="font-medium text-gray-900">Made for India</h4>
        </div>
        <p className="text-sm text-gray-600">
          All content is specifically designed for Indian financial markets, regulations, and cultural context. 
          Learn about Indian investment options, tax laws, and government schemes in your native language.
        </p>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}