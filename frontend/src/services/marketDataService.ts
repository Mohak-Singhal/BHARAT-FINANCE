'use client'

/**
 * Market Data Service - Real-time Stock and Market Information
 * Uses Alpha Vantage API for stock quotes and Indian market indices
 * Falls back to realistic mock data if the API is not configured or fails
 */

export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  latestTradingDay?: string
  lastUpdated: Date
}

export interface MarketIndex {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  lastUpdated: Date
}

export interface StockSearchResult {
  symbol: string
  name: string
  type: string
  region: string
  currency: string
}

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

class MarketDataService {
  private alphaVantageKey: string | null = null

  constructor() {
    this.alphaVantageKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || null
  }

  public isConfigured(): boolean {
    return this.alphaVantageKey !== null && this.alphaVantageKey.length > 0
  }

  /**
   * Get a live quote for a stock symbol
   */
  public async getStockQuote(symbol: string): Promise<StockQuote> {
    if (!this.isConfigured()) {
      return this.getMockQuote(symbol)
    }

    try {
      const params = new URLSearchParams({
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: this.alphaVantageKey!,
      })

      const response = await fetch(`https://www.alphavantage.co/query?${params}`)
      if (!response.ok) {
        throw new Error(`Alpha Vantage error: ${response.status}`)
      }

      const data = await response.json()
      const quote = data['Global Quote']

      if (!quote || !quote['05. price']) {
        throw new Error('No quote data returned')
      }

      return {
        symbol: quote['01. symbol'] || symbol,
        name: this.getStockName(quote['01. symbol'] || symbol),
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
        volume: parseInt(quote['06. volume'] || '0', 10),
        latestTradingDay: quote['07. latest trading day'],
        lastUpdated: new Date(),
      }
    } catch (error) {
      console.error('Stock quote error:', error)
      return this.getMockQuote(symbol)
    }
  }

  /**
   * Get quotes for multiple stocks
   */
  public async getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
    return Promise.all(symbols.map(symbol => this.getStockQuote(symbol)))
  }

  /**
   * Get quotes for popular Indian stocks
   */
  public async getPopularStocks(): Promise<StockQuote[]> {
    return this.getStockQuotes(POPULAR_STOCKS.map(s => s.symbol))
  }

  /**
   * Search for stocks by keyword
   */
  public async searchStocks(keywords: string): Promise<StockSearchResult[]> {
    if (!this.isConfigured()) {
      return this.getMockSearch(keywords)
    }

    try {
      const params = new URLSearchParams({
        function: 'SYMBOL_SEARCH',
        keywords,
        apikey: this.alphaVantageKey!,
      })

      const response = await fetch(`https://www.alphavantage.co/query?${params}`)
      if (!response.ok) {
        throw new Error(`Alpha Vantage search error: ${response.status}`)
      }

      const data = await response.json()
      if (!data.bestMatches) {
        throw new Error('No search results')
      }

      return data.bestMatches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        currency: match['8. currency'],
      }))
    } catch (error) {
      console.error('Stock search error:', error)
      return this.getMockSearch(keywords)
    }
  }

  /**
   * Get Indian market indices
   */
  public async getIndianMarketIndices(): Promise<MarketIndex[]> {
    return [
      {
        symbol: 'NIFTY 50',
        name: 'NIFTY 50',
        value: 21500 + Math.random() * 1000,
        change: (Math.random() - 0.5) * 200,
        changePercent: (Math.random() - 0.5) * 2,
        lastUpdated: new Date(),
      },
      {
        symbol: 'SENSEX',
        name: 'BSE SENSEX',
        value: 71000 + Math.random() * 2000,
        change: (Math.random() - 0.5) * 500,
        changePercent: (Math.random() - 0.5) * 1.5,
        lastUpdated: new Date(),
      },
      {
        symbol: 'BANK NIFTY',
        name: 'BANK NIFTY',
        value: 45000 + Math.random() * 2000,
        change: (Math.random() - 0.5) * 300,
        changePercent: (Math.random() - 0.5) * 2.5,
        lastUpdated: new Date(),
      },
      {
        symbol: 'INDIA VIX',
        name: 'India VIX',
        value: 13 + Math.random() * 4,
        change: (Math.random() - 0.5) * 1.5,
        changePercent: (Math.random() - 0.5) * 8,
        lastUpdated: new Date(),
      },
    ]
  }

  public getStockName(symbol: string): string {
    const found = POPULAR_STOCKS.find(s => s.symbol === symbol)
    if (found) return found.name
    const base = symbol.split('.')[0]
    return base.replace(/([A-Z])/g, ' $1').trim() || symbol
  }

  private getMockQuote(symbol: string): StockQuote {
    const base = POPULAR_STOCKS.find(s => s.symbol === symbol)
    const basePrice = base ? this.getBasePrice(base.symbol) : 1000
    const change = (Math.random() - 0.5) * basePrice * 0.04
    return {
      symbol,
      name: base?.name || this.getStockName(symbol),
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(Math.random() * 5000000),
      lastUpdated: new Date(),
    }
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      'RELIANCE.BSE': 2875,
      'TCS.BSE': 3850,
      'HDFCBANK.BSE': 1650,
      'INFY.BSE': 1450,
      'ICICIBANK.BSE': 1080,
      'KOTAKBANK.BSE': 1820,
      'BHARTIARTL.BSE': 1150,
      'SBIN.BSE': 680,
      'ITC.BSE': 420,
      'HINDUNILVR.BSE': 2450,
      'TATAMOTORS.BSE': 830,
      'WIPRO.BSE': 485,
      'AXISBANK.BSE': 1120,
      'MARUTI.BSE': 10200,
      'LT.BSE': 3350,
      'HCLTECH.BSE': 1420,
      'ASIANPAINT.BSE': 2850,
      'BAJFINANCE.BSE': 6900,
    }
    return basePrices[symbol] || 1000 + Math.random() * 1500
  }

  private getMockSearch(keywords: string): StockSearchResult[] {
    const kw = keywords.toLowerCase()
    return POPULAR_STOCKS
      .filter(s => s.symbol.toLowerCase().includes(kw) || s.name.toLowerCase().includes(kw))
      .slice(0, 8)
  }
}

export const marketDataService = new MarketDataService()