'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Loader2 } from 'lucide-react'
import { InvestmentData } from '@/types/investment'

interface InvestmentFormProps {
  onCalculate: (data: InvestmentData) => void
  loading: boolean
}

const investmentTypes = [
  { value: 'sip', label: 'SIP (Mutual Funds)', defaultRate: 12 },
  { value: 'ppf', label: 'PPF (Public Provident Fund)', defaultRate: 7.1 },
  { value: 'nps', label: 'NPS (National Pension)', defaultRate: 10 },
  { value: 'fd', label: 'FD (Fixed Deposit)', defaultRate: 6.5 },
  { value: 'rd', label: 'RD (Recurring Deposit)', defaultRate: 6 },
]

export default function InvestmentForm({ onCalculate, loading }: InvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentData>({
    investment_type: 'sip',
    monthly_amount: 5000,
    annual_return_rate: 12,
    investment_period_years: 10,
    age: 25,
    inflation_rate: 6,
  })

  const handleInputChange = (field: keyof InvestmentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }))
  }

  const handleInvestmentTypeChange = (type: string) => {
    const selectedType = investmentTypes.find(t => t.value === type)
    setFormData(prev => ({
      ...prev,
      investment_type: type as InvestmentData['investment_type'],
      annual_return_rate: selectedType?.defaultRate || prev.annual_return_rate
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalculate(formData)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Investment Type */}
      <div>
        <label className="form-label">Investment Type</label>
        <select
          value={formData.investment_type}
          onChange={(e) => handleInvestmentTypeChange(e.target.value)}
          className="form-input"
          required
        >
          {investmentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Monthly Amount */}
      <div>
        <label className="form-label">
          Monthly Investment Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ₹
          </span>
          <input
            type="number"
            value={formData.monthly_amount}
            onChange={(e) => handleInputChange('monthly_amount', e.target.value)}
            className="form-input pl-8"
            min="500"
            max="1000000"
            step="500"
            required
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Current: {formatCurrency(formData.monthly_amount)}
        </p>
      </div>

      {/* Expected Returns */}
      <div>
        <label className="form-label">
          Expected Annual Returns (%)
        </label>
        <input
          type="number"
          value={formData.annual_return_rate}
          onChange={(e) => handleInputChange('annual_return_rate', e.target.value)}
          className="form-input"
          min="1"
          max="30"
          step="0.1"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Typical range for {formData.investment_type.toUpperCase()}: {
            investmentTypes.find(t => t.value === formData.investment_type)?.defaultRate
          }% - {
            investmentTypes.find(t => t.value === formData.investment_type)?.defaultRate + 3
          }%
        </p>
      </div>

      {/* Investment Period */}
      <div>
        <label className="form-label">
          Investment Period (Years)
        </label>
        <input
          type="number"
          value={formData.investment_period_years}
          onChange={(e) => handleInputChange('investment_period_years', e.target.value)}
          className="form-input"
          min="1"
          max="40"
          required
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Short-term: 1-3 years</span>
          <span>Long-term: 10+ years</span>
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="form-label">
          Your Age (Optional)
        </label>
        <input
          type="number"
          value={formData.age || ''}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="form-input"
          min="18"
          max="80"
          placeholder="25"
        />
      </div>

      {/* Inflation Rate */}
      <div>
        <label className="form-label">
          Expected Inflation Rate (%)
        </label>
        <input
          type="number"
          value={formData.inflation_rate}
          onChange={(e) => handleInputChange('inflation_rate', e.target.value)}
          className="form-input"
          min="2"
          max="15"
          step="0.1"
        />
        <p className="text-sm text-gray-500 mt-1">
          Historical average in India: 6-7%
        </p>
      </div>

      {/* Quick Calculation Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Quick Preview</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Investment:</span>
            <span className="font-medium">
              {formatCurrency(formData.monthly_amount * formData.investment_period_years * 12)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Investment Period:</span>
            <span className="font-medium">{formData.investment_period_years} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expected Returns:</span>
            <span className="font-medium">{formData.annual_return_rate}% p.a.</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full btn-primary flex items-center justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Returns
          </>
        )}
      </motion.button>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <strong>Disclaimer:</strong> These calculations are for educational purposes only. 
        Actual returns may vary based on market conditions. Please consult a financial advisor 
        before making investment decisions.
      </div>
    </form>
  )
}