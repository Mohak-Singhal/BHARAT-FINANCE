'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { PieChart, TrendingUp, Shield, DollarSign, Star, Loader2 } from 'lucide-react'

interface MutualFund {
  schemeName: string
  schemeCode: string
  category: string
  returns_1y?: string
  returns_3y?: string
  returns_5y?: string
  expense_ratio?: string
  aum?: string
  rating?: number
  fund_house?: string
  risk_level?: string
  min_investment?: string
}

interface FundCategory {
  category: string
  name: string
  description: string
  risk: string
  expected_returns: string
  investment_horizon: string
  tax_benefit?: string
}

const formatINR = (amount: number): string =>
  '₹' + Math.round(amount).toLocaleString('en-IN')

export default function MutualFundsPage() {
  const { t } = useTranslation()

  const [categories, setCategories] = useState<FundCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('equity')
  const [funds, setFunds] = useState<MutualFund[]>([])
  const [fundsLoading, setFundsLoading] = useState(true)
  const [fundsError, setFundsError] = useState(false)

  const [sipAmount, setSipAmount] = useState(5000)
  const [sipYears, setSipYears] = useState(10)
  const [sipReturn, setSipReturn] = useState(12)

  const sipResults = useMemo(() => {
    const months = sipYears * 12
    const monthlyRate = sipReturn / 100 / 12
    const invested = sipAmount * months
    const maturity =
      monthlyRate > 0
        ? sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
        : invested
    return {
      invested,
      returns: maturity - invested,
      maturity,
    }
  }, [sipAmount, sipYears, sipReturn])

  const fetchFunds = useCallback(async (category: string) => {
    setFundsLoading(true)
    setFundsError(false)
    try {
      const response = await fetch(`/api/simulate/mutual-funds/top-performers/${category}`)
      const data = await response.json()
      setFunds(data.top_performers || [])
    } catch (error) {
      console.error('Error fetching funds:', error)
      setFundsError(true)
      setFunds([])
    } finally {
      setFundsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch('/api/simulate/mutual-funds/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  useEffect(() => {
    fetchFunds(selectedCategory)
  }, [selectedCategory, fetchFunds])

  const getRiskColor = (risk?: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-50'
      case 'moderate':
        return 'text-amber-600 bg-amber-50'
      case 'high':
      case 'very high':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

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
              {t('mutualFunds.title')}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
              {t('mutualFunds.subtitle')}
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('mutualFunds.fundCategories')}
          </p>
        </motion.div>

        {/* Fund Categories */}
        {categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category.category)}
                className={`text-left rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
                  selectedCategory === category.category
                    ? 'bg-white ring-2 ring-primary-500 border-transparent'
                    : 'bg-white/80 hover:bg-white border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">{t('mutualFunds.expectedReturnsLabel')}</p>
                    <p className="font-bold text-primary-600">{category.expected_returns}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{t('mutualFunds.riskLevel')}</p>
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${getRiskColor(category.risk)}`}>
                      {category.risk}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Top Performing Funds */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            {t('mutualFunds.topPerformingFunds')}
          </h2>

          {fundsLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              {t('mutualFunds.loading')}
            </div>
          ) : fundsError ? (
            <div className="py-16 text-center">
              <p className="text-gray-500">{t('mutualFunds.error')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('mutualFunds.fundName')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('mutualFunds.category')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('mutualFunds.oneYReturn')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('mutualFunds.threeYReturn')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('mutualFunds.rating')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('mutualFunds.nav')}</th>
                  </tr>
                </thead>
                <tbody>
                  {funds.map((fund, index) => (
                    <tr key={fund.schemeCode || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{fund.schemeName}</div>
                        {fund.fund_house && <div className="text-xs text-gray-500">{fund.fund_house}</div>}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {fund.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-green-600 font-semibold">{fund.returns_1y || '—'}</td>
                      <td className="py-4 px-4 text-green-600 font-semibold">{fund.returns_3y || '—'}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(fund.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900">{fund.aum || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* SIP Calculator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <DollarSign className="w-6 h-6 text-green-500 mr-2" />
            {t('mutualFunds.sipCalculator')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mutualFunds.monthlyAmount')}
                </label>
                <input
                  type="number"
                  min={0}
                  value={sipAmount}
                  onChange={e => setSipAmount(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mutualFunds.investmentPeriod')}
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={sipYears}
                  onChange={e => setSipYears(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mutualFunds.annualReturn')}
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  step={0.5}
                  value={sipReturn}
                  onChange={e => setSipReturn(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('mutualFunds.summary')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('mutualFunds.totalInvestment')}:</span>
                  <span className="font-semibold">{formatINR(sipResults.invested)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('mutualFunds.expectedReturns')}:</span>
                  <span className="font-semibold text-green-600">{formatINR(sipResults.returns)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-semibold">{t('mutualFunds.maturityAmount')}:</span>
                  <span className="font-bold text-primary-600 text-lg">{formatINR(sipResults.maturity)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}