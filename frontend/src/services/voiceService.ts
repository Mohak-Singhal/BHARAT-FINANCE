/**
 * Voice Service for Speech-to-Text (STT) and Text-to-Speech (TTS)
 * Provides comprehensive voice interaction capabilities
 */

export interface VoiceConfig {
  language: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  autoGainControl: boolean
  echoCancellation: boolean
  noiseSuppression: boolean
}

export interface TTSConfig {
  rate: number
  pitch: number
  volume: number
  voice?: SpeechSynthesisVoice
  lang: string
}

export interface VoiceCallbacks {
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
  onSpeechStart?: () => void
  onSpeechEnd?: () => void
  onTTSStart?: () => void
  onTTSEnd?: () => void
  onTTSError?: (error: string) => void
}

class VoiceService {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private isSpeaking = false
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private callbacks: VoiceCallbacks = {}
  
  private defaultSTTConfig: VoiceConfig = {
    language: 'en-IN',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1,
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true
  }
  
  private defaultTTSConfig: TTSConfig = {
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    lang: 'en-IN'
  }

  constructor() {
    this.initializeServices()
  }

  private initializeServices(): void {
    if (typeof window === 'undefined') return

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.setupRecognition()
    }

    // Initialize Speech Synthesis
    if (window.speechSynthesis) {
      this.synthesis = window.speechSynthesis
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return

    // Apply default configuration
    Object.assign(this.recognition, this.defaultSTTConfig)

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true
      this.callbacks.onStart?.()
    }

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results)
      const lastResult = results[results.length - 1]
      
      if (lastResult) {
        const transcript = lastResult[0].transcript
        const isFinal = lastResult.isFinal
        this.callbacks.onResult?.(transcript, isFinal)
      }
    }

    this.recognition.onerror = (event) => {
      this.isListening = false
      this.callbacks.onError?.(event.error)
    }

    this.recognition.onend = () => {
      this.isListening = false
      this.callbacks.onEnd?.()
    }

    this.recognition.onspeechstart = () => {
      this.callbacks.onSpeechStart?.()
    }

    this.recognition.onspeechend = () => {
      this.callbacks.onSpeechEnd?.()
    }
  }

  // STT Methods
  public startListening(config?: Partial<VoiceConfig>): boolean {
    if (!this.recognition || this.isListening) return false

    try {
      // Apply custom configuration if provided
      if (config) {
        Object.assign(this.recognition, { ...this.defaultSTTConfig, ...config })
      }

      this.recognition.start()
      return true
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      this.callbacks.onError?.('Failed to start speech recognition')
      return false
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  public abortListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort()
    }
  }

  // TTS Methods
  public speak(text: string, config?: Partial<TTSConfig>): boolean {
    if (!this.synthesis || this.isSpeaking) return false

    try {
      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utteranceConfig = { ...this.defaultTTSConfig, ...config }
      this.currentUtterance = new SpeechSynthesisUtterance(text)
      
      // Apply configuration
      this.currentUtterance.rate = utteranceConfig.rate
      this.currentUtterance.pitch = utteranceConfig.pitch
      this.currentUtterance.volume = utteranceConfig.volume
      this.currentUtterance.lang = utteranceConfig.lang
      
      if (utteranceConfig.voice) {
        this.currentUtterance.voice = utteranceConfig.voice
      }

      // Event handlers
      this.currentUtterance.onstart = () => {
        this.isSpeaking = true
        this.callbacks.onTTSStart?.()
      }

      this.currentUtterance.onend = () => {
        this.isSpeaking = false
        this.currentUtterance = null
        this.callbacks.onTTSEnd?.()
      }

      this.currentUtterance.onerror = (event) => {
        this.isSpeaking = false
        this.currentUtterance = null
        this.callbacks.onTTSError?.(event.error)
      }

      this.synthesis.speak(this.currentUtterance)
      return true
    } catch (error) {
      console.error('Failed to start speech synthesis:', error)
      this.callbacks.onTTSError?.('Failed to start speech synthesis')
      return false
    }
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.isSpeaking = false
      this.currentUtterance = null
    }
  }

  public pauseSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause()
    }
  }

  public resumeSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.resume()
    }
  }

  // Voice Management
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }

  public getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.getAvailableVoices().filter(voice => 
      voice.lang.toLowerCase().includes(language.toLowerCase())
    )
  }

  public setPreferredVoice(voiceName: string): boolean {
    const voices = this.getAvailableVoices()
    const voice = voices.find(v => v.name === voiceName)
    
    if (voice) {
      this.defaultTTSConfig.voice = voice
      return true
    }
    return false
  }

  // Utility Methods
  public isSTTSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }

  public isTTSSupported(): boolean {
    return !!window.speechSynthesis
  }

  public isVoiceSupported(): boolean {
    return this.isSTTSupported() && this.isTTSSupported()
  }

  public getListeningState(): boolean {
    return this.isListening
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking
  }

  public setCallbacks(callbacks: VoiceCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  public updateSTTConfig(config: Partial<VoiceConfig>): void {
    this.defaultSTTConfig = { ...this.defaultSTTConfig, ...config }
  }

  public updateTTSConfig(config: Partial<TTSConfig>): void {
    this.defaultTTSConfig = { ...this.defaultTTSConfig, ...config }
  }

  // Advanced Features
  public startContinuousListening(): boolean {
    return this.startListening({ continuous: true, interimResults: true })
  }

  public speakWithInterruption(text: string, config?: Partial<TTSConfig>): boolean {
    this.stopSpeaking()
    return this.speak(text, config)
  }

  // Language Support
  public setLanguage(language: string): void {
    this.defaultSTTConfig.language = language
    this.defaultTTSConfig.lang = language
    
    if (this.recognition) {
      this.recognition.lang = language
    }
  }

  public getSupportedLanguages(): string[] {
    const voices = this.getAvailableVoices()
    const languages = new Set(voices.map(voice => voice.lang))
    return Array.from(languages).sort()
  }

  // Cleanup
  public destroy(): void {
    this.stopListening()
    this.stopSpeaking()
    this.callbacks = {}
  }
}

// Export singleton instance
export const voiceService = new VoiceService()
export default VoiceService