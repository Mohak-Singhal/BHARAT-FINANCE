'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mic, Volume2, Headphones } from 'lucide-react'

export default function TestVoicePage() {
  const [isSupported, setIsSupported] = React.useState(false)
  const [testResult, setTestResult] = React.useState('')

  React.useEffect(() => {
    // Test voice support
    const sttSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    const ttsSupported = !!window.speechSynthesis
    setIsSupported(sttSupported && ttsSupported)
    
    if (sttSupported && ttsSupported) {
      setTestResult('✅ Full voice support available')
    } else if (sttSupported) {
      setTestResult('⚠️ Only Speech Recognition available')
    } else if (ttsSupported) {
      setTestResult('⚠️ Only Text-to-Speech available')
    } else {
      setTestResult('❌ No voice support available')
    }
  }, [])

  const testTTS = () => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance('Hello! Voice integration is working perfectly.')
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  const testSTT = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTestResult(`🎤 Heard: "${transcript}"`)
      }
      
      recognition.onerror = (event) => {
        setTestResult(`❌ Error: ${event.error}`)
      }
      
      recognition.start()
      setTestResult('🎤 Listening... (speak now)')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <Headphones className="w-6 h-6 text-primary-600" />
            <span className="font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Voice Integration Test
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
              Voice Test Page
            </span>
          </h1>
          
          <p className="text-xl text-gray-600">
            Test the voice integration functionality
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20"
        >
          <div className="space-y-6">
            {/* Status */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Voice Support Status</h2>
              <div className={`p-4 rounded-xl ${
                isSupported ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                <p className="text-lg font-medium">{testResult}</p>
              </div>
            </div>

            {/* Test Buttons */}
            {isSupported && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={testTTS}
                  className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Test Text-to-Speech</span>
                </button>
                
                <button
                  onClick={testSTT}
                  className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Mic className="w-5 h-5" />
                  <span>Test Speech Recognition</span>
                </button>
              </div>
            )}

            {/* Browser Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-2">Browser Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>User Agent: {navigator.userAgent}</p>
                <p>Language: {navigator.language}</p>
                <p>Platform: {navigator.platform}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/ai-coach"
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Go to AI Coach
                </a>
                <a
                  href="/voice-test"
                  className="px-6 py-3 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-colors"
                >
                  Voice Demo
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}