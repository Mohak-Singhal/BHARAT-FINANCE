import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  Zap,
  Brain,
  MessageCircle,
  Mic,
  Volume2,
  Settings
} from 'lucide-react'
import VoiceChat from './VoiceChat'

const ModernAICoach: React.FC = () => {
  // Safe i18n usage with fallback
  let t, ready
  try {
    const translation = useTranslation()
    t = translation.t
    ready = translation.ready !== false // Default to true if ready is undefined
  } catch (error) {
    // Fallback function if i18n is not ready
    t = (key: string, fallback?: string) => fallback || key
    ready = true
  }
  
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN')

  // Don't render until i18n is ready
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Coach...</p>
        </div>
      </div>
    )
  }

  // Handle message sending to backend
  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:8001/ai/finance-coach/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_history: [] // VoiceChat will manage its own history
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.response
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Sorry, I encountered an error. Please try again.')
    }
  }

  const suggestions = [
    { text: t('aiCoach.suggestions.investment', 'Help me plan my investments'), icon: TrendingUp },
    { text: t('aiCoach.suggestions.budget', 'Create a monthly budget'), icon: PieChart },
    { text: t('aiCoach.suggestions.tax', 'Tax saving strategies'), icon: DollarSign },
    { text: t('aiCoach.suggestions.emergency', 'Emergency fund planning'), icon: Target },
  ]

  const languages = [
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-primary-200 rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <Brain className="w-6 h-6 text-primary-600" />
            <span className="font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('hero.aiPowered')}
            </span>
            <Sparkles className="w-5 h-5 text-secondary-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
              {t('aiCoach.title')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('aiCoach.subtitle')}
          </p>
        </motion.div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[600px]"
            >
              <VoiceChat
                onSendMessage={handleSendMessage}
                autoSpeak={true}
                language={selectedLanguage}
                className="h-full"
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Language Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 text-primary-600 mr-2" />
                Language
              </h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                        : 'bg-gray-50 hover:bg-primary-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quick Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-primary-600 mr-2" />
                Quick Start
              </h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-primary-50 rounded-xl transition-colors group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <suggestion.icon className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                      <span className="text-sm text-gray-700 group-hover:text-primary-700">
                        {suggestion.text}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Voice Features Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 text-primary-600 mr-2" />
                Voice Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mic className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-gray-600">Speech-to-Text</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-gray-600">Text-to-Speech</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-gray-600">Real-time Processing</span>
                </div>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 shadow-xl border border-primary-100"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
                Pro Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Speak clearly for better recognition</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Use voice for hands-free interaction</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Adjust speech settings in the header</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Ask specific financial questions</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernAICoach