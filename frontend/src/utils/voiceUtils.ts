/**
 * Voice utilities for language detection, voice selection, and audio processing
 */

export interface VoiceLanguage {
  code: string
  name: string
  flag: string
  sttSupported: boolean
  ttsSupported: boolean
}

export const SUPPORTED_LANGUAGES: VoiceLanguage[] = [
  {
    code: 'en-IN',
    name: 'English (India)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'hi-IN',
    name: 'हिंदी (भारत)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'en-US',
    name: 'English (US)',
    flag: '🇺🇸',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    flag: '🇬🇧',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'ta-IN',
    name: 'தமிழ் (Tamil)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'te-IN',
    name: 'తెలుగు (Telugu)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'bn-IN',
    name: 'বাংলা (Bengali)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'gu-IN',
    name: 'ગુજરાતી (Gujarati)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'kn-IN',
    name: 'ಕನ್ನಡ (Kannada)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'ml-IN',
    name: 'മലയാളം (Malayalam)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'mr-IN',
    name: 'मराठी (Marathi)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  },
  {
    code: 'pa-IN',
    name: 'ਪੰਜਾਬੀ (Punjabi)',
    flag: '🇮🇳',
    sttSupported: true,
    ttsSupported: true
  }
]

/**
 * Get browser's preferred language for voice
 */
export function getBrowserLanguage(): string {
  const browserLang = navigator.language || 'en-US'

  // Check if browser language is supported
  const supported = SUPPORTED_LANGUAGES.find(lang =>
    lang.code === browserLang || lang.code.startsWith(browserLang.split('-')[0])
  )

  return supported?.code || 'en-IN'
}

/**
 * Get available voices for a specific language
 */
export function getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
  if (!window.speechSynthesis) return []

  const voices = window.speechSynthesis.getVoices()
  return voices.filter(voice =>
    voice.lang.toLowerCase().includes(language.toLowerCase()) ||
    voice.lang.toLowerCase().startsWith(language.split('-')[0].toLowerCase())
  )
}

/**
 * Get the best voice for a language (prefer local/native voices)
 */
export function getBestVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
  const voices = getVoicesForLanguage(language)

  if (voices.length === 0) return null

  // Prefer local voices
  const localVoices = voices.filter(voice => voice.localService)
  if (localVoices.length > 0) {
    // Prefer female voices for better clarity
    const femaleVoices = localVoices.filter(voice =>
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      !voice.name.toLowerCase().includes('male')
    )
    return femaleVoices[0] || localVoices[0]
  }

  return voices[0]
}

/**
 * Check if speech recognition is supported
 */
export function isSTTSupported(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

/**
 * Check if text-to-speech is supported
 */
export function isTTSSupported(): boolean {
  return !!window.speechSynthesis
}

/**
 * Check if voice features are fully supported
 */
export function isVoiceSupported(): boolean {
  return isSTTSupported() && isTTSSupported()
}

/**
 * Get optimal speech recognition configuration for a language
 */
export function getSTTConfigForLanguage(language: string) {
  const config = {
    language,
    continuous: false,
    interimResults: true,
    maxAlternatives: 1,
  }

  // Language-specific optimizations
  switch (language.split('-')[0]) {
    case 'hi':
      return { ...config, continuous: true } // Hindi benefits from continuous mode
    case 'ta':
    case 'te':
    case 'bn':
      return { ...config, interimResults: false } // Regional languages work better without interim
    default:
      return config
  }
}

/**
 * Get optimal TTS configuration for a language
 */
export function getTTSConfigForLanguage(language: string) {
  const baseConfig = {
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    lang: language
  }

  // Language-specific optimizations
  switch (language.split('-')[0]) {
    case 'hi':
      return { ...baseConfig, rate: 0.8, pitch: 1.1 } // Slower, slightly higher pitch for Hindi
    case 'ta':
    case 'te':
    case 'bn':
    case 'gu':
    case 'kn':
    case 'ml':
    case 'mr':
    case 'pa':
      return { ...baseConfig, rate: 0.85, pitch: 1.05 } // Slightly slower for regional languages
    default:
      return baseConfig
  }
}

/**
 * Detect language from text (basic heuristic)
 */
export function detectLanguageFromText(text: string): string {
  // Simple language detection based on character sets
  const devanagariRegex = /[\u0900-\u097F]/
  const tamilRegex = /[\u0B80-\u0BFF]/
  const teluguRegex = /[\u0C00-\u0C7F]/
  const bengaliRegex = /[\u0980-\u09FF]/
  const gujaratiRegex = /[\u0A80-\u0AFF]/
  const kannadaRegex = /[\u0C80-\u0CFF]/
  const malayalamRegex = /[\u0D00-\u0D7F]/
  const gurmukhiRegex = /[\u0A00-\u0A7F]/

  if (devanagariRegex.test(text)) {
    return 'hi-IN' // Hindi/Marathi (need more sophisticated detection)
  }
  if (tamilRegex.test(text)) return 'ta-IN'
  if (teluguRegex.test(text)) return 'te-IN'
  if (bengaliRegex.test(text)) return 'bn-IN'
  if (gujaratiRegex.test(text)) return 'gu-IN'
  if (kannadaRegex.test(text)) return 'kn-IN'
  if (malayalamRegex.test(text)) return 'ml-IN'
  if (gurmukhiRegex.test(text)) return 'pa-IN'

  return 'en-IN' // Default to English
}

/**
 * Format voice error messages
 */
export function formatVoiceError(error: string): string {
  const errorMessages: Record<string, string> = {
    'network': 'Network error. Please check your internet connection.',
    'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
    'no-speech': 'No speech detected. Please try speaking again.',
    'audio-capture': 'Microphone not available. Please check your audio settings.',
    'aborted': 'Speech recognition was cancelled.',
    'language-not-supported': 'Selected language is not supported.',
    'service-not-allowed': 'Speech service not available.',
    'bad-grammar': 'Speech recognition grammar error.',
  }

  return errorMessages[error] || `Voice error: ${error}`
}

/**
 * Audio level detection for visual feedback
 */
export class AudioLevelDetector {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private microphone: MediaStreamAudioSourceNode | null = null
  private dataArray: Uint8Array | null = null
  private animationFrame: number | null = null

  async initialize(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      this.microphone = this.audioContext.createMediaStreamSource(stream)

      this.analyser.fftSize = 256
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)

      this.microphone.connect(this.analyser)

      return true
    } catch (error) {
      console.error('Failed to initialize audio level detector:', error)
      return false
    }
  }

  startMonitoring(callback: (level: number) => void): void {
    if (!this.analyser || !this.dataArray) return

    const monitor = () => {
      this.analyser!.getByteFrequencyData(this.dataArray as any)

      // Calculate average volume
      const sum = this.dataArray!.reduce((a, b) => a + b, 0)
      const average = sum / this.dataArray!.length
      const level = average / 255 // Normalize to 0-1

      callback(level)
      this.animationFrame = requestAnimationFrame(monitor)
    }

    monitor()
  }

  stopMonitoring(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }

  destroy(): void {
    this.stopMonitoring()

    if (this.microphone) {
      this.microphone.disconnect()
      this.microphone = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.analyser = null
    this.dataArray = null
  }
}

/**
 * Voice command patterns for finance domain
 */
export const FINANCE_VOICE_PATTERNS = {
  investment: [
    /invest.*in/i,
    /buy.*stock/i,
    /mutual.*fund/i,
    /portfolio/i,
    /sip/i,
    /systematic.*investment/i
  ],
  budget: [
    /budget/i,
    /expense/i,
    /spending/i,
    /save.*money/i,
    /monthly.*plan/i
  ],
  tax: [
    /tax.*saving/i,
    /80c/i,
    /deduction/i,
    /tax.*planning/i,
    /elss/i
  ],
  loan: [
    /loan/i,
    /emi/i,
    /home.*loan/i,
    /personal.*loan/i,
    /interest.*rate/i
  ],
  insurance: [
    /insurance/i,
    /life.*cover/i,
    /health.*insurance/i,
    /term.*plan/i
  ]
}

/**
 * Classify user intent from voice input
 */
export function classifyVoiceIntent(text: string): string {
  const lowerText = text.toLowerCase()

  for (const [category, patterns] of Object.entries(FINANCE_VOICE_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(lowerText))) {
      return category
    }
  }

  return 'general'
}