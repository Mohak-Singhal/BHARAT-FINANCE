import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Mic,
  Volume2,
  Play,
  Square,
  Settings,
  Sparkles,
  MessageCircle,
  Headphones
} from 'lucide-react'
import { useVoice } from '@/hooks/useVoice'
import VoiceSettings from './VoiceSettings'
import { TTSConfig } from '@/services/voiceService'

const VoiceDemo: React.FC = () => {
  const { t } = useTranslation()
  const [showSettings, setShowSettings] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN')
  const [ttsConfig, setTtsConfig] = useState<Partial<TTSConfig>>({
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    lang: 'en-IN'
  })

  const [voiceState, voiceActions] = useVoice({
    sttConfig: { language: selectedLanguage },
    ttsConfig,
    onTranscript: (transcript, isFinal) => {
      console.log('Transcript:', transcript, 'Final:', isFinal)
    },
    onError: (error) => {
      console.error('Voice error:', error)
    }
  })

  const demoTexts = {
    'en-IN': 'Welcome to the AI Finance Coach! I can help you with investment planning, budgeting, and financial advice.',
    'hi-IN': 'एआई फाइनेंस कोच में आपका स्वागत है! मैं आपको निवेश योजना, बजटिंग और वित्तीय सलाह में मदद कर सकता हूं।',
    'ta-IN': 'AI நிதி பயிற்சியாளருக்கு வரவேற்கிறோம்! முதலீட்டு திட்டமிடல், பட்ஜெட் மற்றும் நிதி ஆலோசனையில் உங்களுக்கு உதவ முடியும்.',
    'te-IN': 'AI ఫైనాన్స్ కోచ్‌కు స్వాగతం! పెట్టుబడి ప్రణాళిక, బడ్జెటింగ్ మరియు ఆర్థిక సలహాలతో నేను మీకు సహాయం చేయగలను.',
    'bn-IN': 'AI ফাইন্যান্স কোচে স্বাগতম! আমি বিনিয়োগ পরিকল্পনা, বাজেটিং এবং আর্থিক পরামর্শে আপনাকে সাহায্য করতে পারি।'
  }

  const handleTestVoice = (text?: string, config?: Partial<TTSConfig>) => {
    const testText = text || demoTexts[selectedLanguage as keyof typeof demoTexts] || demoTexts['en-IN']
    return voiceActions.speak(testText, config || ttsConfig)
  }

  const features = [
    {
      icon: Mic,
      title: 'Speech Recognition',
      description: 'Real-time voice input with support for 12+ languages',
      color: 'text-blue-600'
    },
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Natural voice output with customizable settings',
      color: 'text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Voice Chat',
      description: 'Complete voice-to-voice conversation experience',
      color: 'text-purple-600'
    },
    {
      icon: Settings,
      title: 'Advanced Settings',
      description: 'Fine-tune voice parameters and language preferences',
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <Headphones className="w-6 h-6 text-primary-600" />
            <span className="font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Voice Integration Demo
            </span>
            <Sparkles className="w-5 h-5 text-secondary-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
              Voice-Enabled AI Coach
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience seamless voice interaction with our AI Finance Coach using native browser APIs
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-gray-100 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Voice Demo</h3>
                  <p className="text-white/80 text-sm">
                    {voiceState.isSupported ? 'Voice features available' : 'Voice not supported'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-8">
            {voiceState.isSupported ? (
              <div className="space-y-6">
                {/* Voice Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                      voiceState.isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
                    }`} />
                    <p className="text-sm font-medium">Speech Recognition</p>
                    <p className="text-xs text-gray-500">
                      {voiceState.isListening ? 'Listening...' : 'Ready'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                      voiceState.isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                    }`} />
                    <p className="text-sm font-medium">Text-to-Speech</p>
                    <p className="text-xs text-gray-500">
                      {voiceState.isSpeaking ? 'Speaking...' : 'Ready'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="w-4 h-4 rounded-full mx-auto mb-2 bg-green-500" />
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-xs text-gray-500">{selectedLanguage}</p>
                  </div>
                </div>

                {/* Transcript Display */}
                {(voiceState.transcript || voiceState.interimTranscript) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Transcript:</h4>
                    <p className="text-blue-800">
                      {voiceState.transcript}
                      {voiceState.interimTranscript && (
                        <span className="text-blue-600 italic">
                          {voiceState.interimTranscript}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Error Display */}
                {voiceState.error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-medium text-red-900 mb-2">Error:</h4>
                    <p className="text-red-800">{voiceState.error}</p>
                    <button
                      onClick={voiceActions.clearError}
                      className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
                    >
                      Clear Error
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={voiceState.isListening ? voiceActions.stopListening : voiceActions.startListening}
                    disabled={voiceState.isSpeaking}
                    className={`px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2 ${
                      voiceState.isListening
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {voiceState.isListening ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Stop Listening</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Start Listening</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleTestVoice()}
                    disabled={voiceState.isListening}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center space-x-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Test Voice</span>
                  </button>

                  {voiceState.isSpeaking && (
                    <button
                      onClick={voiceActions.stopSpeaking}
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all shadow-lg flex items-center space-x-2"
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop Speaking</span>
                    </button>
                  )}

                  {voiceState.transcript && (
                    <button
                      onClick={voiceActions.clearTranscript}
                      className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all shadow-lg"
                    >
                      Clear Transcript
                    </button>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
                    How to Use
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Click "Start Listening" and speak clearly into your microphone</p>
                    <p>• Click "Test Voice" to hear the AI speak in the selected language</p>
                    <p>• Use the settings button to customize voice parameters</p>
                    <p>• Try different languages to test multilingual support</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Not Supported</h3>
                <p className="text-gray-600 mb-4">
                  Your browser doesn't support voice features. Please use Chrome, Edge, or Safari.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left">
                  <h4 className="font-medium text-yellow-900 mb-2">Requirements:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• HTTPS connection (required for microphone access)</li>
                    <li>• Modern browser (Chrome, Edge, Safari)</li>
                    <li>• Microphone permissions</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Voice Settings Modal */}
        <VoiceSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currentLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          ttsConfig={ttsConfig}
          onTTSConfigChange={setTtsConfig}
          onTestVoice={handleTestVoice}
        />
      </div>
    </div>
  )
}

export default VoiceDemo