'use client'

import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Target, AlertCircle } from 'lucide-react'
import { InvestmentResult } from '@/types/investment'

interface InvestmentResultsProps {
  result: InvestmentResult
}

export default function InvestmentResults({ result }: InvestmentResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const returnPercentage = ((result.final_corpus - result.total_invested) / result.total_invested) * 100
  const realReturnPercentage = (result.real_returns / result.total_invested) * 100

  const stats = [
    {
      label: 'Total Invested',
      value: formatCurrency(result.total_invested),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Final Corpus',
      value: formatCurrency(result.final_corpus),
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Returns',
      value: formatCurrency(result.total_returns),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Inflation Adjusted',
      value: formatCurrency(result.inflation_adjusted_corpus),
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-lg p-2 mr-3`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Return Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatPercentage(returnPercentage)}
            </div>
            <div className="text-sm text-gray-600">Nominal Returns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatPercentage(realReturnPercentage)}
            </div>
            <div className="text-sm text-gray-600">Real Returns</div>
            <div className="text-xs text-gray-500">(After Inflation)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {(result.final_corpus / result.total_invested).toFixed(1)}x
            </div>
            <div className="text-sm text-gray-600">Wealth Multiplier</div>
          </div>
        </div>
      </motion.div>

      {/* Investment Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Breakdown</h3>
        
        {/* Visual Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Principal</span>
            <span>Returns</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-blue-500 transition-all duration-1000 ease-out"
                style={{ 
                  width: `${(result.total_invested / result.final_corpus) * 100}%` 
                }}
              ></div>
              <div 
                className="bg-green-500 transition-all duration-1000 ease-out"
                style={{ 
                  width: `${(result.total_returns / result.final_corpus) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-blue-600 font-medium">
              {formatCurrency(result.total_invested)}
            </span>
            <span className="text-green-600 font-medium">
              {formatCurrency(result.total_returns)}
            </span>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="font-medium text-blue-900 mb-1">Power of Compounding</div>
            <div className="text-blue-700">
              Your money grows {(result.final_corpus / result.total_invested).toFixed(1)}x 
              through compound interest over time.
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="font-medium text-orange-900 mb-1">Inflation Impact</div>
            <div className="text-orange-700">
              Real purchasing power: {formatCurrency(result.inflation_adjusted_corpus)}
              ({formatPercentage((result.inflation_adjusted_corpus / result.final_corpus) * 100)} of nominal value)
            </div>
          </div>
        </div>
      </motion.div>

      {/* Investment Type Specific Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gray-50 rounded-lg p-4"
      >
        <h4 className="font-medium text-gray-900 mb-2">
          About {result.investment_type}
        </h4>
        <div className="text-sm text-gray-600">
          {result.investment_type === 'SIP' && (
            <p>
              SIP allows you to invest regularly in mutual funds, benefiting from rupee cost averaging 
              and the power of compounding. Market-linked returns with high liquidity.
            </p>
          )}
          {result.investment_type === 'PPF' && (
            <p>
              PPF offers tax benefits under Section 80C with tax-free returns. 15-year lock-in period 
              with government-guaranteed returns. Triple tax benefit scheme.
            </p>
          )}
          {result.investment_type === 'NPS' && (
            <p>
              NPS is a retirement-focused scheme with additional tax benefits under 80CCD(1B). 
              Professional fund management with equity and debt allocation based on age.
            </p>
          )}
          {(result.investment_type === 'FD' || result.investment_type === 'RD') && (
            <p>
              Fixed deposits offer guaranteed returns with capital protection. Suitable for 
              conservative investors seeking stable, predictable growth.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}