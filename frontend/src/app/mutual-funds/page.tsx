'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, TrendingUp, Shield, DollarSign, BarChart3, Star } from 'lucide-react'

export default function MutualFundsPage() {
  const fundCategories = [
    {
      name: 'Equity Funds',
      description: 'High growth potential with market risks',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      returns: '12-15%',
      risk: 'High'
    },
    {
      name: 'Debt Funds',
      description: 'Stable returns with lower risk',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      returns: '6-8%',
      risk: 'Low'
    },
    {
      name: 'Hybrid Funds',
      description: 'Balanced mix of equity and debt',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      returns: '8-12%',
      risk: 'Medium'
    }
  ]

  const topFunds = [
    {
      name: 'SBI Bluechip Fund',
      category: 'Large Cap',
      returns1y: '15.2%',
      returns3y: '12.8%',
      rating: 4,
      nav: '₹58.42'
    },
    {
      name: 'HDFC Top 100 Fund',
      category: 'Large Cap',
      returns1y: '14.8%',
      returns3y: '13.1%',
      rating: 5,
      nav: '₹742.15'
    },
    {
      name: 'Axis Midcap Fund',
      category: 'Mid Cap',
      returns1y: '18.5%',
      returns3y: '15.2%',
      rating: 4,
      nav: '₹89.32'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <PieChart className="w-6 h-6 text-primary-600" />
            <span className="font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Mutual Fund Recommendations
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
              Smart Mutual Fund Investing
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the best mutual funds with AI-powered analysis and real-time performance metrics
          </p>
        </motion.div>

        {/* Fund Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {fundCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${category.bgColor} rounded-2xl p-6 shadow-lg border border-white/20`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <category.icon className={`w-8 h-8 ${category.color}`} />
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Expected Returns</p>
                  <p className={`font-bold ${category.color}`}>{category.returns}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Risk Level</p>
                  <p className="font-bold text-gray-700">{category.risk}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Performing Funds */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            Top Performing Funds
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fund Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">1Y Returns</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">3Y Returns</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">NAV</th>
                </tr>
              </thead>
              <tbody>
                {topFunds.map((fund, index) => (
                  <tr key={fund.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{fund.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {fund.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-green-600 font-semibold">{fund.returns1y}</td>
                    <td className="py-4 px-4 text-green-600 font-semibold">{fund.returns3y}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < fund.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">{fund.nav}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* SIP Calculator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <DollarSign className="w-6 h-6 text-green-500 mr-2" />
            SIP Calculator
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Investment Amount
                </label>
                <input
                  type="number"
                  placeholder="₹5,000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  placeholder="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  placeholder="12"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              
              <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-700 transition-all">
                Calculate Returns
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Investment:</span>
                  <span className="font-semibold">₹6,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Returns:</span>
                  <span className="font-semibold text-green-600">₹5,27,678</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-semibold">Maturity Amount:</span>
                  <span className="font-bold text-primary-600 text-lg">₹11,27,678</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}