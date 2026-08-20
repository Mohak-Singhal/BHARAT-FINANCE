import { NextRequest, NextResponse } from 'next/server'
import { getGroqCompletion, detectLanguage, ChatMessage } from '@/lib/api/llm'
import { offlineGuidance } from '@/lib/api/fallback'

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

    let response: string
    let model: string | undefined
    let offline = false
    try {
      const result = await getGroqCompletion([...history, { role: 'user', content: message }], preferred_language)
      response = result.response
      model = result.model
    } catch (error) {
      console.error('Chat AI unavailable:', error)
      response = offlineGuidance(message)
      offline = true
    }

    return NextResponse.json({
      response,
      detected_language: detectLanguage(message),
      model,
      offline,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}