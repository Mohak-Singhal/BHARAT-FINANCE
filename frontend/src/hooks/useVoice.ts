import { useState, useEffect, useCallback, useRef } from 'react'
import { voiceService, VoiceConfig, TTSConfig, VoiceCallbacks } from '@/services/voiceService'

export interface UseVoiceOptions {
  autoSpeak?: boolean
  sttConfig?: Partial<VoiceConfig>
  ttsConfig?: Partial<TTSConfig>
  onTranscript?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
}

export interface VoiceState {
  isListening: boolean
  isSpeaking: boolean
  isSupported: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  availableVoices: SpeechSynthesisVoice[]
}

export interface VoiceActions {
  startListening: () => boolean
  stopListening: () => void
  speak: (text: string, config?: Partial<TTSConfig>) => boolean
  stopSpeaking: () => void
  pauseSpeaking: () => void
  resumeSpeaking: () => void
  setLanguage: (language: string) => void
  setPreferredVoice: (voiceName: string) => boolean
  clearTranscript: () => void
  clearError: () => void
}

export function useVoice(options: UseVoiceOptions = {}): [VoiceState, VoiceActions] {
  const {
    autoSpeak = false,
    sttConfig,
    ttsConfig,
    onTranscript,
    onError
  } = options

  const [state, setState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isSupported: false,
    transcript: '',
    interimTranscript: '',
    error: null,
    availableVoices: []
  })

  const finalTranscriptRef = useRef('')
  const interimTranscriptRef = useRef('')

  // Initialize voice service and set up callbacks
  useEffect(() => {
    const callbacks: VoiceCallbacks = {
      onResult: (transcript: string, isFinal: boolean) => {
        if (isFinal) {
          finalTranscriptRef.current = transcript
          setState(prev => ({
            ...prev,
            transcript: transcript,
            interimTranscript: ''
          }))
          onTranscript?.(transcript, true)
        } else {
          interimTranscriptRef.current = transcript
          setState(prev => ({
            ...prev,
            interimTranscript: transcript
          }))
          onTranscript?.(transcript, false)
        }
      },
      onError: (error: string) => {
        setState(prev => ({
          ...prev,
          error,
          isListening: false
        }))
        onError?.(error)
      },
      onStart: () => {
        setState(prev => ({
          ...prev,
          isListening: true,
          error: null
        }))
      },
      onEnd: () => {
        setState(prev => ({
          ...prev,
          isListening: false
        }))
      },
      onTTSStart: () => {
        setState(prev => ({
          ...prev,
          isSpeaking: true
        }))
      },
      onTTSEnd: () => {
        setState(prev => ({
          ...prev,
          isSpeaking: false
        }))
      },
      onTTSError: (error: string) => {
        setState(prev => ({
          ...prev,
          error,
          isSpeaking: false
        }))
        onError?.(error)
      }
    }

    voiceService.setCallbacks(callbacks)

    // Apply custom configurations
    if (sttConfig) {
      voiceService.updateSTTConfig(sttConfig)
    }
    if (ttsConfig) {
      voiceService.updateTTSConfig(ttsConfig)
    }

    // Initialize state
    setState(prev => ({
      ...prev,
      isSupported: voiceService.isVoiceSupported(),
      availableVoices: voiceService.getAvailableVoices()
    }))

    // Load voices when they become available
    const loadVoices = () => {
      setState(prev => ({
        ...prev,
        availableVoices: voiceService.getAvailableVoices()
      }))
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      voiceService.destroy()
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [sttConfig, ttsConfig, onTranscript, onError])

  // Actions
  const startListening = useCallback((): boolean => {
    finalTranscriptRef.current = ''
    interimTranscriptRef.current = ''
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      error: null
    }))
    return voiceService.startListening()
  }, [])

  const stopListening = useCallback((): void => {
    voiceService.stopListening()
  }, [])

  const speak = useCallback((text: string, config?: Partial<TTSConfig>): boolean => {
    return voiceService.speak(text, config)
  }, [])

  const stopSpeaking = useCallback((): void => {
    voiceService.stopSpeaking()
  }, [])

  const pauseSpeaking = useCallback((): void => {
    voiceService.pauseSpeaking()
  }, [])

  const resumeSpeaking = useCallback((): void => {
    voiceService.resumeSpeaking()
  }, [])

  const setLanguage = useCallback((language: string): void => {
    voiceService.setLanguage(language)
  }, [])

  const setPreferredVoice = useCallback((voiceName: string): boolean => {
    return voiceService.setPreferredVoice(voiceName)
  }, [])

  const clearTranscript = useCallback((): void => {
    finalTranscriptRef.current = ''
    interimTranscriptRef.current = ''
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: ''
    }))
  }, [])

  const clearError = useCallback((): void => {
    setState(prev => ({
      ...prev,
      error: null
    }))
  }, [])

  const actions: VoiceActions = {
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    setLanguage,
    setPreferredVoice,
    clearTranscript,
    clearError
  }

  return [state, actions]
}

export default useVoice