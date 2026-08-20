import { NextRequest, NextResponse } from 'next/server'
import { getGroqCompletion, detectLanguage, ChatMessage } from '@/lib/api/llm'

interface FinanceCoachRequest {
  message: string
  conversation_history?: ChatMessage[]
  preferred_language?: string
  user_context?: Record<string, unknown>
}

// Heuristic follow-up suggestions + warnings attached to every answer.
function getSuggestions(message: string): string[] {
  const lower = message.toLowerCase()
  const topics: Array<[RegExp, string]> = [
    [/invest|sip|mutual|stock|share|equity/, 'How should I start investing?'],
    [/tax|itr|80c|80d|deduction/, 'What are the best tax-saving options?'],
    [/budget|expense|spend|expenditure/, 'Help me create a monthly budget'],
    [/emergency/, 'How much emergency fund do I need?'],
    [/insurance|health|life|term/, 'Which insurance policy should I buy?'],
    [/loan|emi|debt|credit/, 'How do I reduce my debt faster?'],
    [/retire|pension|nps|ppf/, 'How much do I need for retirement?'],
    [/gold/, 'Should I invest in gold or Sovereign Gold Bonds?'],
    [/house|home|property/, 'How to plan a home purchase?'],
    [/saving|save/, 'What are good savings options in India?'],
  ]
  return topics.filter(([pattern]) => pattern.test(lower)).map(([, suggestion]) => suggestion)
}

function getWarnings(message: string): string[] {
  const lower = message.toLowerCase()
  const warnings: string[] = []
  if (/(crypto|bitcoin|get rich|guaranteed return|double.*money|lottery|pyramid)/.test(lower)) {
    warnings.push('Be very careful with high-return promises - anything above ~12% per year is usually risky or fraudulent.')
  }
  if (/(loan|emi|credit card)/.test(lower) && /(buy|take|need)/.test(lower)) {
    warnings.push('Compare interest rates before taking any loan. Avoid credit card debt (36-48% interest).')
  }
  return warnings
}

export async function POST(request: NextRequest) {
  try {
    const body: FinanceCoachRequest = await request.json()
    const { message, conversation_history = [], preferred_language } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const history = conversation_history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)

    let response: string
    let model: string | undefined
    try {
      const result = await getGroqCompletion(
        [...history, { role: 'user', content: message }],
        preferred_language
      )
      response = result.response
      model = result.model
    } catch (error) {
      // Offline-safe fallback: helpful, deterministic guidance when no AI key is set.
      const errorText = error instanceof Error ? error.message : ''
      if (errorText.includes('not configured')) {
        return NextResponse.json(
          {
            error: 'AI unavailable',
            setup_required: true,
            instructions:
              'Add GROQ_API_KEY (or GOOGLE_API_KEY) to your Vercel project environment variables and redeploy.',
          },
          { status: 503 }
        )
      }
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }

    const suggestions = getSuggestions(message)
    const warnings = getWarnings(message)

    return NextResponse.json({
      response,
      suggestions: suggestions.length > 0 ? suggestions.slice(0, 3) : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      detected_language: detectLanguage(message),
      model,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}