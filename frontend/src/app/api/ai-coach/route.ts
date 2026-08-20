import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getGroqCompletion, ChatMessage } from '@/lib/api/llm'

const SYSTEM_INSTRUCTION = `You are a helpful, empathetic, and knowledgeable Finance Coach for rural India.
Your goal is to help users with financial literacy, government schemes, budgeting, and investment advice in a simple, easy-to-understand manner.
You should answer in the language the user is speaking if possible, or in English if not specified, but be ready to handle multiple Indian languages.
Keep your answers concise and actionable. Avoid complex financial jargon.
Remember context from previous messages in the conversation to provide more personalized advice.`

interface AiCoachRequest {
  message: string
  conversation_history?: ChatMessage[]
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversation_history = [] }: AiCoachRequest = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Preferred path: Google Gemini (high quality).
    if (process.env.GOOGLE_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_INSTRUCTION,
        })

        const history = conversation_history
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-10)
          .map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          }))

        const chat = model.startChat({
          history,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        })

        const result = await chat.sendMessage(message)
        return NextResponse.json({ response: result.response.text() })
      } catch (error) {
        console.error('Gemini error, falling back to Groq:', error)
      }
    }

    // Fallback: Groq (works with GROQ_API_KEY / NEXT_PUBLIC_GROQ_API_KEY).
    try {
      const result = await getGroqCompletion(
        [...conversation_history.slice(-10), { role: 'user', content: message }],
        undefined
      )
      return NextResponse.json({ response: result.response, model: result.model })
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json(
        {
          error: 'AI unavailable',
          details: messageText,
          setup_required: messageText.includes('not configured'),
          instructions:
            'Add GOOGLE_API_KEY or GROQ_API_KEY to your Vercel project environment variables and redeploy.',
        },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Error in AI Coach API:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}