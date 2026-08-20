'use client'

/**
 * Market Data Service - Real-time Stock and Market Information
 * Fetches from the serverless /api/market proxies (Alpha Vantage server-side + realistic fallback)
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
  /**
   * Get a live quote for a stock symbol
   */
  public async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const quotes = await this.getStockQuotes([symbol])
      return quotes[0]
    } catch (error) {
      console.error('Stock quote error:', error)
      return this.getMockQuote(symbol)
    }
  }

  /**
   * Get quotes for multiple stocks
   */
  public async getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const params = new URLSearchParams({ symbols: symbols.join(',') })
      const response = await fetch(`/api/market/quotes?${params}`)
      if (!response.ok) {
        throw new Error(`Market proxy error: ${response.status}`)
      }
      const data = await response.json()
      return (data.quotes || []).map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        latestTradingDay: quote.latestTradingDay,
        lastUpdated: new Date(quote.lastUpdated),
      }))
    } catch (error) {
      console.error('Stock quotes error:', error)
      return symbols.map(symbol => this.getMockQuote(symbol))
    }
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
    try {
      const params = new URLSearchParams({ q: keywords })
      const response = await fetch(`/api/market/search?${params}`)
      if (!response.ok) {
        throw new Error(`Market search proxy error: ${response.status}`)
      }
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Stock search error:', error)
      return this.getMockSearch(keywords)
    }
  }

  /**
   * Get Indian market indices
   */
  public async getIndianMarketIndices(): Promise<MarketIndex[]> {
    try {
      const response = await fetch('/api/market/indices')
      if (!response.ok) {
        throw new Error(`Indices proxy error: ${response.status}`)
      }
      const data = await response.json()
      return (data.indices || []).map((index: any) => ({
        symbol: index.symbol,
        name: index.name,
        value: index.value,
        change: index.change,
        changePercent: index.changePercent,
        lastUpdated: new Date(index.lastUpdated),
      }))
    } catch (error) {
      console.error('Indices error:', error)
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
      ]
    }
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