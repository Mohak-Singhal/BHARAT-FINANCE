import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  DollarSign, 
  BarChart3, Target, Globe, RefreshCw
} from 'lucide-react'
import { 
  dataService, 
  MarketData, 
  formatCurrency, 
  formatPercentage, 
  getChangeColor 
} from '@/services/dataService'

const ModernDashboard: React.FC = () => {
  const { t } = useTranslation()
  
  // --- State ---
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [commodityData, setCommodityData] = useState<MarketData[]>([])
  const [currencyRates, setCurrencyRates] = useState<any[]>([])
  // Default values for indicators to prevent crashes if API fails
  const [economicIndicators, setEconomicIndicators] = useState<any>({
    gdpGrowth: 0, inflationRate: 0, repoRate: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // --- Effects ---
  useEffect(() => {
    loadDashboardData()
  }, [])

  // --- Data Loading ---
  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // fetching data from your new Backend Service
      const data = await dataService.getDashboardData()
      
      if (data) {
        // We use '|| []' (OR empty array) to prevent crashes if backend sends null
        setMarketData(data.market || []) 
        setCommodityData(data.commodities || []) 
        setCurrencyRates(data.currency || [])
        
        if (data.indicators) {
           setEconomicIndicators(data.indicators)
        }
        
        // If backend sends a timestamp, use it. Otherwise use now.
        if (data.lastUpdated) {
            setLastUpdated(new Date(data.lastUpdated))
        } else {
            setLastUpdated(new Date())
        }
      }
    } catch (error) {
      console.error('Dashboard Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
               {t('dashboard.title', 'Financial Dashboard')}
            </h1>
            <p className="text-gray-600">
              {t('dashboard.subtitle', 'Your complete financial overview')}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
              <div className="text-sm text-gray-500">{t('common.lastSync', 'Last Server Sync')}</div>
              <div className="font-medium">
                {lastUpdated.toLocaleDateString('en-IN', { 
                   day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-3 bg-white rounded-full shadow hover:shadow-lg transition-all"
              title={t('common.refresh', 'Refresh Data')}
            >
              <RefreshCw className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* --- LIVE MARKET SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Indian Indices & Stocks */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600"/> 
                {t('dashboard.markets', 'Indian Markets')}
              </h2>
              
              {loading && marketData.length === 0 ? (
                 <div className="p-8 text-center text-gray-500 animate-pulse">Connecting to server...</div>
              ) : (
                <div className="space-y-4">
                  {marketData.length > 0 ? marketData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.symbol}</h3>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(item.price)}</div>
                        <div className={`text-sm font-medium ${getChangeColor(item.change)}`}>
                           {formatPercentage(item.changePercent)}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-4 text-gray-500 text-center">No market data available</div>
                  )}
                </div>
              )}
             </div>
             
             {/* Commodities Row */}
             {commodityData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {commodityData.map((item, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-lg border border-white/20">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        {item.symbol}
                        </h3>
                        <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(item.price)}
                        </span>
                        <span className={`text-sm font-medium ${getChangeColor(item.changePercent)}`}>
                            {formatPercentage(item.changePercent)}
                        </span>
                        </div>
                    </div>
                    ))}
                </div>
             )}
          </div>

          {/* Sidebar: Currency & Economy */}
          <div className="space-y-6">
            
            {/* Currency */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600"/>
                Forex Rates (INR)
              </h3>
              <div className="space-y-3">
                {currencyRates.map((rate, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-600">1 {rate.from}</span>
                    <span className="font-bold text-gray-900">₹{rate.rate.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Economic Stats */}
            <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-xl">
               <h3 className="font-bold mb-4 flex items-center">
                 <Target className="w-5 h-5 mr-2 text-blue-300"/>
                 India Economy
               </h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-blue-800 rounded-lg">
                   <div className="text-xs text-blue-200">GDP Growth</div>
                   <div className="text-xl font-bold">{economicIndicators.gdpGrowth}%</div>
                 </div>
                 <div className="p-3 bg-blue-800 rounded-lg">
                   <div className="text-xs text-blue-200">Inflation</div>
                   <div className="text-xl font-bold">{economicIndicators.inflationRate}%</div>
                 </div>
                 <div className="p-3 bg-blue-800 rounded-lg">
                   <div className="text-xs text-blue-200">Repo Rate</div>
                   <div className="text-xl font-bold">{economicIndicators.repoRate}%</div>
                 </div>
               </div>
            </div>

            {/* Simple Portfolio Summary (Hardcoded for Demo) */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-xl border border-green-100">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                 <DollarSign className="w-5 h-5 mr-2 text-green-600"/>
                 My Summary
               </h3>
               <div className="space-y-3">
                  <div className="flex justify-between">
                     <span className="text-gray-600">Portfolio</span>
                     <span className="font-bold">₹12,45,000</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-600">Returns</span>
                     <span className="font-bold text-green-600">+14.2%</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernDashboard