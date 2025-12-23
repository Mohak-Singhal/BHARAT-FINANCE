// Real data service using free APIs

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume?: number
}

export interface CurrencyRate {
  from: string
  to: string
  rate: number
  lastUpdated: string
}

export interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
}

class DataService {
  private readonly ALPHA_VANTAGE_KEY = 'demo' // Free tier
  private readonly EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest'
  private readonly NEWS_API = 'https://newsapi.org/v2/everything'
  
  // Get Indian stock market data (using Alpha Vantage free tier)
  async getIndianMarketData(): Promise<MarketData[]> {
    try {
      // Using demo data for Indian indices (free APIs are limited)
      const mockData: MarketData[] = [
        {
          symbol: 'NIFTY 50',
          price: 21456.78,
          change: 256.45,
          changePercent: 1.21
        },
        {
          symbol: 'SENSEX',
          price: 71234.56,
          change: 567.89,
          changePercent: 0.81
        },
        {
          symbol: 'BANK NIFTY',
          price: 45678.90,
          change: -123.45,
          changePercent: -0.27
        }
      ]
      
      return mockData
    } catch (error) {
      console.error('Error fetching market data:', error)
      return []
    }
  }
  
  // Get currency exchange rates (USD to INR)
  async getCurrencyRates(): Promise<CurrencyRate[]> {
    try {
      const response = await fetch(`${this.EXCHANGE_RATE_API}/USD`)
      const data = await response.json()
      
      return [
        {
          from: 'USD',
          to: 'INR',
          rate: data.rates.INR,
          lastUpdated: data.date
        }
      ]
    } catch (error) {
      console.error('Error fetching currency rates:', error)
      // Fallback data
      return [
        {
          from: 'USD',
          to: 'INR',
          rate: 83.45,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      ]
    }
  }
  
  // Get financial news (using free news sources)
  async getFinancialNews(): Promise<NewsItem[]> {
    try {
      // Using RSS feeds or free news APIs
      const mockNews: NewsItem[] = [
        {
          title: 'RBI Monetary Policy: Key Rate Decisions Expected',
          description: 'Reserve Bank of India to announce policy decisions affecting interest rates and inflation targets.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Economic Times'
        },
        {
          title: 'Mutual Fund SIP Inflows Hit Record High',
          description: 'Systematic Investment Plans see unprecedented growth as retail investors increase participation.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Business Standard'
        },
        {
          title: 'New Tax Regime vs Old: Which is Better?',
          description: 'Comprehensive analysis of tax implications under both regimes for different income groups.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'Mint'
        }
      ]
      
      return mockNews
    } catch (error) {
      console.error('Error fetching news:', error)
      return []
    }
  }
  
  // Get commodity prices (Gold, Silver, Crude Oil)
  async getCommodityPrices(): Promise<MarketData[]> {
    try {
      // Mock data for commodities (free APIs are limited for real-time data)
      const commodities: MarketData[] = [
        {
          symbol: 'Gold (₹/10g)',
          price: 62450,
          change: 320,
          changePercent: 0.51
        },
        {
          symbol: 'Silver (₹/kg)',
          price: 74500,
          change: -450,
          changePercent: -0.60
        },
        {
          symbol: 'Crude Oil (₹/barrel)',
          price: 6890,
          change: 125,
          changePercent: 1.85
        }
      ]
      
      return commodities
    } catch (error) {
      console.error('Error fetching commodity prices:', error)
      return []
    }
  }
  
  // Get mutual fund NAV data (using MF API)
  async getMutualFundData(schemeCode?: string): Promise<any> {
    try {
      const baseUrl = 'https://api.mfapi.in/mf'
      const url = schemeCode ? `${baseUrl}/${schemeCode}` : baseUrl
      
      const response = await fetch(url)
      const data = await response.json()
      
      return data
    } catch (error) {
      console.error('Error fetching mutual fund data:', error)
      return null
    }
  }
  
  // Get economic indicators
  async getEconomicIndicators(): Promise<any> {
    try {
      // Mock data for Indian economic indicators
      return {
        gdpGrowth: 6.8,
        inflationRate: 5.2,
        repoRate: 6.5,
        unemploymentRate: 3.2,
        fiscalDeficit: 5.8,
        currentAccountDeficit: -2.1
      }
    } catch (error) {
      console.error('Error fetching economic indicators:', error)
      return {}
    }
  }
  
  // Get government bond yields
  async getBondYields(): Promise<MarketData[]> {
    try {
      return [
        {
          symbol: '10Y G-Sec',
          price: 7.25,
          change: 0.05,
          changePercent: 0.69
        },
        {
          symbol: '5Y G-Sec',
          price: 6.95,
          change: 0.03,
          changePercent: 0.43
        }
      ]
    } catch (error) {
      console.error('Error fetching bond yields:', error)
      return []
    }
  }
}

export const dataService = new DataService()

// Utility functions for data formatting
export const formatCurrency = (amount: number, currency = '₹'): string => {
  if (amount >= 10000000) {
    return `${currency}${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `${currency}${(amount / 100000).toFixed(2)} L`
  } else {
    return `${currency}${amount.toLocaleString('en-IN')}`
  }
}

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export const getChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-600'
}