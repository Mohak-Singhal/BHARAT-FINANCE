'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, RefreshCw, BookOpen, TrendingUp, Shield, Calculator, Banknote } from 'lucide-react'

interface FinancialTip {
  category: string
  tip: string
  explanation: string
}

interface TipsResponse {
  daily_tips: FinancialTip[]
}

const tipCategories = [
  { id: 'all', label: 'All Tips', icon: Lightbulb },
  { id: 'budgeting', label: 'Budgeting', icon: Calculator },
  { id: 'investment', label: 'Investment', icon: TrendingUp },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'tax-saving', label: 'Tax Saving', icon: Banknote },
  { id: 'emergency-fund', label: 'Emergency Fund', icon: BookOpen },
]

export default function DailyTips() {
  const [tips, setTips] = useState<FinancialTip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchTips = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/finance-coach/financial-tips')
      if (response.ok) {
        const data: TipsResponse = await response.json()
        setTips(data.daily_tips)
      } else {
        // Fallback tips if API fails
        setTips([
          {
            category: 'Budgeting',
            tip: 'Use the 50-30-20 rule: 50% needs, 30% wants, 20% savings',
            explanation: 'This helps maintain a balanced approach to spending and saving'
          },
          {
            category: 'Investment',
            tip: 'Start SIP early, even with small amounts',
            explanation: 'Time in market beats timing the market due to compounding'
          },
          {
            category: 'Insurance',
            tip: 'Buy term life insurance when young',
            explanation: 'Premiums are lower when you\'re young and healthy'
          },
          {
            category: 'Tax Saving',
            tip: 'Invest in ELSS funds for tax benefits',
            explanation: 'ELSS offers tax deduction under 80C with potential for higher returns'
          },
          {
            category: 'Emergency Fund',
            tip: 'Keep 6 months of expenses in liquid funds',
            explanation: 'Emergency fund provides financial security during unexpected situations'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching tips:', error)
      // Use fallback tips
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTips()
  }, [])

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category.toLowerCase().includes(selectedCategory.replace('-', ' ')))

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: any } = {
      'budgeting': Calculator,
      'investment': TrendingUp,
      'insurance': Shield,
      'tax saving': Banknote,
      'emergency fund': BookOpen,
    }
    return categoryMap[category.toLowerCase()] || Lightbulb
  }

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'budgeting': 'bg-blue-100 text-blue-600',
      'investment': 'bg-green-100 text-green-600',
      'insurance': 'bg-purple-100 text-purple-600',
      'tax saving': 'bg-orange-100 text-orange-600',
      'emergency fund': 'bg-red-100 text-red-600',
    }
    return colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Lightbulb className="h-6 w-6 text-yellow-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Daily Financial Tips</h2>
          </div>
          <button
            onClick={fetchTips}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Tips</span>
          </button>
        </div>
        
        <p className="text-gray-600">
          Learn something new every day with our curated financial tips and insights 
          tailored for Indian markets and regulations.
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {tipCategories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredTips.map((tip, index) => {
            const Icon = getCategoryIcon(tip.category)
            const colorClass = getCategoryColor(tip.category)
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-lg mr-3 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {tip.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                  {tip.tip}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tip.explanation}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      💡 Pro Tip
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* No Tips Message */}
      {!loading && filteredTips.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tips found for this category
          </h3>
          <p className="text-gray-600 mb-4">
            Try selecting a different category or refresh to get new tips.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="btn-primary"
          >
            Show All Tips
          </button>
        </div>
      )}

      {/* Educational Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Why Financial Education Matters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Build Wealth</h4>
            <p className="text-gray-600 text-sm">
              Smart financial decisions compound over time, helping you build long-term wealth.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Financial Security</h4>
            <p className="text-gray-600 text-sm">
              Proper planning protects you and your family from financial uncertainties.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Make Informed Decisions</h4>
            <p className="text-gray-600 text-sm">
              Knowledge empowers you to make better choices about investments and expenses.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action Today</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200">
            <Calculator className="h-4 w-4" />
            <span className="text-sm font-medium">Calculate SIP</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Start Investing</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Get Insurance</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors duration-200">
            <Banknote className="h-4 w-4" />
            <span className="text-sm font-medium">Save Tax</span>
          </button>
        </div>
      </div>
    </div>
  )
}