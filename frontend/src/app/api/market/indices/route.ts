import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Deterministic day-seeded index values so the UI stays stable within a day.
function seedFor(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0
  }
  return hash
}

const INDICES = [
  { symbol: 'NIFTY 50', name: 'NIFTY 50', base: 21950, drift: 900, pctRange: 2.2 },
  { symbol: 'SENSEX', name: 'BSE SENSEX', base: 72100, drift: 1800, pctRange: 1.8 },
  { symbol: 'BANK NIFTY', name: 'BANK NIFTY', base: 46400, drift: 1600, pctRange: 2.6 },
  { symbol: 'INDIA VIX', name: 'India VIX', base: 13.5, drift: 3, pctRange: 9 },
]

export async function GET() {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10)
  const seed = seedFor(dateStr)

  const indices = INDICES.map((index, i) => {
    const jitter = ((seed >> (i * 5)) % 1000) / 1000
    const value = Math.round((index.base + (jitter - 0.5) * 2 * index.drift) * 100) / 100
    const change = Math.round((jitter - 0.5) * 2 * index.base * (index.pctRange / 100) * 100) / 100
    const changePercent = Math.round((change / value) * 10000) / 100
    return {
      symbol: index.symbol,
      name: index.name,
      value,
      change,
      changePercent,
      lastUpdated: now.toISOString(),
    }
  })

  return NextResponse.json({ indices })
}