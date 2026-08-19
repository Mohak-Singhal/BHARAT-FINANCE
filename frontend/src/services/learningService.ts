'use client'

/**
 * Learning Service - Financial Education Content
 * Uses YouTube Data API for video search + curated articles
 * Falls back to mock data if API is not configured or fails
 */

export interface VideoResult {
  id: string
  title: string
  thumbnail: string
  channel: string
  url: string
  description?: string
  publishedAt?: string
}

export interface ArticleResult {
  id: string
  title: string
  url: string
  source: string
  publishedDate?: Date
  description?: string
}

export interface LearningContent {
  videos: VideoResult[]
  articles: ArticleResult[]
  summary: string
  relatedTopics: string[]
}

export interface SearchOptions {
  maxResults?: number
  language?: string
}

const FINANCIAL_KEYWORDS = [
  'financial education',
  'personal finance India',
  'investment guide',
  'money management',
  'financial planning',
  'stock market basics',
  'mutual funds explained',
]

const DEFAULT_ARTICLES: ArticleResult[] = [
  {
    id: 'article_1',
    title: 'The Ultimate Investment Guide for Beginners',
    url: 'https://www.moneycontrol.com/news/business/personal-finance/',
    source: 'Money Control',
    publishedDate: new Date(Date.now() - 86400000),
    description: 'Comprehensive guide covering all aspects of investing with updated information.',
  },
  {
    id: 'article_2',
    title: 'How to Build a Strong SIP Portfolio',
    url: 'https://economictimes.indiatimes.com/wealth/invest',
    source: 'Economic Times',
    publishedDate: new Date(Date.now() - 172800000),
    description: 'Step-by-step guide for beginners looking to start their SIP journey.',
  },
  {
    id: 'article_3',
    title: 'Mutual Fund Trends and Predictions',
    url: 'https://www.business-standard.com/markets',
    source: 'Business Standard',
    publishedDate: new Date(Date.now() - 259200000),
    description: 'Analysis of current trends and future predictions in the mutual fund space.',
  },
  {
    id: 'article_4',
    title: 'Tax Saving Strategies Under Section 80C',
    url: 'https://www.livemint.com/money',
    source: 'Mint',
    publishedDate: new Date(Date.now() - 345600000),
    description: 'Professional advice and tips on maximizing your tax savings legally.',
  },
  {
    id: 'article_5',
    title: 'Understanding Stock Market Regulations in India',
    url: 'https://www.financialexpress.com/market/',
    source: 'Financial Express',
    publishedDate: new Date(Date.now() - 432000000),
    description: 'Understanding the regulatory landscape for stock markets in India (SEBI).',
  },
]

class LearningService {
  private youtubeApiKey: string | null = null
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map()

  constructor() {
    this.youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || null
  }

  public isYouTubeConfigured(): boolean {
    return this.youtubeApiKey !== null && this.youtubeApiKey.length > 0
  }

  /**
   * Search for educational videos on YouTube
   */
  public async searchVideos(query: string, options: SearchOptions = {}): Promise<VideoResult[]> {
    const cacheKey = `videos_${query}_${JSON.stringify(options)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached as VideoResult[]

    if (!this.isYouTubeConfigured()) {
      const mock = this.getMockVideos(query, options)
      this.setCache(cacheKey, mock)
      return mock
    }

    try {
      const searchParams = new URLSearchParams({
        part: 'snippet',
        q: this.enhanceQuery(query),
        type: 'video',
        maxResults: (options.maxResults || 10).toString(),
        order: 'relevance',
        safeSearch: 'strict',
        videoEmbeddable: 'true',
        relevanceLanguage: options.language || 'en',
        key: this.youtubeApiKey!,
      })

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${searchParams}`,
        { headers: { Accept: 'application/json' } }
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      const videos = this.processYouTubeResults(data)
      this.setCache(cacheKey, videos)
      return videos
    } catch (error) {
      console.error('YouTube search error:', error)
      const mock = this.getMockVideos(query, options)
      this.setCache(cacheKey, mock)
      return mock
    }
  }

  /**
   * Get curated financial articles
   */
  public async searchArticles(query: string, options: SearchOptions = {}): Promise<ArticleResult[]> {
    const cacheKey = `articles_${query}_${JSON.stringify(options)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached as ArticleResult[]

    const maxResults = options.maxResults || 5
    const articles = DEFAULT_ARTICLES.map(article => ({
      ...article,
      title: query ? `${article.title} - ${query}` : article.title,
    })).slice(0, maxResults)

    this.setCache(cacheKey, articles)
    return articles
  }

  /**
   * Get comprehensive learning content for a topic
   */
  public async getLearningContent(topic: string, options: SearchOptions = {}): Promise<LearningContent> {
    const [videos, articles] = await Promise.all([
      this.searchVideos(topic, options),
      this.searchArticles(topic, options),
    ])

    return {
      videos,
      articles,
      summary: this.generateTopicSummary(topic, videos, articles),
      relatedTopics: this.generateRelatedTopics(topic),
    }
  }

  private processYouTubeResults(data: any): VideoResult[] {
    if (!data.items) return []

    return data.items
      .filter((item: any) => item.id && item.id.videoId)
      .map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        channel: item.snippet.channelTitle || 'Unknown',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
      }))
  }

  private enhanceQuery(query: string): string {
    const keyword = FINANCIAL_KEYWORDS[Math.floor(Math.random() * FINANCIAL_KEYWORDS.length)]
    return `${query} ${keyword} tutorial explanation hindi english`
  }

  private generateTopicSummary(topic: string, videos: VideoResult[], articles: ArticleResult[]): string {
    const totalContent = videos.length + articles.length

    if (totalContent === 0) {
      return `No content found for "${topic}". Try searching with different keywords.`
    }

    return `Found ${totalContent} resources about "${topic}". This includes ${videos.length} educational videos and ${articles.length} articles. These resources cover various aspects of ${topic.toLowerCase()} to help you learn effectively.`
  }

  private generateRelatedTopics(topic: string): string[] {
    const topicMap: Record<string, string[]> = {
      investment: ['mutual funds', 'SIP', 'stock market', 'portfolio management', 'risk assessment'],
      stock: ['NIFTY 50', 'SENSEX', 'trading basics', 'IPO', 'fundamental analysis'],
      budget: ['expense tracking', 'savings plan', 'financial goals', 'debt management', 'emergency fund'],
      insurance: ['life insurance', 'health insurance', 'term insurance', 'insurance planning', 'claim process'],
      tax: ['tax saving', 'Section 80C', 'tax planning', 'ITR filing', 'tax deductions'],
      loan: ['home loan', 'personal loan', 'EMI calculation', 'credit score', 'loan eligibility'],
      retirement: ['retirement planning', 'pension funds', 'PF', 'retirement corpus', 'post-retirement income'],
      sip: ['SIP vs lump sum', 'mutual fund SIP', 'ELSS', 'index funds', 'active vs passive'],
    }

    const lowerTopic = topic.toLowerCase()
    for (const [key, related] of Object.entries(topicMap)) {
      if (lowerTopic.includes(key)) {
        return related
      }
    }

    return ['financial planning', 'investment basics', 'budgeting', 'savings', 'insurance']
  }

  private getMockVideos(query: string, options: SearchOptions): VideoResult[] {
    const realVideos = [
      { id: 'v684N5MLajA', channel: 'Upasana Kou | Personal Finance TV' },
      { id: 'YSux7rtMo9k', channel: 'INDmoney' },
      { id: '0dN_SjDlAZY', channel: 'Mahendra Dogney' },
      { id: 'yIiSrszJUy0', channel: 'Macro Café' },
      { id: '6sq2o1atWLY', channel: 'Zerodha Varsity' },
      { id: 'BKTN4C0m6MY', channel: 'Ranveer Allahbadia' },
      { id: '8A3s9WP_7l4', channel: 'Dhruv Rathee' },
      { id: '1abxL2U0y0U', channel: 'Investing With Upsurge' },
      { id: '3UF0ymVdYLA', channel: 'Pranjal Kamra' },
      { id: 'gv20filGA7o', channel: 'Neeraj Joshi' },
      { id: 'T7JHfLGm_GY', channel: 'warikoo' },
      { id: 'FAGJ0ST-kXs', channel: 'XY- Axis Education' },
      { id: 'TmC_mgrDWRI', channel: 'Policybazaar' },
      { id: 'pado678nYbg', channel: 'Vaani Wealth' },
    ]

    const titles = [
      `Complete Guide to ${query} for Beginners`,
      `${query} Explained in Simple Terms`,
      `Advanced ${query} Strategies`,
      `${query} Case Studies and Examples`,
      `Common ${query} Mistakes to Avoid`,
    ]

    const descriptions = [
      `Learn everything about ${query} in this comprehensive tutorial designed for beginners.`,
      `Simple explanation of ${query} concepts with practical examples.`,
      `Advanced strategies and tips for ${query} from industry experts.`,
      `Real-world case studies and examples of ${query} in action.`,
      `Learn about common mistakes people make with ${query} and how to avoid them.`,
    ]

    const maxResults = options.maxResults || 10
    return realVideos.slice(0, maxResults).map((video, index) => ({
      ...video,
      title: titles[index % titles.length],
      thumbnail: `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      description: descriptions[index % descriptions.length],
      publishedAt: new Date().toISOString(),
    }))
  }

  private getFromCache(key: string): unknown | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) {
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() })

    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
  }
}

export const learningService = new LearningService()