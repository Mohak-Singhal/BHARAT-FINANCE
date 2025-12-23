'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { languages, loadLanguage } from '@/lib/i18n'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')

  useEffect(() => {
    setCurrentLanguage(i18n.language || 'en')
  }, [i18n.language])

  const handleLanguageChange = async (languageCode: string) => {
    try {
      // Load the language if not already loaded
      await loadLanguage(languageCode)
      // Change language immediately
      i18n.changeLanguage(languageCode)
      setCurrentLanguage(languageCode)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  const currentLang = languages[currentLanguage as keyof typeof languages] || languages.en

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white/90 transition-all duration-200 shadow-sm"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLang.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                  Select Language
                </div>
                <div className="space-y-1">
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors duration-150 ${
                        currentLanguage === code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{lang.flag}</span>
                        <div>
                          <div className="font-medium text-sm">{lang.nativeName}</div>
                          <div className="text-xs text-gray-500">{lang.name}</div>
                        </div>
                      </div>
                      {currentLanguage === code && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher