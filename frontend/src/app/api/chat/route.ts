import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',  
  'llama-3.1-70b-versatile',  
  'llama-3.1-8b-instant'      
]

const LANGUAGE_PATTERNS = {
  hindi: /[\u0900-\u097F]|नमस्ते|हैलो|कैसे|क्या|मैं|आप|है|हूं|करना|पैसा|निवेश|बचत/,
  marathi: /[\u0900-\u097F]|नमस्कार|कसे|काय|मी|तुम्ही|आहे|करणे|पैसे|गुंतवणूक/,
  tamil: /[\u0B80-\u0BFF]|வணக்கம்|எப்படி|என்ன|நான்|நீங்கள்|இருக்கிறது|செய்ய|பணம்|முதலீடு/,
  telugu: /[\u0C00-\u0C7F]|నమస్కారం|ఎలా|ఏమిటి|నేను|మీరు|ఉంది|చేయడం|డబ్బు|పెట్టుబడి/,
  bengali: /[\u0980-\u09FF]|নমস্কার|কেমন|কি|আমি|আপনি|আছে|করা|টাকা|বিনিয়োগ/,
  english: /^[a-zA-Z0-9\s.,!?'"()-]+$/
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

// Clean text for TTS
function cleanTextForTTS(text: string): string {
  return text
    .replace(/\*\*/g, '')         
    .replace(/\*/g, '')           
    .replace(/__/g, '')           
    .replace(/`/g, '')            
    .replace(/^#+\s/gm, '')       
    .replace(/^\s*-\s/gm, '')     
    .replace(/\d+\.\s/g, '')      
    .replace(/\n\n/g, '. ')       
    .replace(/\s+/g, ' ')         
    .trim()
}

// Detect language
function detectLanguage(message: string): string {
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(message)) return lang
  }
  return 'english'
}

// Layered India-specific system prompts
function getSystemPrompts(language: string) {
  const basePrompt = `
CORE PHILOSOPHY:
1. Empathy first: respect user's income and constraints.
2. Insurance priority: health/life insurance before investments.
3. Debt strategy: aggressively pay off high-interest loans.

MATH CHECKS:
1. Always calculate monthly savings: Total Goal / Months.
2. If savings > 40% of income, inform user it's impossible.
3. Assume 0–6% interest short-term, avoid compounding magic.

TTS RULES:
- Plain text only, no markdown.
- Short, spoken sentences.
- Speak numbers in thousands/lakhs.
`

  const indiaContext = `
INDIAN FINANCIAL CONTEXT:
- Typical salaries: ₹15k–₹50k/month.
- Instruments: FD, RD, PPF, EPF, Sukanya Samriddhi.
- Interest rates realistic: 5–6% FD/RD, 7–8% PPF.
- City cost-of-living: tier 1/2/3 guidance.
`

  const languageInstructions: Record<string, string> = {
    english: 'Respond in English, TTS-ready, numbers in thousands/lakhs.',
    hindi: 'उत्तर हिंदी में दें, बोलने योग्य, संख्याएँ हजार/लाख में।',
    marathi: 'Marathi मध्ये उत्तर द्या, बोलण्यासाठी सोपे, संख्या हजार/लाख मध्ये.',
    tamil: 'தமிழில் பதில் அளிக்கவும், சொல்லும் வகையில், எண்கள் ஆயிரம்/லட்சம்.',
    telugu: 'తెలుగులో సమాధానం ఇవ్వండి, మాట్లాడటానికి సులభం, సంఖ్యలు వేలలో/లక్షల్లో.',
    bengali: 'বাংলায় উত্তর দিন, সহজভাবে বলার জন্য, সংখ্যা হাজার/লক্ষ্যে।'
  }

  const scenarioExamples = `
EXAMPLES:
1. Salary ₹22k, Goal ₹4 lakh in 6 months → Impossible. Suggest timelines: 12 months ₹33k/month, 18 months ₹22k/month.
2. Want to buy bike ₹90k, Salary ₹25k → feasible 12 months ₹7.5k/month.
3. Short-term saving ₹50k, Salary ₹20k → recommend FD/RD or bank saving schemes.
`

  return [
    { role: 'system', content: basePrompt },
    { role: 'system', content: indiaContext },
    { role: 'system', content: languageInstructions[language] || languageInstructions.english },
    { role: 'system', content: scenarioExamples }
  ]
}

// Call Groq API
async function callGroqAPI(messages: any[], modelName: string): Promise<any> {
  return await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      temperature: 0.1,
      max_tokens: 1000,
      stream: false
    })
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, conversation_history = [], preferred_language } = body

    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })
    if (!GROQ_API_KEY) return NextResponse.json({ error: 'API Key missing' }, { status: 503 })

    const detectedLanguage = preferred_language || detectLanguage(message)
    const messages = [
      ...getSystemPrompts(detectedLanguage),
      ...conversation_history,
      { role: 'user', content: message }
    ]

    let aiResponse = ''
    let workingModel = ''

    for (const model of GROQ_MODELS) {
      try {
        const response = await callGroqAPI(messages, model)
        if (response.ok) {
          const data = await response.json()
          if (data.choices?.[0]?.message?.content) {
            aiResponse = data.choices[0].message.content
            workingModel = model
            break
          }
        }
      } catch (e) { continue }
    }

    if (!aiResponse) return NextResponse.json({ error: 'AI unavailable' }, { status: 500 })

    const voiceReadyResponse = cleanTextForTTS(aiResponse)

    return NextResponse.json({
      response: voiceReadyResponse,
      detected_language: detectedLanguage,
      model: workingModel
    })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
