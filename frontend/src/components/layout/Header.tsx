'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  Menu, 
  X, 
  Calculator, 
  Bot, 
  FileText, 
  BookOpen, 
  Wheat,
  Home,
  Globe,
  ChevronDown,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react'
import { clsx } from 'clsx'

const mainNavigation = [
  { name: 'nav.home', href: '/', icon: Home },
  { name: 'nav.dashboard', href: '/dashboard', icon: BarChart3 },
  { 
    name: 'nav.tools', 
    icon: Calculator,
    submenu: [
      { name: 'nav.investment', href: '/investment', icon: TrendingUp },
      { name: 'nav.budget', href: '/budget', icon: BarChart3 },
      { name: 'nav.mutualFunds', href: '/mutual-funds', icon: PieChart },
      { name: 'nav.policySimulator', href: '/policy-simulator', icon: FileText },
    ]
  },
  { name: 'nav.aiCoach', href: '/ai-coach', icon: Bot },
  { name: 'nav.learning', href: '/literacy', icon: BookOpen },
  { name: 'nav.mandi', href: '/mandi', icon: Wheat },
]

import { languages, loadLanguage } from '@/lib/i18n'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Safe i18n usage with fallback
  let t, i18n
  try {
    const translation = useTranslation()
    t = translation.t
    i18n = translation.i18n
  } catch (error) {
    // Fallback function if i18n is not ready
    t = (key: string) => key
    i18n = { language: 'en', changeLanguage: () => {} }
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const toggleLanguageMenu = () => setLanguageMenuOpen(!languageMenuOpen)
  const toggleToolsMenu = () => setToolsMenuOpen(!toolsMenuOpen)

  const handleLanguageChange = async (langCode: string) => {
    try {
      await loadLanguage(langCode)
      i18n.changeLanguage(langCode)
      setLanguageMenuOpen(false)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  const currentLang = Object.entries(languages).find(([code]) => code === i18n.language)?.[1] || languages.en

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center space-x-1">
              <motion.div 
                className="flag-orange w-2 h-6 rounded-sm"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
              <motion.div 
                className="flag-white w-2 h-6 rounded-sm border border-gray-200"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, delay: 0.05 }}
              />
              <motion.div 
                className="flag-green w-2 h-6 rounded-sm"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Bharat Finance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {mainNavigation.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={toggleToolsMenu}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.name)}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${toolsMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {toolsMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setToolsMenuOpen(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <subItem.icon className="h-4 w-4 text-gray-400" />
                              <span>{t(subItem.name)}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(item.name)}</span>
                </Link>
              )
            })}
          </div>

          {/* Language Selector & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.nativeName}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${languageMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {Object.entries(languages).map(([code, language]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={clsx(
                          'w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200',
                          i18n.language === code
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700'
                        )}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{language.nativeName}</div>
                          <div className="text-xs text-gray-500">{language.name}</div>
                        </div>
                        {i18n.language === code && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-2">
                {mainNavigation.map((item) => {
                  if (item.submenu) {
                    return (
                      <div key={item.name}>
                        <div className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-600">
                          <item.icon className="h-5 w-5" />
                          <span>{t(item.name)}</span>
                        </div>
                        <div className="ml-8 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span>{t(subItem.name)}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        'flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200',
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{t(item.name)}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Click outside to close menus */}
      {(languageMenuOpen || toolsMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setLanguageMenuOpen(false)
            setToolsMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}