import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',   // 1. BEST. Superior reasoning & math. Use this primarily.
  'llama-3.1-70b-versatile',   // 2. Backup. Good logic, but slightly older.
  'llama-3.1-8b-instant'       // 3. Fallback. FAST but bad at math. Only use if others fail.
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

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  conversation_history?: ChatMessage[]
  preferred_language?: string
}

// Helper to clean text specifically for Text-to-Speech (TTS)
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

function detectLanguage(message: string): string {
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(message)) {
      return lang
    }
  }
  return 'english'
}

// UPDATED SYSTEM PROMPT WITH MATH GUARDRAILS
const getSystemPrompt = (language: string) => {
  const commonStrategy = `
    CORE PHILOSOPHY:
    1. **Empathy First:** Acknowledge the user's hard work and income limitations.
    2. **Insurance is Priority #1:** Always check for health/life insurance before investments.
    3. **Debt Strategy:** Aggressively pay off high-interest loans (credit card, personal loan).

    CRITICAL MATH & REALITY CHECKS (MUST FOLLOW):
    1. **Do the Math First:** Before suggesting a monthly savings amount, calculate: Total Goal Amount divided by Number of Months.
    2. **Reality Check:** If the calculated monthly savings is MORE than 40% of their monthly income, YOU MUST TELL THEM IT IS IMPOSSIBLE.
       - *Example:* If User earns 20k and wants 4 Lakh in 6 months (requires ~66k/month), say: "To reach 4 Lakh in 6 months, you need to save 66,000 per month. This is more than your salary. We need to extend the timeline or reduce the goal."
    3. **Do not hallucinate interest:** For short term (<1 year), assume 0% or simple 5-6% bank interest. Do not rely on compound interest magic for short periods.

    TTS FORMATTING RULES:
    - Write in PLAIN TEXT only. No Markdown.
    - Use short, spoken sentences.
    - Speak numbers clearly (e.g., "66 thousand rupees").
  `

  const prompts = {
    english: `You are a strategic Financial Mentor.
    ${commonStrategy}
    
    Response Structure if Goal is Unrealistic:
    "I did the math, and we have a challenge. To get [Goal Amount] in [Time], you need to save [Monthly Amount]. Since your salary is [Salary], this is not possible right now. Let's adjust the timeline."`,

    hindi: `आप एक वित्तीय मेंटर हैं.
    ${commonStrategy}
    
    महत्वपूर्ण: यदि लक्ष्य असंभव है (जैसे वेतन से अधिक बचत की आवश्यकता है), तो उपयोगकर्ता को स्पष्ट बताएं.
    उदाहरण: "मैंने हिसाब लगाया है. 4 लाख जमा करने के लिए आपको हर महीने 66 हजार बचाने होंगे. चूँकि आपकी सैलरी 22 हजार है, यह 6 महीने में मुमकिन नहीं है. हमें या तो समय बढ़ाना होगा या लक्ष्य कम करना होगा."`,
    
    marathi: `You are a Financial Mentor speaking Marathi. Follow this logic: ${commonStrategy}. If the math shows the goal is impossible based on income, clearly explain why in Marathi.`,
    tamil: `You are a Financial Mentor speaking Tamil. Follow this logic: ${commonStrategy}. If the math shows the goal is impossible based on income, clearly explain why in Tamil.`,
    telugu: `You are a Financial Mentor speaking Telugu. Follow this logic: ${commonStrategy}. If the math shows the goal is impossible based on income, clearly explain why in Telugu.`,
    bengali: `You are a Financial Mentor speaking Bengali. Follow this logic: ${commonStrategy}. If the math shows the goal is impossible based on income, clearly explain why in Bengali.`
  }

  return prompts[language as keyof typeof prompts] || prompts.english
}

async function callGroqAPI(messages: any[], modelName: string): Promise<any> {
  return await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
      temperature: 0.1, // DRASTICALLY REDUCED to ensure strict math adherence
      max_tokens: 1000,
      stream: false
    }),
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
      { role: 'system', content: getSystemPrompt(detectedLanguage) },
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
      } catch (e) {
        continue
      }
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