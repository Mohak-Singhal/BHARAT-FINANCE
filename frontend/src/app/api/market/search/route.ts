import { NextRequest, NextResponse } from 'next/server'
import { getOrSetCached } from '@/lib/api/cache'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BASE_URL = 'https://www.alphavantage.co/query'

const POPULAR_STOCKS = [
  { symbol: 'RELIANCE.BSE', name: 'Reliance Industries', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'TCS.BSE', name: 'Tata Consultancy Services', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'INFY.BSE', name: 'Infosys', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'KOTAKBANK.BSE', name: 'Kotak Mahindra Bank', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'BHARTIARTL.BSE', name: 'Bharti Airtel', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'SBIN.BSE', name: 'State Bank of India', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'ITC.BSE', name: 'ITC Limited', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'HINDUNILVR.BSE', name: 'Hindustan Unilever', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'TATAMOTORS.BSE', name: 'Tata Motors', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'WIPRO.BSE', name: 'Wipro', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'AXISBANK.BSE', name: 'Axis Bank', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'MARUTI.BSE', name: 'Maruti Suzuki', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'LT.BSE', name: 'Larsen & Toubro', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'HCLTECH.BSE', name: 'HCL Technologies', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'ASIANPAINT.BSE', name: 'Asian Paints', type: 'Equity', region: 'India/BSE', currency: 'INR' },
  { symbol: 'BAJFINANCE.BSE', name: 'Bajaj Finance', type: 'Equity', region: 'India/BSE', currency: 'INR' },
]

function getKey(): string | null {
  return process.env.ALPHA_VANTAGE_API_KEY || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || null
}

export async function GET(request: NextRequest) {
  const keywords = (request.nextUrl.searchParams.get('q') || '').trim()

  if (keywords.length < 2) {
    return NextResponse.json({ error: 'Provide at least 2 characters in the q parameter' }, { status: 400 })
  }

  const apiKey = getKey()

  const results = await getOrSetCached(`market_search_${keywords.toLowerCase()}`, 15 * 60 * 1000, async () => {
    if (apiKey) {
      try {
        const params = new URLSearchParams({
          function: 'SYMBOL_SEARCH',
          keywords,
          apikey: apiKey,
        })
        const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 900 } })
        if (!res.ok) throw new Error(`Alpha Vantage search error: ${res.status}`)
        const data = await res.json()
        if (data.bestMatches && data.bestMatches.length > 0) {
          return data.bestMatches.map((match: any) => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            type: match['3. type'],
            region: match['4. region'],
            currency: match['8. currency'],
          }))
        }
      } catch (err) {
        console.error('Stock search API error:', err)
      }
    }
    const kw = keywords.toLowerCase()
    return POPULAR_STOCKS.filter(
      (s) => s.symbol.toLowerCase().includes(kw) || s.name.toLowerCase().includes(kw)
    ).slice(0, 8)
  })

  return NextResponse.json({ results, source: apiKey ? 'alphavantage' : 'local' })
}