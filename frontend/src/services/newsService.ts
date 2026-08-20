'use client'

/**
 * News Service - Personalized Financial News
 * Fetches from the serverless /api/news proxy (NewsAPI + curated fallback)
 * with topic-following support
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

class NewsService {
  /**
   * Get latest financial headlines
   */
  public async getTopHeadlines(pageSize: number = 10): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams({ mode: 'top', pageSize: pageSize.toString() })
      const response = await fetch(`/api/news?${params}`)
      if (!response.ok) {
        throw new Error(`News proxy error: ${response.status}`)
      }
      const data = await response.json()
      return this.processNewsResults(data.articles || [])
    } catch (error) {
      console.error('News fetch error:', error)
      return []
    }
  }

  /**
   * Search for news related to specific followed topics
   */
  public async searchFinancialNews(query: string, pageSize: number = 10): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams({ mode: 'search', q: query, pageSize: pageSize.toString() })
      const response = await fetch(`/api/news?${params}`)
      if (!response.ok) {
        throw new Error(`News proxy error: ${response.status}`)
      }
      const data = await response.json()
      return this.processNewsResults(data.articles || [])
    } catch (error) {
      console.error('News search error:', error)
      return []
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

  private processNewsResults(articles: any[]): NewsArticle[] {
    return articles
      .filter((article: any) => article.title && article.description)
      .map((article: any) => ({
        id: article.id || this.generateId(article.url || ''),
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source || 'Unknown',
        publishedAt: new Date(article.publishedAt || Date.now()),
        imageUrl: article.imageUrl || undefined,
        category: article.category || 'Business',
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