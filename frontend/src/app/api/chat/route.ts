import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Groq models to try in order of preference
const GROQ_MODELS = [
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'mixtral-8x7b-32768'
]

// Language detection patterns
const LANGUAGE_PATTERNS = {
  hindi: /[\u0900-\u097F]|नमस्ते|हैलो|कैसे|क्या|मैं|आप|है|हूं|करना|पैसा|निवेश|बचत/,
  marathi: /[\u0900-\u097F]|नमस्कार|कसे|काय|मी|तुम्ही|आहे|करणे|पैसे|गुंतवणूक/,
  tamil: /[\u0B80-\u0BFF]|வணக்கம்|எப்படி|என்ன|நான்|நீங்கள்|இருக்கிறது|செய்ய|பணம்|முதலீடு/,
  telugu: /[\u0C00-\u0C7F]|నమస్కారం|ఎలా|ఏమిటి|నేను|మీరు|ఉంది|చేయడం|డబ్బు|పెట్టుబడి/,
  bengali: /[\u0980-\u09FF]|নমস্কার|কেমন|কি|আমি|আপনি|আছে|করা|টাকা|বিনিয়োগ/,
  english: /^[a-zA-Z0-9\s.,!?'"()-]+$/
}

// Language-specific financial terms
const FINANCIAL_TERMS = {
  hindi: {
    sip: 'SIP',
    ppf: 'PPF',
    elss: 'ELSS',
    rupees: '₹'
  },
  marathi: {
    sip: 'SIP',
    ppf: 'PPF',
    elss: 'ELSS',
    rupees: '₹'
  },
  tamil: {
    sip: 'SIP',
    ppf: 'PPF',
    elss: 'ELSS',
    rupees: '₹'
  },
  telugu: {
    sip: 'SIP',
    ppf: 'PPF',
    elss: 'ELSS',
    rupees: '₹'
  },
  bengali: {
    sip: 'SIP',
    ppf: 'PPF',
    elss: 'ELSS',
    rupees: '₹'
  },
  english: {
    sip: 'SIP',
    ppf: 'PPF',
    elss: 'ELSS',
    rupees: '₹'
  }
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  conversation_history?: ChatMessage[]
  preferred_language?: string
}

// Helper to remove any lingering Markdown symbols that confuse TTS
function cleanTextForTTS(text: string): string {
  return text
    .replace(/\*\*/g, '') // Remove bold asterisks
    .replace(/\*/g, '')   // Remove single asterisks
    .replace(/__/g, '')   // Remove underscores
    .replace(/`/g, '')    // Remove code ticks
    .replace(/^#+\s/gm, '') // Remove headers
    .replace(/^\s*-\s/gm, '') // Remove bullet points
    .replace(/\n\n/g, '. ') // Turn double line breaks into pauses
    .trim()
}

// Detect user's language from message
function detectLanguage(message: string): string {
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(message)) {
      return lang
    }
  }
  return 'english'
}

async function callGroqAPI(messages: any[], modelName: string): Promise<any> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 0.9,
      stream: false
    }),
  })
  return response
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, conversation_history = [], preferred_language } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!GROQ_API_KEY || GROQ_API_KEY.trim() === '') {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 503 })
    }

    const detectedLanguage = preferred_language || detectLanguage(message)
    const terms = FINANCIAL_TERMS[detectedLanguage as keyof typeof FINANCIAL_TERMS] || FINANCIAL_TERMS.english

    // UPDATED PROMPTS: Specifically designed for VOICE/TTS
    // Instructions explicitly forbid Markdown and lists
    const getSystemPrompt = (language: string) => {
      const basePrompts = {
        hindi: `आप एक मित्रवत वित्तीय सलाहकार हैं जो बोलकर बात कर रहे हैं।
शैलियाँ:
- बिल्कुल साधारण टेक्स्ट में लिखें।
- कोई भी फॉर्मेटिंग, बोल्ड (**), बुलेट पॉइंट या लिस्ट का उपयोग न करें।
- वाक्यों को छोटा और बोलने में आसान रखें।
- लिस्ट के बजाय "पहला", "दूसरा", "अंत में" शब्दों का प्रयोग करें।
- केवल ₹ (रुपये) का उपयोग करें।
- उत्तर ऐसा होना चाहिए जिसे आसानी से पढ़ा और सुना जा सके।`,

        marathi: `तुम्ही एक मैत्रीपूर्ण आर्थिक सल्लागार आहात जे बोलत आहेत.
शैली:
- पूर्णपणे साध्या मजकुरात लिहा.
- कोणतेही फॉरमॅटिंग, बोल्ड (**), बुलेट पॉइंट्स वापरू नका.
- वाक्ये लहान आणि बोलण्यास सोपी ठेवा.
- यादीऐवजी "पहिले", "दुसरे", "शेवटी" असे शब्द वापरा.
- उत्तर असे असावे जे सहज वाचता आणि ऐकता येईल.`,

        tamil: `நீங்கள் ஒரு நட்பு நிதி ஆலோசகர்.
பாணி:
- எளிய உரையில் மட்டுமே எழுதவும்.
- எந்தவொரு வடிவமைப்பு, தடிமனான எழுத்துக்கள் (**) அல்லது பட்டியல்களைப் பயன்படுத்த வேண்டாம்.
- வாக்கியங்களைச் சிறியதாகவும் பேசுவதற்கு எளிதாகவும் வைக்கவும்.
- பட்டியல்களுக்குப் பதிலாக "முதலில்", "இரண்டாவதாக" போன்ற சொற்களைப் பயன்படுத்தவும்.
- பதில் குரல் வழி கேட்பதற்கு ஏற்றதாக இருக்க வேண்டும்.`,

        telugu: `మీరు స్నేహపూర్వక ఆర్థిక సలహాదారు.
శైలి:
- సాధారణ వచనంలో మాత్రమే రాయండి.
- ఎటువంటి ఫార్మాటింగ్, బోల్డ్ (**), లేదా జాబితాలను ఉపయోగించవద్దు.
- వాక్యాలను చిన్నవిగా మరియు మాట్లాడటానికి సులభంగా ఉంచండి.
- జాబితాలకు బదులుగా "మొదట", "రెండవది" వంటి పదాలను ఉపయోగించండి.
- సమాధానం వాయిస్ ద్వారా వినడానికి అనుకూలంగా ఉండాలి.`,

        bengali: `আপনি একজন বন্ধুত্বপূর্ণ আর্থিক পরামর্শদাতা।
শৈলী:
- শুধুমাত্র সাধারণ পাঠ্য ব্যবহার করুন।
- কোনো ফরম্যাটিং, বোল্ড (**) বা বুলেট পয়েন্ট ব্যবহার করবেন না।
- বাক্যগুলি ছোট এবং বলার জন্য সহজ রাখুন।
- তালিকার পরিবর্তে "প্রথমত", "দ্বিতীয়ত" শব্দগুলি ব্যবহার করুন।
- উত্তরটি এমন হতে হবে যা সহজেই শোনা এবং বোঝা যায়।`,

        english: `You are a friendly AI Finance Coach speaking to the user via voice.
RESPONSE RULES FOR TTS (TEXT-TO-SPEECH):
1. **STRICTLY NO MARKDOWN**. Do not use bold (**), italics, headers, or bullet points.
2. Do not use numbered lists (1. 2. 3.). Instead, use transitional words like "First," "Another option is," and "Finally."
3. Keep sentences short and conversational.
4. Use full names for acronyms when first mentioned, for example: "${terms.sip} or Systematic Investment Plan".
5. Speak naturally as if you are on a phone call.
6. Provide specific Indian context using ${terms.rupees}.

Example of good format: "Clearing off loans is a great goal. To start, I suggest looking at Debt Consolidation. This helps combine your loans. Another option is starting a small SIP."`
      }

      return basePrompts[language as keyof typeof basePrompts] || basePrompts.english
    }

    const messages = [
      { role: 'system', content: getSystemPrompt(detectedLanguage) },
      ...conversation_history,
      { role: 'user', content: message }
    ]

    let workingModel = null
    let aiResponse = ''

    // Attempt to get response from Groq
    for (const model of GROQ_MODELS) {
      try {
        const response = await callGroqAPI(messages, model)
        if (response.ok) {
          const data = await response.json()
          if (data.choices?.[0]?.message) {
            aiResponse = data.choices[0].message.content
            workingModel = model
            break
          }
        }
      } catch (e) {
        continue
      }
    }

    if (!workingModel) {
      return NextResponse.json({ error: 'AI models unavailable' }, { status: 500 })
    }

    // FINAL CLEANUP FOR TTS
    // 1. Run the cleanTextForTTS regex function to strip any markdown symbols the AI might have slipped in.
    const ttsFriendlyResponse = cleanTextForTTS(aiResponse)

    return NextResponse.json({
      response: ttsFriendlyResponse, // This is now clean text ready for voice
      source: 'groq',
      model: workingModel,
      detected_language: detectedLanguage
    })

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'AI Voice-Finance API Ready' })
}