import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  Settings,
  Pause,
  Play,
  Square,
  Waves,
  MessageSquare
} from 'lucide-react'
import { useVoice } from '@/hooks/useVoice'
import { TTSConfig } from '@/services/voiceService'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isVoice?: boolean
}

interface VoiceChatProps {
  onSendMessage?: (message: string) => Promise<string>
  autoSpeak?: boolean
  language?: string
  className?: string
}

const VoiceChat: React.FC<VoiceChatProps> = ({
  onSendMessage,
  autoSpeak = true,
  language = 'en-IN',
  className = ''
}) => {
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

  // Don't render until i18n is ready
  if (!ready) {
    return (
      <div className={`flex items-center justify-center h-full bg-white rounded-2xl shadow-xl ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading voice chat...</p>
        </div>
      </div>
    )
  }

  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [ttsConfig, setTtsConfig] = useState<Partial<TTSConfig>>({
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    lang: language
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Voice hook with configuration
  const [voiceState, voiceActions] = useVoice({
    autoSpeak,
    sttConfig: {
      language,
      continuous: false,
      interimResults: true,
      maxAlternatives: 1
    },
    ttsConfig,
    onTranscript: (transcript, isFinal) => {
      if (isFinal) {
        setInputMessage(transcript)
        // Auto-send if transcript is complete
        if (transcript.trim()) {
          handleSendMessage(transcript, true)
        }
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    }
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: t('aiCoach.welcome', 'Hello! I\'m your AI Finance Coach. You can speak to me or type your questions. How can I help you today?'),
      timestamp: new Date()
    }
    setMessages([welcomeMessage])

    // Speak welcome message if auto-speak is enabled
    if (autoSpeak && voiceState.isSupported) {
      setTimeout(() => {
        voiceActions.speak(welcomeMessage.content, ttsConfig)
      }, 1000)
    }
  }, [t, autoSpeak, voiceState.isSupported, voiceActions, ttsConfig])

  // Update TTS language when language changes
  useEffect(() => {
    setTtsConfig(prev => ({ ...prev, lang: language }))
    voiceActions.setLanguage(language)
  }, [language, voiceActions])

  const handleSendMessage = useCallback(async (message?: string, isVoiceInput = false) => {
    const messageToSend = message || inputMessage
    if (!messageToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date(),
      isVoice: isVoiceInput
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    voiceActions.clearTranscript()

    try {
      let response = ''

      if (onSendMessage) {
        response = await onSendMessage(messageToSend)
      } else {
        // Default API call
        const apiResponse = await fetch('/api/ai-coach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageToSend,
            conversation_history: messages.slice(-5).map(m => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          }),
        })

        if (apiResponse.ok) {
          const data = await apiResponse.json()
          response = data.response
        } else {
          throw new Error('Failed to get response')
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Auto-speak the response if enabled
      if (autoSpeak && voiceState.isSupported) {
        voiceActions.speak(response, ttsConfig)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: t('aiCoach.error', 'Sorry, I encountered an error. Please try again.'),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputMessage, isLoading, messages, onSendMessage, autoSpeak, voiceState.isSupported, voiceActions, ttsConfig, t])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    if (voiceState.isListening) {
      voiceActions.stopListening()
    } else {
      voiceActions.startListening()
    }
  }

  const handleSpeakMessage = (content: string) => {
    if (voiceState.isSpeaking) {
      voiceActions.stopSpeaking()
    } else {
      voiceActions.speak(content, ttsConfig)
    }
  }

  const updateTTSConfig = (newConfig: Partial<TTSConfig>) => {
    setTtsConfig(prev => ({ ...prev, ...newConfig }))
  }

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">AI Finance Coach</h3>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                {voiceState.isSupported ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Voice Enabled</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span>Text Only</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {voiceState.isSpeaking && (
              <motion.button
                onClick={voiceActions.stopSpeaking}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <VolumeX className="w-4 h-4" />
              </motion.button>
            )}

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voice Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-white/10 rounded-lg"
            >
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <label className="block text-white/80 mb-1">Speed</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={ttsConfig.rate || 0.9}
                    onChange={(e) => updateTTSConfig({ rate: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Pitch</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={ttsConfig.pitch || 1}
                    onChange={(e) => updateTTSConfig({ pitch: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={ttsConfig.volume || 1}
                    onChange={(e) => updateTTSConfig({ volume: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.type === 'user'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white'
                  : 'bg-gray-100 text-gray-800'
                } rounded-2xl px-4 py-3 shadow-lg`}>
                <div className="flex items-start space-x-2">
                  {message.type === 'assistant' && (
                    <Bot className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {message.isVoice && (
                        <Waves className="w-3 h-3 mt-0.5 opacity-70" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      {message.type === 'assistant' && voiceState.isSupported && (
                        <button
                          onClick={() => handleSpeakMessage(message.content)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Volume2 className="w-3 h-3 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-primary-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        {/* Voice Status */}
        {voiceState.isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center justify-center space-x-2 text-red-600 bg-red-50 rounded-lg p-2"
          >
            <motion.div
              className="w-2 h-2 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <span className="text-sm font-medium">Listening...</span>
            <button
              onClick={toggleListening}
              className="ml-2 text-xs text-red-700 hover:text-red-800"
            >
              Stop
            </button>
          </motion.div>
        )}

        {/* Interim Results */}
        {voiceState.interimTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-2 p-2 bg-blue-50 rounded-lg text-sm text-blue-700 italic"
          >
            {voiceState.interimTranscript}
          </motion.div>
        )}

        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={voiceState.isSupported ?
                t('aiCoach.placeholderVoice', 'Type your message or click the mic to speak...') :
                t('aiCoach.placeholder', 'Type your message...')
              }
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:outline-none resize-none transition-colors"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>

          {voiceState.isSupported && (
            <button
              onClick={toggleListening}
              disabled={isLoading}
              className={`p-3 rounded-2xl transition-all shadow-lg ${voiceState.isListening
                  ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {voiceState.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-2xl hover:from-primary-600 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Error Display */}
        {voiceState.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
          >
            {voiceState.error}
            <button
              onClick={voiceActions.clearError}
              className="ml-2 text-red-800 hover:text-red-900 underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default VoiceChat