import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// List of models to try in order of preference - Gemini 2.5 Flash prioritized
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-latest',
  'gemini-2.5-flash-002',
  'gemini-2.5-flash-001',
  'gemini-2.5-flash-exp',
]

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  conversation_history?: ChatMessage[]
}

async function callGeminiAPI(prompt: string, modelName: string) {
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
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }),
  })

  return response
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, conversation_history = [] } = body

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

    // Prepare the context for Gemini
    const systemPrompt = `You are an AI Finance Coach for Indian users. You provide helpful, accurate, and personalized financial advice. 

Key guidelines:
- Focus on Indian financial products (SIP, PPF, NPS, ELSS, etc.)
- Use Indian currency (₹) in examples
- Consider Indian tax laws and regulations
- Provide practical, actionable advice
- Be encouraging and supportive
- Keep responses concise but informative
- If asked about investments, always mention risk factors
- Suggest diversification and long-term planning
- Use emojis and formatting to make responses engaging

Current conversation context: ${conversation_history.length > 0 ? 
  conversation_history.map(msg => `${msg.role}: ${msg.content}`).join('\n') : 'New conversation'
}

User question: ${message}`

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
            const aiResponse = data.candidates[0].content.parts[0].text
            workingModel = model
            
            return NextResponse.json({
              response: aiResponse,
              timestamp: new Date().toISOString(),
              source: 'gemini',
              model: model
            })
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
    timestamp: new Date().toISOString(),
    gemini_configured: !!(GEMINI_API_KEY && GEMINI_API_KEY.trim() !== ''),
    setup_required: !(GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '')
  })
}