# Voice Integration Guide

## Overview

This AI Finance Coach application now includes comprehensive voice-to-voice support using native browser APIs:
- **Speech-to-Text (STT)**: Web Speech API (SpeechRecognition)
- **Text-to-Speech (TTS)**: Web Speech Synthesis API

## Features

### 🎤 Speech Recognition (STT)
- Real-time voice input with interim results
- Support for 12+ Indian languages (Hindi, Tamil, Telugu, Bengali, etc.)
- Automatic language detection
- Continuous and single-shot recognition modes
- Audio level monitoring
- Error handling with user-friendly messages

### 🔊 Text-to-Speech (TTS)
- Natural voice output for AI responses
- Multiple voice options per language
- Adjustable speech rate, pitch, and volume
- Language-specific optimizations
- Auto-speak mode for hands-free interaction
- Voice preview and testing

### 🌍 Multi-Language Support
Supported languages:
- English (India, US, UK)
- हिंदी (Hindi)
- தமிழ் (Tamil)
- తెలుగు (Telugu)
- বাংলা (Bengali)
- ગુજરાતી (Gujarati)
- ಕನ್ನಡ (Kannada)
- മലയാളം (Malayalam)
- मराठी (Marathi)
- ਪੰਜਾਬੀ (Punjabi)

## Architecture

### Core Components

#### 1. VoiceService (`src/services/voiceService.ts`)
Central service managing all voice operations:
```typescript
import { voiceService } from '@/services/voiceService'

// Start listening
voiceService.startListening()

// Speak text
voiceService.speak('Hello, how can I help you?')

// Stop operations
voiceService.stopListening()
voiceService.stopSpeaking()
```

#### 2. useVoice Hook (`src/hooks/useVoice.ts`)
React hook for easy voice integration:
```typescript
import { useVoice } from '@/hooks/useVoice'

const [voiceState, voiceActions] = useVoice({
  autoSpeak: true,
  sttConfig: { language: 'en-IN' },
  ttsConfig: { rate: 0.9, pitch: 1.0 },
  onTranscript: (text, isFinal) => {
    console.log('Transcript:', text)
  }
})

// Use voice actions
voiceActions.startListening()
voiceActions.speak('Hello!')
```

#### 3. VoiceChat Component (`src/components/ai-coach/VoiceChat.tsx`)
Complete voice-enabled chat interface:
```typescript
import VoiceChat from '@/components/ai-coach/VoiceChat'

<VoiceChat
  onSendMessage={handleMessage}
  autoSpeak={true}
  language="en-IN"
/>
```

#### 4. VoiceSettings Component (`src/components/ai-coach/VoiceSettings.tsx`)
Advanced voice configuration UI:
- Language selection
- Voice selection
- Speech parameter adjustment
- Voice testing

### Utility Functions (`src/utils/voiceUtils.ts`)

```typescript
import {
  getBrowserLanguage,
  getBestVoiceForLanguage,
  detectLanguageFromText,
  classifyVoiceIntent,
  formatVoiceError
} from '@/utils/voiceUtils'

// Get optimal voice for language
const voice = getBestVoiceForLanguage('hi-IN')

// Detect language from text
const lang = detectLanguageFromText('नमस्ते')

// Classify user intent
const intent = classifyVoiceIntent('I want to invest in mutual funds')
```

## Usage Examples

### Basic Voice Chat

```typescript
import VoiceChat from '@/components/ai-coach/VoiceChat'

function MyComponent() {
  const handleMessage = async (message: string) => {
    // Process message and return response
    const response = await fetchAIResponse(message)
    return response
  }

  return (
    <VoiceChat
      onSendMessage={handleMessage}
      autoSpeak={true}
      language="en-IN"
    />
  )
}
```

### Custom Voice Integration

```typescript
import { useVoice } from '@/hooks/useVoice'

function CustomVoiceComponent() {
  const [voiceState, voiceActions] = useVoice({
    autoSpeak: false,
    sttConfig: {
      language: 'hi-IN',
      continuous: true,
      interimResults: true
    },
    ttsConfig: {
      rate: 0.8,
      pitch: 1.1,
      volume: 1.0
    },
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        console.log('Final transcript:', text)
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    }
  })

  return (
    <div>
      <button onClick={voiceActions.startListening}>
        Start Listening
      </button>
      <button onClick={() => voiceActions.speak('Hello!')}>
        Speak
      </button>
      <p>Transcript: {voiceState.transcript}</p>
      <p>Status: {voiceState.isListening ? 'Listening' : 'Idle'}</p>
    </div>
  )
}
```

### Voice Service Direct Usage

```typescript
import { voiceService } from '@/services/voiceService'

// Configure callbacks
voiceService.setCallbacks({
  onResult: (transcript, isFinal) => {
    console.log('Transcript:', transcript, 'Final:', isFinal)
  },
  onError: (error) => {
    console.error('Error:', error)
  },
  onStart: () => console.log('Started listening'),
  onEnd: () => console.log('Stopped listening'),
  onTTSStart: () => console.log('Started speaking'),
  onTTSEnd: () => console.log('Finished speaking')
})

// Start listening
voiceService.startListening({
  language: 'en-IN',
  continuous: false,
  interimResults: true
})

// Speak text
voiceService.speak('Hello, how can I help you?', {
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
  lang: 'en-IN'
})

// Get available voices
const voices = voiceService.getAvailableVoices()
const hindiVoices = voiceService.getVoicesByLanguage('hi-IN')

// Set preferred voice
voiceService.setPreferredVoice('Google हिन्दी')

// Change language
voiceService.setLanguage('hi-IN')
```

## Browser Compatibility

### Speech Recognition (STT)
- ✅ Chrome/Edge (full support)
- ✅ Safari (iOS 14.5+, macOS 15+)
- ⚠️ Firefox (limited support)
- ❌ Opera (no support)

### Speech Synthesis (TTS)
- ✅ Chrome/Edge (full support)
- ✅ Safari (full support)
- ✅ Firefox (full support)
- ✅ Opera (full support)

### Checking Support

```typescript
import { isSTTSupported, isTTSSupported, isVoiceSupported } from '@/utils/voiceUtils'

if (isVoiceSupported()) {
  console.log('Full voice support available')
} else if (isSTTSupported()) {
  console.log('Only STT available')
} else if (isTTSSupported()) {
  console.log('Only TTS available')
} else {
  console.log('No voice support')
}
```

## Configuration

### Language-Specific Optimizations

The system automatically applies optimal settings for each language:

```typescript
// Hindi - slower rate, higher pitch
{ rate: 0.8, pitch: 1.1, continuous: true }

// Regional languages - slightly slower
{ rate: 0.85, pitch: 1.05, interimResults: false }

// English - standard settings
{ rate: 0.9, pitch: 1.0, continuous: false }
```

### Custom Configuration

```typescript
// Update STT config
voiceService.updateSTTConfig({
  language: 'hi-IN',
  continuous: true,
  interimResults: true,
  maxAlternatives: 3
})

// Update TTS config
voiceService.updateTTSConfig({
  rate: 0.8,
  pitch: 1.2,
  volume: 0.9,
  lang: 'hi-IN'
})
```

## Best Practices

### 1. Error Handling
Always handle voice errors gracefully:

```typescript
const [voiceState, voiceActions] = useVoice({
  onError: (error) => {
    const message = formatVoiceError(error)
    showNotification(message)
  }
})
```

### 2. User Permissions
Request microphone permissions early:

```typescript
useEffect(() => {
  if (isSTTSupported()) {
    // This will trigger permission request
    voiceActions.startListening()
    voiceActions.stopListening()
  }
}, [])
```

### 3. Cleanup
Always cleanup voice resources:

```typescript
useEffect(() => {
  return () => {
    voiceService.destroy()
  }
}, [])
```

### 4. Mobile Considerations
- Use single-shot recognition on mobile (not continuous)
- Provide clear visual feedback
- Handle interruptions (phone calls, notifications)
- Test on actual devices

### 5. Language Detection
Auto-detect language when possible:

```typescript
const detectedLang = detectLanguageFromText(userInput)
if (detectedLang !== currentLanguage) {
  voiceActions.setLanguage(detectedLang)
}
```

## Troubleshooting

### Common Issues

#### 1. Microphone Not Working
```typescript
// Check permissions
navigator.permissions.query({ name: 'microphone' })
  .then(result => {
    if (result.state === 'denied') {
      alert('Please enable microphone permissions')
    }
  })
```

#### 2. No Voices Available
```typescript
// Wait for voices to load
window.speechSynthesis.onvoiceschanged = () => {
  const voices = voiceService.getAvailableVoices()
  console.log('Voices loaded:', voices.length)
}
```

#### 3. Speech Recognition Stops Unexpectedly
```typescript
// Use continuous mode for longer sessions
voiceService.startListening({ continuous: true })

// Or restart on end
voiceService.setCallbacks({
  onEnd: () => {
    if (shouldKeepListening) {
      voiceService.startListening()
    }
  }
})
```

#### 4. TTS Not Speaking
```typescript
// Ensure synthesis is not paused
if (window.speechSynthesis.paused) {
  window.speechSynthesis.resume()
}

// Cancel any pending speech
window.speechSynthesis.cancel()
```

## Performance Optimization

### 1. Debounce Interim Results
```typescript
const debouncedTranscript = useMemo(
  () => debounce((text) => processTranscript(text), 300),
  []
)
```

### 2. Lazy Load Voice Service
```typescript
const voiceService = lazy(() => import('@/services/voiceService'))
```

### 3. Preload Voices
```typescript
useEffect(() => {
  // Preload voices on mount
  window.speechSynthesis.getVoices()
}, [])
```

## Security Considerations

1. **HTTPS Required**: Web Speech API requires HTTPS in production
2. **User Consent**: Always get explicit user consent before accessing microphone
3. **Data Privacy**: Voice data is processed locally in the browser
4. **No Recording**: The API doesn't record audio, only transcribes in real-time

## Testing

### Manual Testing Checklist
- [ ] Microphone permission request
- [ ] Voice input in different languages
- [ ] TTS output quality
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Browser compatibility
- [ ] Network interruption handling
- [ ] Multiple voice selection

### Automated Testing
```typescript
// Mock voice service for testing
jest.mock('@/services/voiceService', () => ({
  voiceService: {
    startListening: jest.fn(),
    speak: jest.fn(),
    isVoiceSupported: () => true
  }
}))
```

## Future Enhancements

- [ ] Voice activity detection (VAD)
- [ ] Noise cancellation
- [ ] Speaker identification
- [ ] Voice biometrics
- [ ] Offline voice support
- [ ] Custom wake words
- [ ] Voice commands
- [ ] Multi-speaker support

## Resources

- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechRecognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [Browser Compatibility](https://caniuse.com/speech-recognition)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify microphone permissions
3. Test in supported browsers
4. Check network connectivity
5. Review error messages

## License

This voice integration is part of the Bharat Finance application and follows the same license terms.