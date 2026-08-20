import { NextRequest, NextResponse } from 'next/server'
import { getOrSetCached } from '@/lib/api/cache'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const NEWS_URL = 'https://newsapi.org/v2'

interface RawArticle {
  title: string
  description: string
  url: string
  urlToImage?: string
  source?: { name?: string }
  publishedAt?: string
}

function mapArticle(article: RawArticle, category: string, index: number) {
  let hash = 0
  const url = article.url || `local_${category}_${index}`
  for (let i = 0; i < url.length; i++) {
    hash = (hash * 31 + url.charCodeAt(i)) >>> 0
  }
  return {
    id: `news_${hash.toString(36)}`,
    title: article.title,
    description: article.description,
    url,
    source: article.source?.name || 'Unknown',
    publishedAt: article.publishedAt || new Date().toISOString(),
    imageUrl: article.urlToImage || undefined,
    category,
  }
}

const FALLBACK_NEWS: RawArticle[] = [
  {
    title: 'Indian Markets Show Strong Growth as NIFTY Crosses Key Levels',
    description: 'Indian stock markets continue to show positive momentum with strong investor confidence and sustained FII inflows.',
    url: 'https://www.moneycontrol.com/',
    source: { name: 'Money Control' },
  },
  {
    title: 'RBI Holds Repo Rate, Signals Support for Growth',
    description: 'Reserve Bank of India keeps the repo rate unchanged while maintaining its focus on inflation and growth balance.',
    url: 'https://www.rbi.org.in/',
    source: { name: 'RBI' },
  },
  {
    title: 'Mutual Fund SIP Inflows Hit Record High',
    description: 'Systematic Investment Plans see unprecedented monthly inflows as retail investors increase market participation.',
    url: 'https://www.moneycontrol.com/mutual-funds/',
    source: { name: 'Money Control' },
  },
  {
    title: 'Gold Prices Surge Amid Global Uncertainty',
    description: 'Gold hits fresh highs as investors seek safe-haven assets amid global economic uncertainty and rupee weakness.',
    url: 'https://economictimes.indiatimes.com/',
    source: { name: 'Economic Times' },
  },
  {
    title: 'New Tax Reforms: What Changes for Salaried Individuals',
    description: 'Understanding the latest income tax slab changes and how they affect your take-home salary under both regimes.',
    url: 'https://incometaxindia.gov.in/',
    source: { name: 'Income Tax Department' },
  },
]

function getKey(): string | null {
  return process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY || null
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim()
  const mode = request.nextUrl.searchParams.get('mode') || (q ? 'search' : 'top')
  const pageSize = Math.min(Math.max(parseInt(request.nextUrl.searchParams.get('pageSize') || '10', 10) || 10, 1), 20)
  const apiKey = getKey()

  const cacheKey = `news_${mode}_${q.toLowerCase()}_${pageSize}`

  const articles = await getOrSetCached(cacheKey, 10 * 60 * 1000, async () => {
    if (apiKey) {
      try {
        const params = new URLSearchParams({ pageSize: pageSize.toString(), language: 'en' })
        if (mode === 'search' && q) {
          params.set('q', q)
          params.set('sortBy', 'publishedAt')
        } else {
          params.set('category', 'business')
          params.set('country', 'in')
        }
        params.set('apiKey', apiKey)

        const endpoint = mode === 'search' && q ? 'everything' : 'top-headlines'
        const res = await fetch(`${NEWS_URL}/${endpoint}?${params}`, { next: { revalidate: 600 } })
        if (!res.ok) throw new Error(`News API error: ${res.status}`)
        const data = await res.json()
        if (data.articles && data.articles.length > 0) {
          return data.articles
            .filter((a: RawArticle) => a.title && a.description)
            .slice(0, pageSize)
            .map((a: RawArticle, i: number) => mapArticle(a, q || 'Business', i))
        }
      } catch (err) {
        console.error('News API error:', err)
      }
    }
    return FALLBACK_NEWS.slice(0, pageSize).map((a, i) =>
      q ? mapArticle({ ...a, title: a.title.includes(q) ? a.title : `${q}: ${a.title}` }, q, i) : mapArticle(a, 'Business', i)
    )
  })

  return NextResponse.json({ articles, source: apiKey ? 'newsapi' : 'fallback' })
}