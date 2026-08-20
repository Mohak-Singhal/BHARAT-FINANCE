import { NextRequest, NextResponse } from 'next/server'
import { getGroqCompletion, detectLanguage, ChatMessage } from '@/lib/api/llm'

interface ChatRequest {
  message: string
  conversation_history?: ChatMessage[]
  preferred_language?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, conversation_history = [], preferred_language } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const history = conversation_history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)

    let result
    try {
      result = await getGroqCompletion([...history, { role: 'user', content: message }], preferred_language)
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json(
        {
          error: 'AI unavailable',
          details: messageText,
          api_error: true,
          setup_required: messageText.includes('not configured'),
          instructions:
            'Add GROQ_API_KEY to your Vercel project environment variables (Settings > Environment Variables) and redeploy.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      response: result.response,
      detected_language: detectLanguage(message),
      model: result.model,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}