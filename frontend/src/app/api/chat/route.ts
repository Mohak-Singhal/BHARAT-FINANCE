import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// List of models to try in order of preference - Gemini 2.5 Flash prioritized
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-latest',
  'gemini-2.5-flash-002',
  'gemini-2.5-flash-001',
  'gemini-2.5-flash-exp',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash',
  'gemini-1.5-pro-002',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro'
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
    sip: 'एसआईपी (व्यवस्थित निवेश योजना)',
    ppf: 'पीपीएফ (सार्वजनिक भविष्य निधि)',
    elss: 'ईएलएसएस (इक्विटी लिंक्ड सेविंग्स स्कीम)',
    investment: 'निवेश',
    savings: 'बचत',
    budget: 'बजट',
    tax: 'कर',
    rupees: '₹'
  },
  marathi: {
    sip: 'एसआयपी (व्यवस्थित गुंतवणूक योजना)',
    ppf: 'पीपीएफ (सार्वजनिक भविष्य निधी)',
    elss: 'ईएलएसएस (इक्विटी लिंक्ड सेव्हिंग्स स्कीम)',
    investment: 'गुंतवणूक',
    savings: 'बचत',
    budget: 'अर्थसंकल्प',
    tax: 'कर',
    rupees: '₹'
  },
  tamil: {
    sip: 'எஸ்ஐபி (முறையான முதலீட்டு திட்டம்)',
    ppf: 'பிபிஎஃப் (பொது வருங்கால வைப்பு நிதி)',
    elss: 'இஎல்எஸ்எஸ் (பங்கு இணைக்கப்பட்ட சேமிப்பு திட்டம்)',
    investment: 'முதலீடு',
    savings: 'சேமிப்பு',
    budget: 'வரவு செலவு திட்டம்',
    tax: 'வரி',
    rupees: '₹'
  },
  telugu: {
    sip: 'ఎస్ఐపి (క్రమబద్ధమైన పెట్టుబడి పథకం)',
    ppf: 'పిపిఎఫ్ (పబ్లిక్ ప్రావిడెంట్ ఫండ్)',
    elss: 'ఇఎల్ఎస్ఎస్ (ఈక్విటీ లింక్డ్ సేవింగ్స్ స్కీమ్)',
    investment: 'పెట్టుబడి',
    savings: 'పొదుపు',
    budget: 'బడ్జెట్',
    tax: 'పన్ను',
    rupees: '₹'
  },
  bengali: {
    sip: 'এসআইপি (সিস্টেমেটিক ইনভেস্টমেন্ট প্ল্যান)',
    ppf: 'পিপিএফ (পাবলিক প্রভিডেন্ট ফান্ড)',
    elss: 'ইএলএসএস (ইক্যুইটি লিংকড সেভিংস স্কিম)',
    investment: 'বিনিয়োগ',
    savings: 'সঞ্চয়',
    budget: 'বাজেট',
    tax: 'কর',
    rupees: '₹'
  },
  english: {
    sip: 'SIP (Systematic Investment Plan)',
    ppf: 'PPF (Public Provident Fund)',
    elss: 'ELSS (Equity Linked Savings Scheme)',
    investment: 'investment',
    savings: 'savings',
    budget: 'budget',
    tax: 'tax',
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

// Detect user's language from message
function detectLanguage(message: string): string {
  // Check for explicit language patterns
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(message)) {
      return lang
    }
  }
  
  // Default to English if no pattern matches
  return 'english'
}

// Check if response is complete (ends with proper punctuation)
function isResponseComplete(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.length === 0) return false
  
  // Check if ends with proper sentence endings
  const endsWithPunctuation = /[.!?।॥।।]$/.test(trimmed)
  
  // Check if doesn't end mid-word or with incomplete phrases
  const endsIncomplete = /\b(and|or|but|so|the|a|an|in|on|at|to|for|with|by|from|up|about|into|through|during|before|after|above|below|between|among|since|until|while|because|although|however|therefore|moreover|furthermore|additionally|consequently|meanwhile|nevertheless|nonetheless|otherwise|instead|rather|indeed|certainly|definitely|probably|perhaps|maybe|possibly|likely|unlikely|obviously|clearly|apparently|evidently|surprisingly|unfortunately|fortunately|interestingly|importantly|significantly|particularly|especially|specifically|generally|typically|usually|normally|commonly|frequently|rarely|seldom|never|always|often|sometimes|occasionally|regularly|constantly|continuously|permanently|temporarily|immediately|instantly|quickly|slowly|gradually|suddenly|eventually|finally|ultimately|initially|originally|previously|recently|currently|presently|nowadays|today|tomorrow|yesterday|earlier|later|soon|shortly|briefly|momentarily|shortly|recently|lately|ago|since|until|during|while|when|where|why|how|what|which|who|whom|whose|that|this|these|those|such|same|other|another|each|every|all|some|any|no|none|both|either|neither|few|many|much|more|most|less|least|several|various|different|similar|same|equal|equivalent|identical|comparable|relative|absolute|exact|approximate|rough|precise|accurate|correct|wrong|right|left|up|down|in|out|on|off|over|under|above|below|before|after|during|while|since|until|from|to|at|by|with|without|through|across|along|around|between|among|within|outside|inside|beyond|beneath|beside|near|far|close|distant|here|there|everywhere|nowhere|somewhere|anywhere|wherever|whenever|however|whatever|whichever|whoever|whomever|whose|why|how|where|when|what|which|who|whom|that|this|these|those|such|same|other|another|each|every|all|some|any|no|none|both|either|neither|few|many|much|more|most|less|least|several|various|different|similar|equal|equivalent|identical|comparable|relative|absolute|exact|approximate|rough|precise|accurate|correct|wrong|right|left)$/i.test(trimmed)
  
  return endsWithPunctuation && !endsIncomplete
}

// Attempt to complete truncated response
async function completeResponse(originalResponse: string, originalPrompt: string, modelName: string): Promise<string> {
  if (isResponseComplete(originalResponse)) {
    return originalResponse
  }
  
  const completionPrompt = `The following response was cut off mid-sentence. Please complete it naturally and ensure it ends with proper punctuation:

Original response: "${originalResponse}"

Complete the response by continuing from where it left off. Make sure to:
1. Continue the thought naturally
2. End with proper punctuation
3. Keep the same tone and language
4. Provide a complete, helpful answer

Completed response:`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`
    
    const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: completionPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 30,
          topP: 0.8,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ]
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const completedResponse = data.candidates[0].content.parts[0].text.trim()
        return completedResponse
      }
    }
  } catch (error) {
    console.error('Error completing response:', error)
  }
  
  // If completion fails, return original with proper ending
  return originalResponse.trim() + (originalResponse.trim().match(/[.!?।॥]$/) ? '' : '.')
}

async function callGeminiAPI(prompt: string, modelName: string, retryCount = 0): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`
  
  const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 1500, // Increased significantly for complete responses
        stopSequences: [], // Remove any stop sequences that might truncate
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    }),
  })

  return response
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, conversation_history = [], preferred_language } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      return NextResponse.json({
        error: 'Gemini API key is not configured. Please add your GEMINI_API_KEY to the .env.local file.',
        setup_required: true,
        instructions: 'Get your free API key from https://makersuite.google.com/app/apikey'
      }, { status: 503 })
    }

    // Detect user's language
    const detectedLanguage = preferred_language || detectLanguage(message)
    const terms = FINANCIAL_TERMS[detectedLanguage as keyof typeof FINANCIAL_TERMS] || FINANCIAL_TERMS.english

    // Create language-specific system prompt
    const getSystemPrompt = (language: string) => {
      const basePrompts = {
        hindi: `आप भारतीय उपयोगकर्ताओं के लिए एक मित्रवत AI वित्त सलाहकार हैं। व्यावहारिक वित्तीय सलाह प्रदान करें।

उत्तर शैली:
- पूर्ण वाक्यों में उत्तर दें (कम से कम 3-4 वाक्य)
- सरल, रोजमर्रा की भाषा का उपयोग करें
- प्रोत्साहित करने वाले और सहायक बनें
- व्यावहारिक सुझाव दें
- भारतीय वित्तीय उत्पादों पर ध्यान दें (${terms.sip}, ${terms.ppf}, ${terms.elss})
- ${terms.rupees} में उदाहरण दें

महत्वपूर्ण: हमेशा पूर्ण, सहायक उत्तर प्रदान करें। वाक्य बीच में न छोड़ें।`,

        marathi: `तुम्ही भारतीय वापरकर्त्यांसाठी एक मैत्रीपूर्ण AI वित्त सल्लागार आहात. व्यावहारिक आर्थिक सल्ला द्या.

उत्तर शैली:
- पूर्ण वाक्यांमध्ये उत्तर द्या (किमान 3-4 वाक्ये)
- सोपी, दैनंदिन भाषा वापरा
- प्रोत्साहनदायक आणि सहाय्यक व्हा
- व्यावहारिक सूचना द्या
- भारतीय आर्थिक उत्पादनांवर लक्ष केंद्रित करा (${terms.sip}, ${terms.ppf}, ${terms.elss})
- ${terms.rupees} मध्ये उदाहरणे द्या

महत्वाचे: नेहमी पूर्ण, उपयुक्त उत्तरे द्या. वाक्य अर्ध्यात सोडू नका.`,

        tamil: `நீங்கள் இந்திய பயனர்களுக்கான நட்பு AI நிதி ஆலோசகர். நடைமுறை நிதி ஆலோசனை வழங்கவும்.

பதில் பாணி:
- முழுமையான வாக்கியங்களில் பதிலளிக்கவும் (குறைந்தது 3-4 வாக்கியங்கள்)
- எளிய, அன்றாட மொழியைப் பயன்படுத்தவும்
- ஊக்கமளிக்கும் மற்றும் உதவிகரமாக இருங்கள்
- நடைமுறை ஆலோசனைகளை வழங்கவும்
- இந்திய நிதி தயாரிப்புகளில் கவனம் செலுத்துங்கள் (${terms.sip}, ${terms.ppf}, ${terms.elss})
- ${terms.rupees} இல் உதாரணங்களை கொடுங்கள்

முக்கியம்: எப்போதும் முழுமையான, உதவிகரமான பதில்களை வழங்கவும். வாக்கியங்களை நடுவில் விடாதீர்கள்.`,

        telugu: `మీరు భారతీయ వినియోగదారుల కోసం స్నేహపూర్వక AI ఫైనాన్స్ సలహాదారు. ఆచరణాత్మక ఆర్థిక సలహా అందించండి.

సమాధాన శైలి:
- పూర్తి వాక్యాలలో సమాధానం ఇవ్వండి (కనీసం 3-4 వాక్యాలు)
- సరళమైన, రోజువారీ భాషను ఉపయోగించండి
- ప్రోత్సాహకరంగా మరియు సహాయకరంగా ఉండండి
- ఆచరణాత్మక సలహాలు ఇవ్వండి
- భారతీయ ఆర్థిక ఉత్పత్తులపై దృష్టి పెట్టండి (${terms.sip}, ${terms.ppf}, ${terms.elss})
- ${terms.rupees} లో ఉదాహరణలు ఇవ్వండి

ముఖ్యమైనది: ఎల్లప్పుడూ పూర్తి, సహాయకరమైన సమాధానాలు అందించండి. వాక్యాలను మధ్యలో వదిలేయవద్దు.`,

        bengali: `আপনি ভারতীয় ব্যবহারকারীদের জন্য একজন বন্ধুত্বপূর্ণ AI অর্থ পরামর্শদাতা। ব্যবহারিক আর্থিক পরামর্শ প্রদান করুন।

উত্তরের ধরন:
- সম্পূর্ণ বাক্যে উত্তর দিন (কমপক্ষে 3-4টি বাক্য)
- সহজ, দৈনন্দিন ভাষা ব্যবহার করুন
- উৎসাহব্যঞ্জক এবং সহায়ক হন
- ব্যবহারিক পরামর্শ দিন
- ভারতীয় আর্থিক পণ্যগুলিতে মনোনিবেশ করুন (${terms.sip}, ${terms.ppf}, ${terms.elss})
- ${terms.rupees} এ উদাহরণ দিন

গুরুত্বপূর্ণ: সর্বদা সম্পূর্ণ, সহায়ক উত্তর প্রদান করুন। বাক্য মাঝখানে ছেড়ে দেবেন না।`,

        english: `You are a friendly AI Finance Coach for Indian users. Provide helpful, practical financial advice in a conversational tone.

RESPONSE STYLE:
- Write complete sentences (minimum 3-4 sentences)
- Use simple, everyday language
- Be encouraging and supportive
- Ask follow-up questions to engage the user
- Use emojis sparingly (1-2 per response)
- Focus on actionable next steps
- Always provide complete, helpful responses

CONTENT GUIDELINES:
- Focus on Indian financial products (${terms.sip}, ${terms.ppf}, ${terms.elss}, etc.)
- Use Indian currency (${terms.rupees}) in examples
- Give practical, specific advice with examples
- Always mention risk factors briefly
- Suggest 2-3 concrete options with brief explanations
- End with a question to continue the conversation

TONE: Friendly financial advisor, not a textbook. Think "helpful friend who knows finance" rather than "formal financial consultant."

IMPORTANT: Always provide complete, helpful responses. Never cut off mid-sentence. Ensure responses end with proper punctuation.`
      }

      return basePrompts[language as keyof typeof basePrompts] || basePrompts.english
    }

    const systemPrompt = `${getSystemPrompt(detectedLanguage)}

Current conversation: ${conversation_history.length > 0 ? 
  conversation_history.map(msg => `${msg.role}: ${msg.content}`).join('\n') : 'New conversation'
}

User question: ${message}

Respond in ${detectedLanguage} with a complete, helpful answer. Ensure the response is grammatically correct and culturally appropriate.`

    // Try models in order until one works
    let lastError = null
    let workingModel = null

    for (const model of GEMINI_MODELS) {
      try {
        console.log(`Trying model: ${model}`)
        const response = await callGeminiAPI(systemPrompt, model)
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let aiResponse = data.candidates[0].content.parts[0].text.trim()
            workingModel = model
            
            // Check if response is complete, if not try to complete it
            if (!isResponseComplete(aiResponse)) {
              console.log('Response appears incomplete, attempting completion...')
              aiResponse = await completeResponse(aiResponse, systemPrompt, model)
            }
            
            return NextResponse.json({
              response: aiResponse,
              timestamp: new Date().toISOString(),
              source: 'gemini',
              model: model,
              detected_language: detectedLanguage,
              is_complete: isResponseComplete(aiResponse)
            })
          } else {
            // Check for safety blocks or other issues
            console.log('Unexpected response structure:', JSON.stringify(data, null, 2))
            if (data.candidates && data.candidates[0] && data.candidates[0].finishReason) {
              console.log('Finish reason:', data.candidates[0].finishReason)
              
              // If blocked by safety, try with a more neutral prompt
              if (data.candidates[0].finishReason === 'SAFETY') {
                console.log('Response blocked by safety filters, trying next model...')
                continue
              }
            }
          }
        } else {
          const errorText = await response.text()
          lastError = { status: response.status, statusText: response.statusText, details: errorText }
          console.log(`Model ${model} failed:`, response.status, response.statusText)
          
          // If it's a rate limit error, return immediately with helpful message
          if (response.status === 429) {
            return NextResponse.json({
              error: 'Rate limit exceeded. Please wait a moment and try again.',
              details: 'You have exceeded the free tier quota for Gemini API. Please wait about 1 minute before trying again, or consider upgrading your API plan.',
              api_error: true,
              rate_limited: true,
              model: model
            }, { status: 429 })
          }
          
          // Continue to next model for 404 errors
          continue
        }
      } catch (error) {
        console.log(`Model ${model} error:`, error)
        lastError = { error: error instanceof Error ? error.message : 'Unknown error' }
        continue
      }
    }

    // If we get here, all models failed
    console.error('All Gemini models failed. Last error:', lastError)
    
    return NextResponse.json({
      error: `All Gemini models failed. Last error: ${lastError?.status || 'Unknown'} ${lastError?.statusText || ''}`,
      details: lastError?.details || lastError?.error || 'All available models returned errors',
      api_error: true,
      tried_models: GEMINI_MODELS
    }, { status: lastError?.status || 500 })

  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      server_error: true
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Finance Coach API is running',
    status: 'healthy',
    available_models: GEMINI_MODELS,
    supported_languages: ['english', 'hindi', 'marathi', 'tamil', 'telugu', 'bengali'],
    features: {
      auto_language_detection: true,
      response_completion: true,
      multi_language_support: true,
      truncation_handling: true
    },
    timestamp: new Date().toISOString(),
    gemini_configured: !!(GEMINI_API_KEY && GEMINI_API_KEY.trim() !== ''),
    setup_required: !(GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '')
  })
}