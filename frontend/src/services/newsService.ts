'use client'

/**
 * News Service - Personalized Financial News
 * Uses NewsAPI for real-time financial news with topic-following support
 * Falls back to mock data if the API is not configured or fails
 */

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: Date
  imageUrl?: string
  category: string
}

export interface NewsTopic {
  id: string
  label: string
  query: string
  icon: string
}

export const NEWS_TOPICS: NewsTopic[] = [
  { id: 'stock-market', label: 'Stock Market', query: 'stock market India NIFTY SENSEX', icon: '📈' },
  { id: 'crypto', label: 'Crypto', query: 'cryptocurrency Bitcoin', icon: '🪙' },
  { id: 'mutual-funds', label: 'Mutual Funds', query: 'mutual funds SIP ELSS', icon: '💰' },
  { id: 'rbi', label: 'RBI & Economy', query: 'RBI repo rate inflation GDP India', icon: '🏦' },
  { id: 'gold', label: 'Gold & Commodities', query: 'gold price silver commodity India', icon: '🥇' },
  { id: 'tax', label: 'Tax & ITR', query: 'income tax ITR GST India', icon: '🧾' },
  { id: 'ipo', label: 'IPO & Startups', query: 'IPO startup funding India', icon: '🚀' },
  { id: 'real-estate', label: 'Real Estate', query: 'real estate property market India', icon: '🏠' },
  { id: 'loans', label: 'Loans & Credit', query: 'home loan personal loan credit score India', icon: '🏦' },
  { id: 'insurance', label: 'Insurance', query: 'health insurance life insurance India', icon: '🛡️' },
]

export const STORAGE_KEY = 'bharat_finance_followed_news_topics'

const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'mock_news_1',
    title: 'Indian Markets Show Strong Growth as NIFTY Crosses Key Levels',
    description: 'Indian stock markets continue to show positive momentum with strong investor confidence.',
    url: 'https://www.moneycontrol.com/',
    source: 'Money Control',
    publishedAt: new Date(),
    category: 'Stock Market',
  },
  {
    id: 'mock_news_2',
    title: 'RBI Announces New Monetary Policy Changes Affecting Interest Rates',
    description: 'Reserve Bank of India announces new monetary policy changes affecting interest rates.',
    url: 'https://www.rbi.org.in/',
    source: 'RBI',
    publishedAt: new Date(Date.now() - 3600000),
    category: 'RBI & Economy',
  },
  {
    id: 'mock_news_3',
    title: 'Mutual Fund Performance Review: Top Funds of This Quarter',
    description: 'Comprehensive review of top-performing mutual funds in the current market scenario.',
    url: 'https://www.moneycontrol.com/mutual-funds/',
    source: 'Money Control',
    publishedAt: new Date(Date.now() - 7200000),
    category: 'Mutual Funds',
  },
  {
    id: 'mock_news_4',
    title: 'Gold Prices Surge Amid Global Uncertainty',
    description: 'Gold hits new highs as investors seek safe haven assets amid global economic uncertainty.',
    url: 'https://economictimes.indiatimes.com/',
    source: 'Economic Times',
    publishedAt: new Date(Date.now() - 10800000),
    category: 'Gold & Commodities',
  },
  {
    id: 'mock_news_5',
    title: 'New Tax Reforms: What Changes for Salaried Individuals',
    description: 'Understanding the latest income tax slab changes and how they affect your take-home salary.',
    url: 'https://incometaxindia.gov.in/',
    source: 'Income Tax Department',
    publishedAt: new Date(Date.now() - 14400000),
    category: 'Tax & ITR',
  },
]

class NewsService {
  private apiKey: string | null = null
  private baseUrl = 'https://newsapi.org/v2'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY || null
  }

  public isConfigured(): boolean {
    return this.apiKey !== null && this.apiKey.length > 0
  }

  /**
   * Get latest financial headlines
   */
  public async getTopHeadlines(pageSize: number = 10): Promise<NewsArticle[]> {
    if (!this.isConfigured()) {
      return MOCK_NEWS.slice(0, pageSize)
    }

    try {
      const params = new URLSearchParams({
        apiKey: this.apiKey!,
        category: 'business',
        country: 'in',
        language: 'en',
        pageSize: pageSize.toString(),
      })

      const response = await fetch(`${this.baseUrl}/top-headlines?${params}`)
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`)
      }

      const data = await response.json()
      return this.processNewsResults(data.articles || [], 'Business')
    } catch (error) {
      console.error('News API error:', error)
      return MOCK_NEWS.slice(0, pageSize)
    }
  }

  /**
   * Search for news related to specific followed topics
   */
  public async searchFinancialNews(query: string, pageSize: number = 10): Promise<NewsArticle[]> {
    if (!this.isConfigured()) {
      return MOCK_NEWS.slice(0, pageSize).map(article => ({
        ...article,
        title: article.title.includes(query) ? article.title : `${query}: ${article.title}`,
      }))
    }

    try {
      const params = new URLSearchParams({
        apiKey: this.apiKey!,
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: pageSize.toString(),
      })

      const response = await fetch(`${this.baseUrl}/everything?${params}`)
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`)
      }

      const data = await response.json()
      return this.processNewsResults(data.articles || [], 'Followed Topics')
    } catch (error) {
      console.error('News search error:', error)
      return MOCK_NEWS.slice(0, pageSize).map(article => ({
        ...article,
        title: article.title.includes(query) ? article.title : `${query}: ${article.title}`,
      }))
    }
  }

  /**
   * Get news for multiple followed topics
   */
  public async getFollowedNews(topicQueries: string[], pageSize: number = 5): Promise<NewsArticle[]> {
    const results = await Promise.all(
      topicQueries.map(query => this.searchFinancialNews(query, pageSize))
    )
    return results.flat()
  }

  private processNewsResults(articles: any[], defaultCategory: string): NewsArticle[] {
    return articles
      .filter((article: any) => article.title && article.description)
      .map((article: any) => ({
        id: this.generateId(article.url),
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source?.name || 'Unknown',
        publishedAt: new Date(article.publishedAt),
        imageUrl: article.urlToImage || undefined,
        category: defaultCategory,
      }))
      .slice(0, 20)
  }

  private generateId(url: string): string {
    let hash = 0
    for (let i = 0; i < url.length; i++) {
      hash = (hash * 31 + url.charCodeAt(i)) >>> 0
    }
    return `news_${hash.toString(36)}`
  }
}

export const newsService = new NewsService()