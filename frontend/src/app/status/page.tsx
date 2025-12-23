'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Mic,
  Volume2,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Shield
} from 'lucide-react'

interface SystemCheck {
  name: string
  status: 'success' | 'warning' | 'error'
  message: string
  icon: React.ComponentType<any>
}

export default function StatusPage() {
  const [checks, setChecks] = useState<SystemCheck[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runSystemChecks = async () => {
      const systemChecks: SystemCheck[] = []

      // Check HTTPS
      systemChecks.push({
        name: 'HTTPS Connection',
        status: window.location.protocol === 'https:' ? 'success' : 'warning',
        message: window.location.protocol === 'https:'
          ? 'Secure connection - Voice features fully supported'
          : 'HTTP connection - Voice features may be limited',
        icon: Shield
      })

      // Check Speech Recognition
      const sttSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
      systemChecks.push({
        name: 'Speech Recognition',
        status: sttSupported ? 'success' : 'error',
        message: sttSupported
          ? 'Speech-to-Text is supported'
          : 'Speech-to-Text not supported in this browser',
        icon: Mic
      })

      // Check Speech Synthesis
      const ttsSupported = !!window.speechSynthesis
      systemChecks.push({
        name: 'Speech Synthesis',
        status: ttsSupported ? 'success' : 'error',
        message: ttsSupported
          ? 'Text-to-Speech is supported'
          : 'Text-to-Speech not supported in this browser',
        icon: Volume2
      })

      // Check Browser
      const userAgent = navigator.userAgent
      let browserStatus: 'success' | 'warning' | 'error' = 'success'
      let browserMessage = 'Fully supported browser'

      if (userAgent.includes('Chrome') || userAgent.includes('Edge')) {
        browserStatus = 'success'
        browserMessage = 'Chrome/Edge - Full voice support'
      } else if (userAgent.includes('Safari')) {
        browserStatus = 'success'
        browserMessage = 'Safari - Full voice support'
      } else if (userAgent.includes('Firefox')) {
        browserStatus = 'warning'
        browserMessage = 'Firefox - Limited voice support'
      } else {
        browserStatus = 'warning'
        browserMessage = 'Unknown browser - Voice support may vary'
      }

      systemChecks.push({
        name: 'Browser Compatibility',
        status: browserStatus,
        message: browserMessage,
        icon: Monitor
      })

      // Check Device Type
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      systemChecks.push({
        name: 'Device Type',
        status: 'success',
        message: isMobile ? 'Mobile device detected' : 'Desktop device detected',
        icon: isMobile ? Smartphone : Monitor
      })

      // Check Language Support
      const languages = navigator.languages || [navigator.language]
      const supportedLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'pa']
      const hasIndianLanguage = languages.some(lang =>
        supportedLanguages.some(supported => lang.startsWith(supported))
      )

      systemChecks.push({
        name: 'Language Support',
        status: hasIndianLanguage ? 'success' : 'warning',
        message: hasIndianLanguage
          ? 'Indian language detected in browser'
          : 'No Indian languages detected - English will be used',
        icon: Globe
      })

      // Check Network
      systemChecks.push({
        name: 'Network Connection',
        status: navigator.onLine ? 'success' : 'error',
        message: navigator.onLine
          ? 'Online - All features available'
          : 'Offline - Limited functionality',
        icon: Wifi
      })

      setChecks(systemChecks)
      setIsLoading(false)
    }

    runSystemChecks()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const overallStatus = checks.length > 0 ? (
    checks.every(check => check.status === 'success') ? 'success' :
      checks.some(check => check.status === 'error') ? 'error' : 'warning'
  ) : 'warning'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
              System Status
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Voice integration and system compatibility check
          </p>
        </motion.div>

        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-8 p-6 rounded-2xl border-2 ${getStatusColor(overallStatus)}`}
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon(overallStatus)}
            <div>
              <h2 className="text-xl font-bold">
                {overallStatus === 'success' && 'All Systems Operational'}
                {overallStatus === 'warning' && 'Some Issues Detected'}
                {overallStatus === 'error' && 'Critical Issues Found'}
              </h2>
              <p className="text-gray-600">
                {overallStatus === 'success' && 'Voice integration is fully functional'}
                {overallStatus === 'warning' && 'Voice features may have limitations'}
                {overallStatus === 'error' && 'Voice features may not work properly'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* System Checks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold mb-6">System Checks</h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Running system checks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {checks.map((check, index) => (
                <motion.div
                  key={check.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${getStatusColor(check.status)}`}
                >
                  <div className="flex items-start space-x-3">
                    <check.icon className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{check.name}</h3>
                        {getStatusIcon(check.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{check.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Browser Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-2">Browser Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'}</p>
              <p><strong>Language:</strong> {typeof navigator !== 'undefined' ? navigator.language : 'Unknown'}</p>
              <p><strong>Languages:</strong> {typeof navigator !== 'undefined' ? navigator.languages?.join(', ') : 'Unknown'}</p>
              <p><strong>Platform:</strong> {typeof navigator !== 'undefined' ? navigator.platform : 'Unknown'}</p>
              <p><strong>Online:</strong> {typeof navigator !== 'undefined' ? (navigator.onLine ? 'Yes' : 'No') : 'Unknown'}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="/ai-coach"
              className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              Test AI Coach
            </a>
            <a
              href="/test-voice"
              className="px-6 py-3 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-colors"
            >
              Test Voice Features
            </a>
            <a
              href="/test-nav"
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              Test Navigation
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}