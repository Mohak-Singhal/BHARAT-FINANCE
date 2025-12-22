import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Settings,
  Volume2,
  Mic,
  Globe,
  Sliders,
  TestTube,
  X,
  Check,
  RefreshCw
} from 'lucide-react'
import { TTSConfig } from '@/services/voiceService'
import { 
  SUPPORTED_LANGUAGES, 
  getVoicesForLanguage, 
  getBestVoiceForLanguage,
  getTTSConfigForLanguage,
  getSTTConfigForLanguage
} from '@/utils/voiceUtils'

interface VoiceSettingsProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  onLanguageChange: (language: string) => void
  ttsConfig: Partial<TTSConfig>
  onTTSConfigChange: (config: Partial<TTSConfig>) => void
  onTestVoice: (text: string, config?: Partial<TTSConfig>) => void
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  ttsConfig,
  onTTSConfigChange,
  onTestVoice
}) => {
  const { t } = useTranslation()
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [isTestingVoice, setIsTestingVoice] = useState(false)

  // Load voices when language changes
  useEffect(() => {
    const loadVoices = () => {
      const voices = getVoicesForLanguage(currentLanguage)
      setAvailableVoices(voices)
      
      // Set best voice as default
      const bestVoice = getBestVoiceForLanguage(currentLanguage)
      if (bestVoice) {
        setSelectedVoice(bestVoice.name)
        onTTSConfigChange({ voice: bestVoice })
      }
    }

    loadVoices()
    
    // Listen for voices loaded event
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [currentLanguage, onTTSConfigChange])

  const handleLanguageChange = (languageCode: string) => {
    onLanguageChange(languageCode)
    
    // Apply language-specific optimizations
    const optimizedTTSConfig = getTTSConfigForLanguage(languageCode)
    onTTSConfigChange(optimizedTTSConfig)
  }

  const handleVoiceChange = (voiceName: string) => {
    const voice = availableVoices.find(v => v.name === voiceName)
    if (voice) {
      setSelectedVoice(voiceName)
      onTTSConfigChange({ voice })
    }
  }

  const handleTestVoice = async () => {
    setIsTestingVoice(true)
    
    const testTexts: Record<string, string> = {
      'en': 'Hello! This is a test of the text-to-speech system. How does this sound?',
      'hi': 'नमस्ते! यह टेक्स्ट-टू-स्पीच सिस्टम का परीक्षण है। यह कैसा लग रहा है?',
      'ta': 'வணக்கம்! இது உரையிலிருந்து பேச்சு அமைப்பின் சோதனை. இது எப்படி இருக்கிறது?',
      'te': 'నమస్కారం! ఇది టెక్స్ట్-టు-స్పీచ్ సిస్టమ్ యొక్క పరీక్ష. ఇది ఎలా అనిపిస్తుంది?',
      'bn': 'নমস্কার! এটি টেক্সট-টু-স্পিচ সিস্টেমের একটি পরীক্ষা। এটি কেমন শোনাচ্ছে?',
      'gu': 'નમસ્તે! આ ટેક્સ્ટ-ટુ-સ્પીચ સિસ્ટમનું પરીક્ષણ છે. આ કેવું લાગે છે?',
      'kn': 'ನಮಸ್ಕಾರ! ಇದು ಪಠ್ಯದಿಂದ ಭಾಷಣ ವ್ಯವಸ್ಥೆಯ ಪರೀಕ್ಷೆ. ಇದು ಹೇಗೆ ಅನಿಸುತ್ತದೆ?',
      'ml': 'നമസ്കാരം! ഇത് ടെക്സ്റ്റ്-ടു-സ്പീച്ച് സിസ്റ്റത്തിന്റെ ഒരു പരീക്ഷണമാണ്. ഇത് എങ്ങനെ തോന്നുന്നു?',
      'mr': 'नमस्कार! हे टेक्स्ट-टू-स्पीच सिस्टमची चाचणी आहे. हे कसे वाटते?',
      'pa': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਇਹ ਟੈਕਸਟ-ਟੂ-ਸਪੀਚ ਸਿਸਟਮ ਦਾ ਟੈਸਟ ਹੈ। ਇਹ ਕਿਵੇਂ ਲੱਗ ਰਿਹਾ ਹੈ?'
    }
    
    const langCode = currentLanguage.split('-')[0]
    const testText = testTexts[langCode] || testTexts['en']
    
    try {
      await onTestVoice(testText, ttsConfig)
    } finally {
      setIsTestingVoice(false)
    }
  }

  const resetToDefaults = () => {
    const defaultConfig = getTTSConfigForLanguage(currentLanguage)
    onTTSConfigChange(defaultConfig)
    
    const bestVoice = getBestVoiceForLanguage(currentLanguage)
    if (bestVoice) {
      setSelectedVoice(bestVoice.name)
      onTTSConfigChange({ ...defaultConfig, voice: bestVoice })
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6" />
                <h2 className="text-xl font-bold">Voice Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Language Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary-600" />
                Language & Region
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      currentLanguage === lang.code
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <div className="font-medium">{lang.name}</div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          {lang.sttSupported && <Mic className="w-3 h-3" />}
                          {lang.ttsSupported && <Volume2 className="w-3 h-3" />}
                        </div>
                      </div>
                      {currentLanguage === lang.code && (
                        <Check className="w-4 h-4 text-primary-600 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Volume2 className="w-5 h-5 mr-2 text-primary-600" />
                Voice Selection
              </h3>
              {availableVoices.length > 0 ? (
                <div className="space-y-2">
                  {availableVoices.map((voice) => (
                    <button
                      key={voice.name}
                      onClick={() => handleVoiceChange(voice.name)}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        selectedVoice === voice.name
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-sm text-gray-500">
                            {voice.lang} • {voice.localService ? 'Local' : 'Network'}
                          </div>
                        </div>
                        {selectedVoice === voice.name && (
                          <Check className="w-4 h-4 text-primary-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Volume2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No voices available for this language</p>
                </div>
              )}
            </div>

            {/* TTS Configuration */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sliders className="w-5 h-5 mr-2 text-primary-600" />
                Speech Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speed: {ttsConfig.rate?.toFixed(1) || '0.9'}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={ttsConfig.rate || 0.9}
                    onChange={(e) => onTTSConfigChange({ rate: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pitch: {ttsConfig.pitch?.toFixed(1) || '1.0'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={ttsConfig.pitch || 1.0}
                    onChange={(e) => onTTSConfigChange({ pitch: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Normal</span>
                    <span>High</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume: {Math.round((ttsConfig.volume || 1.0) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={ttsConfig.volume || 1.0}
                    onChange={(e) => onTTSConfigChange({ volume: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Quiet</span>
                    <span>Normal</span>
                    <span>Loud</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Voice */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-primary-600" />
                Test Voice
              </h3>
              <button
                onClick={handleTestVoice}
                disabled={isTestingVoice}
                className="w-full p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isTestingVoice ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    <span>Testing Voice...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Test Current Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VoiceSettings