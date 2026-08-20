'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Search,
  Star,
  StarOff,
  RefreshCw,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'
import { marketDataService, StockQuote, MarketIndex, StockSearchResult } from '@/services/marketDataService'

const WATCHLIST_KEY = 'bharat_finance_stock_watchlist'

export default function StocksPage() {
  const { t } = useTranslation()
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [popularStocks, setPopularStocks] = useState<StockQuote[]>([])
  const [watchlist, setWatchlist] = useState<StockQuote[]>([])
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searching, setSearching] = useState(false)

  const loadWatchlist = useCallback(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY)
      if (stored) {
        setWatchlistSymbols(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
    }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [indexData, stockData] = await Promise.all([
        marketDataService.getIndianMarketIndices(),
        marketDataService.getPopularStocks(),
      ])
      setIndices(indexData)
      setPopularStocks(stockData)
    } catch (error) {
      console.error('Error fetching market data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWatchlist()
    fetchData()
  }, [fetchData, loadWatchlist])

  useEffect(() => {
    if (watchlistSymbols.length === 0) {
      setWatchlist([])
      return
    }
    let cancelled = false
    marketDataService.getStockQuotes(watchlistSymbols).then(quotes => {
      if (!cancelled) setWatchlist(quotes)
    })
    return () => {
      cancelled = true
    }
  }, [watchlistSymbols])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    if (watchlistSymbols.length > 0) {
      const quotes = await marketDataService.getStockQuotes(watchlistSymbols)
      setWatchlist(quotes)
    }
    setRefreshing(false)
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim().length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const results = await marketDataService.searchStocks(term.trim())
      setSearchResults(results)
    } finally {
      setSearching(false)
    }
  }

  const toggleWatchlist = async (symbol: string) => {
    let updated: string[]
    if (watchlistSymbols.includes(symbol)) {
      updated = watchlistSymbols.filter(s => s !== symbol)
    } else {
      updated = [...watchlistSymbols, symbol]
    }
    setWatchlistSymbols(updated)
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated))
  }

  const addFromSearch = async (result: StockSearchResult) => {
    await toggleWatchlist(result.symbol)
    setSearchTerm('')
    setSearchResults([])
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(price)

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) return `${(volume / 10000000).toFixed(1)}Cr`
    if (volume >= 100000) return `${(volume / 100000).toFixed(1)}L`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return volume.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full px-6 py-3 mb-6">
            <LineChart className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Live Market Data</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Stock <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Tracker</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track real-time stock prices, market indices, and build your personal watchlist
            powered by Alpha Vantage data.
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>{t('common.refresh')}</span>
          </button>
        </div>

        {/* Market Indices */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            {t('stocks.marketIndices')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 skeleton h-28" />
                ))
              : indices.map((index, i) => (
                  <motion.div
                    key={index.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-600">{index.name}</span>
                      {index.changePercent >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-success-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-error-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1 currency">
                      {formatPrice(index.value)}
                    </div>
                    <div className={`flex items-center text-sm font-semibold ${index.change >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                      {index.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span>{index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)</span>
                    </div>
                  </motion.div>
                ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Stocks */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              {t('stocks.popularStocks')}
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary-50 to-secondary-50 text-gray-600">
                      <th className="text-left px-5 py-3 font-semibold">{t('stocks.name')}</th>
                      <th className="text-right px-5 py-3 font-semibold">{t('stocks.price')}</th>
                      <th className="text-right px-5 py-3 font-semibold">{t('stocks.change')}</th>
                      <th className="text-right px-5 py-3 font-semibold hidden md:table-cell">{t('stocks.volume')}</th>
                      <th className="text-center px-5 py-3 font-semibold">Watch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <tr key={i}>
                            <td colSpan={5} className="px-5 py-4"><div className="skeleton h-8 rounded-lg" /></td>
                          </tr>
                        ))
                      : popularStocks.map((stock, i) => (
                          <motion.tr
                            key={stock.symbol}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="border-t border-gray-100 hover:bg-orange-50/40 transition-colors duration-200"
                          >
                            <td className="px-5 py-3.5">
                              <div className="font-semibold text-gray-900">{stock.name}</div>
                              <div className="text-xs text-gray-500 font-mono">{stock.symbol}</div>
                            </td>
                            <td className="px-5 py-3.5 text-right font-semibold text-gray-900 currency">
                              {formatPrice(stock.price)}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${stock.change >= 0 ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
                                {stock.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right text-gray-500 hidden md:table-cell">
                              {formatVolume(stock.volume)}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => toggleWatchlist(stock.symbol)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                aria-label={`Toggle ${stock.name} in watchlist`}
                              >
                                {watchlistSymbols.includes(stock.symbol) ? (
                                  <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
                                ) : (
                                  <StarOff className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Watchlist */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
              My Watchlist
            </h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                placeholder={t('stocks.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200"
              />
              {searching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 animate-spin" />}
            </div>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-4 overflow-hidden"
                >
                  {searchResults.map(result => (
                    <button
                      key={result.symbol}
                      onClick={() => addFromSearch(result)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-orange-50/40 transition-colors duration-200 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{result.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{result.symbol}</div>
                      </div>
                      <span className="text-xs text-primary-600 font-semibold">Add +</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {watchlist.length === 0 ? (
                <div className="p-8 text-center">
                  <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Your watchlist is empty. Search and add stocks to track them here.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {watchlist.map(stock => (
                    <li key={stock.symbol} className="px-4 py-3.5 hover:bg-orange-50/40 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{stock.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{stock.symbol}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-gray-900 currency">{formatPrice(stock.price)}</div>
                            <div className={`text-xs font-semibold ${stock.change >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </div>
                          </div>
                          <button
                            onClick={() => toggleWatchlist(stock.symbol)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            aria-label={`Remove ${stock.name} from watchlist`}
                          >
                            <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-700">Disclaimer:</strong> Stock prices are for educational purposes only
            and may be delayed or simulated. Market data is provided by third-party APIs and may not reflect
            real-time trading values. This platform does not provide investment advice. Consult a SEBI-registered
            advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  )
}