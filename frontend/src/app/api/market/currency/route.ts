import { NextRequest, NextResponse } from 'next/server'
import { getOrSetCached } from '@/lib/api/cache'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const EXCHANGE_URL = 'https://api.exchangerate-api.com/v4/latest'

interface RateResult {
  from: string
  to: string
  rate: number
  lastUpdated: string
}

export async function GET(request: NextRequest) {
  const from = (request.nextUrl.searchParams.get('from') || 'USD').toUpperCase()
  const to = (request.nextUrl.searchParams.get('to') || 'INR').toUpperCase()

  const rates = await getOrSetCached<RateResult[]>(`fx_${from}_${to}`, 6 * 60 * 60 * 1000, async () => {
    try {
      const res = await fetch(`${EXCHANGE_URL}/${from}`, { next: { revalidate: 21600 } })
      if (!res.ok) throw new Error(`Exchange rate error: ${res.status}`)
      const data = await res.json()
      if (data.rates && data.rates[to]) {
        return [
          {
            from,
            to,
            rate: data.rates[to],
            lastUpdated: data.date || new Date().toISOString().split('T')[0],
          },
        ]
      }
      throw new Error('Rate not found in response')
    } catch (err) {
      console.error('Currency API error:', err)
      return [
        {
          from,
          to,
          rate: 83.45,
          lastUpdated: new Date().toISOString().split('T')[0],
        },
      ]
    }
  })

  return NextResponse.json({ rates })
}