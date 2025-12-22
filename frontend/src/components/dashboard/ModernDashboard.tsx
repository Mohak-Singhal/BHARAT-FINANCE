import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  Zap,
  Globe,
  RefreshCw,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  Award,
  Sparkles,
  Brain
} from 'lucide-react'
import { dataService, MarketData, formatCurrency, formatPercentage, getChangeColor } from '@/services/dataService'

interface DashboardMetric {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  color: string
}

const ModernDashboard: React.FC = () => {
  const { t } = useTranslation()
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [commodityData, setCommodityData] = useState<MarketData[]>([])
  const [currencyRates, setCurrencyRates] = useState<any[]>([])
  const [economicIndicators, setEconomicIndicators] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    loadDashboardData()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [market, commodities, currency, indicators] = await Promise.all([
        dataService.getIndianMarketData(),
        dataService.getCommodityPrices(),
        dataService.getCurrencyRates(),
        dataService.getEconomicIndicators()
      ])

      setMarketData(market)
      setCommodityData(commodities)
      setCurrencyRates(currency)
      setEconomicIndicators(indicators)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const portfolioMetrics: DashboardMetric[] = [
    {
      title: 'Portfolio Value',
      value: '₹12,45,000',
      change: '+8.5%',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-success-600'
    },
    {
      title: 'Monthly SIP',
      value: '₹25,000',
      change: '+12%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-primary-600'
    },
    {
      title: 'Returns (1Y)',
      value: '14.2%',
      change: '+2.1%',
      trend: 'up',
      icon: <PieChart className="w-6 h-6" />,
      color: 'text-secondary-600'
    },
    {
      title: 'Goal Progress',
      value: '68%',
      change: '+5%',
      trend: 'up',
      icon: <Target className="w-6 h-6" />,
      color: 'text-warning-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Floating Elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-primary-200 rounded-full opacity-20"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-4 shadow-lg">
              <Brain className="w-6 h-6 text-primary-600" />
              <span className="font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Financial Command Center
              </span>
              <Sparkles className="w-5 h-5 text-secondary-500" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
                Your Dashboard
              </span>
            </h1>
            
            <p className="text-xl text-gray-600">
              Real-time insights powered by live market data
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {lastUpdated.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
            
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 text-primary-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {portfolioMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-opacity-10 ${metric.color.replace('text-', 'bg-')}`}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${getChangeColor(parseFloat(metric.change))}`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : null}
                  <span className="text-sm font-semibold">{metric.change}</span>
                </div>
              </div>
              
              <h3 className="text-gray-600 text-sm font-medium mb-2">{metric.title}</h3>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Market Data */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-6 h-6 text-primary-600 mr-3" />
                  Live Market Data
                </h2>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live</span>
                </div>
              </div>

              <div className="space-y-4">
                {marketData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.symbol}</h3>
                      <div className="text-2xl font-bold text-gray-800">
                        {formatCurrency(item.price, '')}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getChangeColor(item.change)}`}>
                        {formatPercentage(item.changePercent)}
                      </div>
                      <div className={`text-sm ${getChangeColor(item.change)}`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Currency Rates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 text-primary-600 mr-2" />
                Currency Rates
              </h3>
              
              {currencyRates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{rate.from}/{rate.to}</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{rate.rate.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Economic Indicators */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 text-primary-600 mr-2" />
                Economic Indicators
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">GDP Growth</span>
                  <span className="font-bold text-green-600">{economicIndicators.gdpGrowth}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Inflation Rate</span>
                  <span className="font-bold text-orange-600">{economicIndicators.inflationRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Repo Rate</span>
                  <span className="font-bold text-blue-600">{economicIndicators.repoRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Unemployment</span>
                  <span className="font-bold text-purple-600">{economicIndicators.unemploymentRate}%</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 shadow-xl border border-primary-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-primary-600 mr-2" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white/80 hover:bg-white rounded-xl transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 group-hover:text-primary-700">
                      Start New SIP
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                  </div>
                </button>
                
                <button className="w-full text-left p-3 bg-white/80 hover:bg-white rounded-xl transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 group-hover:text-primary-700">
                      Analyze Budget
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                  </div>
                </button>
                
                <button className="w-full text-left p-3 bg-white/80 hover:bg-white rounded-xl transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 group-hover:text-primary-700">
                      Tax Calculator
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Commodities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <PieChart className="w-6 h-6 text-primary-600 mr-3" />
            Commodity Prices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commodityData.map((commodity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{commodity.symbol}</h3>
                <div className="text-xl font-bold text-gray-800 mb-1">
                  {formatCurrency(commodity.price, '')}
                </div>
                <div className={`text-sm font-medium ${getChangeColor(commodity.change)}`}>
                  {formatPercentage(commodity.changePercent)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernDashboard