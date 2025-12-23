'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Bot, User, Loader2, RefreshCw, Copy, Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isVoice?: boolean
}

// Language mapping for TTS
const TTS_LANGUAGE_MAP: { [key: string]: string } = {
  english: 'en-IN',
  hindi: 'hi-IN',
  marathi: 'mr-IN',
  tamil: 'ta-IN',
  telugu: 'te-IN',
  bengali: 'bn-IN'
}

const SimpleAICoach: React.FC = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectedLanguage, setDetectedLanguage] = useState<string>('english')
  
  // Voice states
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceSupported, setIsVoiceSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  
  // TTS Settings
  const [ttsSettings, setTtsSettings] = useState({
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const lastSpokenMessageRef = useRef<string>('') // Track last spoken message to prevent repeating

  // Initialize voice services
  useEffect(() => {
    // Check for Speech Recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      setupSpeechRecognition()
    }

    // Check for Speech Synthesis support
    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis
      setIsVoiceSupported(true)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (currentUtteranceRef.current && synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  // Setup Speech Recognition
  const setupSpeechRecognition = useCallback(() => {
    if (!recognitionRef.current) return

    const recognition = recognitionRef.current
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = TTS_LANGUAGE_MAP[detectedLanguage] || 'en-IN'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setInterimTranscript(interimTranscript)
      if (finalTranscript) {
        setTranscript(finalTranscript)
        setInputMessage(finalTranscript)
        setInterimTranscript('')
      }
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      setError(`Voice recognition error: ${event.error}`)
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }, [detectedLanguage])

  // Update recognition language when detected language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = TTS_LANGUAGE_MAP[detectedLanguage] || 'en-IN'
    }
  }, [detectedLanguage])

  // Text-to-Speech function - FIXED to prevent repeating
  const speakText = useCallback((text: string, language: string = detectedLanguage) => {
    if (!synthRef.current || isSpeaking) return
    
    // Prevent speaking the same message multiple times
    if (lastSpokenMessageRef.current === text) return
    
    // Cancel any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = TTS_LANGUAGE_MAP[language] || 'en-IN'
    utterance.rate = ttsSettings.rate
    utterance.pitch = ttsSettings.pitch
    utterance.volume = ttsSettings.volume

    // Try to find a voice for the language
    const voices = synthRef.current.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(TTS_LANGUAGE_MAP[language]?.split('-')[0] || 'en')
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      lastSpokenMessageRef.current = text // Mark this message as spoken
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    currentUtteranceRef.current = utterance
    synthRef.current.speak(utterance)
  }, [ttsSettings]) // Removed detectedLanguage and isSpeaking from dependencies to prevent re-creation

  // Start/Stop listening
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      // Stop any ongoing speech before starting to listen
      if (isSpeaking && synthRef.current) {
        synthRef.current.cancel()
      }
      recognitionRef.current.start()
    }
  }, [isListening, isSpeaking])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      lastSpokenMessageRef.current = '' // Reset last spoken message
    }
  }, [isSpeaking])

  // Simple scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Welcome message - FIXED to prevent TTS repeating
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: '👋 Hi there! I\'m your AI Finance Coach powered by Groq Llama 3.\n\nI can help you in multiple languages with voice support! You can speak your questions or type them. I\'ll provide practical advice about investments, budgeting, taxes, and more - all tailored for India! 🇮🇳\n\nWhat financial goal are you working on?',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])

    // Speak welcome message only once if auto-speak is enabled
    if (autoSpeak && isVoiceSupported) {
      speakText(welcomeMessage.content)
    }
  }, []) // Removed dependencies to prevent re-running

  const handleSendMessage = async (messageText?: string, isVoiceInput = false) => {
    const messageToSend = messageText || inputMessage
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
    setTranscript('')
    setInterimTranscript('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
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

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date()
        }

        // Update detected language if provided
        if (data.detected_language) {
          setDetectedLanguage(data.detected_language)
        }

        // Show warning if response was incomplete
        if (data.is_complete === false) {
          console.warn('Response may be incomplete:', data.response)
        }

        setMessages(prev => [...prev, assistantMessage])

        // Auto-speak the response if enabled - FIXED to prevent repeating
        if (autoSpeak && isVoiceSupported && !isSpeaking) {
          // Use a unique timeout to prevent multiple calls
          const speakTimeout = setTimeout(() => {
            if (!isSpeaking) { // Double-check before speaking
              speakText(data.response, data.detected_language || detectedLanguage)
            }
          }, 500)
          
          // Store timeout to clear if component unmounts
          return () => clearTimeout(speakTimeout)
        }
      } else {
        // Handle different error types
        if (data.setup_required) {
          setError(`⚠️ Setup Required: ${data.error}\n\n📝 Instructions: ${data.instructions}`)
        } else if (data.rate_limited) {
          setError(`⏱️ Rate Limit: ${data.error}\n\n💡 Tip: ${data.details}`)
        } else if (data.api_error) {
          setError(`🔴 API Error: ${data.error}${data.details ? `\n\nDetails: ${data.details}` : ''}`)
        } else {
          setError(`❌ Error: ${data.error || 'Unknown error occurred'}`)
        }
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.rate_limited 
            ? '⏱️ I\'m currently rate limited. Please wait about 1 minute and try again!'
            : '❌ I encountered an error. Please check the error message above and ensure your Gemini API key is properly configured.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('🔴 Network Error: Failed to connect to the API. Please check your internet connection.')
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '🔴 Network error occurred. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle voice input completion
  useEffect(() => {
    if (transcript && !isListening) {
      // Auto-send voice input after a short delay
      const timer = setTimeout(() => {
        handleSendMessage(transcript, true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [transcript, isListening])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearChat = () => {
    // Stop any ongoing speech
    if (isSpeaking && synthRef.current) {
      synthRef.current.cancel()
    }
    
    setMessages([{
      id: '1',
      type: 'assistant',
      content: 'Chat cleared! How can I help you with your financial questions?',
      timestamp: new Date()
    }])
  }

  const handleSpeakMessage = (content: string) => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      lastSpokenMessageRef.current = '' // Reset to allow manual speaking
      speakText(content)
    }
  }

  const quickSuggestions = [
    t('aiCoach.suggestions.house', 'I want to buy a house in 5 years'),
    t('aiCoach.suggestions.investment', 'How do I start investing with ₹5000?'),
    t('aiCoach.suggestions.tax', 'Best tax-saving options for me'),
    t('aiCoach.suggestions.sip', 'Should I invest lump sum or SIP?'),
    t('aiCoach.suggestions.budget', 'Help me create a budget'),
    t('aiCoach.suggestions.emergency', 'Emergency fund - how much do I need?'),
    // Multi-language suggestions
    'मैं 5 साल में घर खरीदना चाहता हूं',
    '₹5000 से निवेश कैसे शुरू करूं?',
    'मेरे लिए सबसे अच्छे टैक्स सेविंग विकल्प',
    'SIP बेहतर है या एकमुश्त निवेश?'
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t('aiCoach.title', 'AI Finance Coach')}
          </h1>
          <p className="text-gray-600">{t('aiCoach.subtitle', 'Your personal financial advisor powered by Groq Llama 3')}</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">AI Finance Coach</h3>
                  <div className="flex items-center space-x-2 text-sm text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>
                      {isVoiceSupported ? 'Voice Enabled' : 'Text Only'}
                      {isListening && ' • Listening...'}
                      {isSpeaking && ' • Speaking...'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Auto-speak toggle */}
                {isVoiceSupported && (
                  <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`p-2 rounded-full transition-colors ${
                      autoSpeak ? 'bg-white/30' : 'bg-white/10'
                    } hover:bg-white/40`}
                    title={autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak'}
                  >
                    {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                )}

                {/* Stop speaking button */}
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="p-2 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors animate-pulse"
                    title="Stop speaking"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                )}

                {/* Voice settings */}
                {isVoiceSupported && (
                  <button
                    onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    title="Voice settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={clearChat}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  title="Clear Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voice Settings Panel */}
            {showVoiceSettings && isVoiceSupported && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <label className="block text-white/80 mb-1">Speed</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={ttsSettings.rate}
                      onChange={(e) => setTtsSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <span className="text-xs text-white/60">{ttsSettings.rate}x</span>
                  </div>
                  <div>
                    <label className="block text-white/80 mb-1">Pitch</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={ttsSettings.pitch}
                      onChange={(e) => setTtsSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <span className="text-xs text-white/60">{ttsSettings.pitch}</span>
                  </div>
                  <div>
                    <label className="block text-white/80 mb-1">Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={ttsSettings.volume}
                      onChange={(e) => setTtsSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <span className="text-xs text-white/60">{Math.round(ttsSettings.volume * 100)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                } rounded-2xl px-4 py-3 shadow-lg`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {message.isVoice && (
                          <Mic className="w-3 h-3 mt-0.5 opacity-70" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${
                          message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.type === 'assistant' && (
                          <div className="flex items-center space-x-1">
                            {isVoiceSupported && (
                              <button
                                onClick={() => handleSpeakMessage(message.content)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title={isSpeaking ? "Stop speaking" : "Read aloud"}
                              >
                                {isSpeaking ? (
                                  <VolumeX className="w-3 h-3 text-gray-500" />
                                ) : (
                                  <Volume2 className="w-3 h-3 text-gray-500" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => copyToClipboard(message.content)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Copy message"
                            >
                              <Copy className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            {/* Error Display */}
            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <div className="whitespace-pre-wrap">{error}</div>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-red-800 hover:text-red-900 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Voice Status */}
            {isListening && (
              <div className="mb-3 flex items-center justify-center space-x-2 text-red-600 bg-red-50 rounded-lg p-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Listening...</span>
                {interimTranscript && (
                  <span className="text-sm text-gray-600 italic">"{interimTranscript}"</span>
                )}
              </div>
            )}

            {/* Transcript Display */}
            {transcript && !isListening && (
              <div className="mb-3 p-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                <span className="font-medium">Recognized: </span>
                <span className="italic">"{transcript}"</span>
              </div>
            )}

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.slice(0, 6).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isVoiceSupported 
                    ? "Type or click mic to speak... (किसी भी भाषा में बोलें या टाइप करें...)" 
                    : "Type your financial question in any language..."}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none resize-none transition-colors"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={isLoading || isListening}
                />
              </div>

              {/* Voice Input Button */}
              {isVoiceSupported && (
                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-3 rounded-2xl transition-all shadow-lg ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading || isListening}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-2">🎤 Voice Support</h3>
            <p className="text-sm text-gray-600">
              {isVoiceSupported 
                ? 'Speak your questions and listen to AI responses in multiple languages'
                : 'Voice features not supported in this browser'
              }
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-2">🌍 Multi-Language</h3>
            <p className="text-sm text-gray-600">Ask questions in English, Hindi, Marathi, Tamil, Telugu, or Bengali</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-2">🇮🇳 Indian Finance Focus</h3>
            <p className="text-sm text-gray-600">Specialized advice for SIP, PPF, ELSS, tax planning, and more</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleAICoach