'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, PieChart, TrendingDown, Loader2, Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface TaxFormData {
  annual_income: number
  age: number
  deductions_80c: number
  deductions_80d: number
  other_deductions: number
}

interface TaxResult {
  gross_income: number
  total_deductions: number
  taxable_income: number
  income_tax: number
  cess: number
  total_tax: number
  net_income: number
  effective_tax_rate: number
  tax_breakdown: Array<{
    slab: string
    rate: string
    taxable_amount: number
    tax: number
  }>
  ai_explanation: string
  tax_saving_suggestions: string[]
}

export default function TaxCalculator() {
  const [result, setResult] = useState<TaxResult | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TaxFormData>({
    defaultValues: {
      annual_income: 800000,
      age: 30,
      deductions_80c: 150000,
      deductions_80d: 25000,
      other_deductions: 0
    }
  })

  const watchedIncome = watch('annual_income')
  const watchedDeductions = watch('deductions_80c') + watch('deductions_80d') + watch('other_deductions')

  const onSubmit = async (data: TaxFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/policy/simulate-tax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const taxResult = await response.json()
        setResult(taxResult)
        toast.success('Tax calculation completed!')
      } else {
        throw new Error('Failed to calculate tax')
      }
    } catch (error) {
      console.error('Error calculating tax:', error)
      toast.error('Failed to calculate tax. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Tax Calculator Form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
          <div className="flex items-center mb-6">
            <Calculator className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Tax Calculator</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Annual Income */}
            <div>
              <label className="form-label">Annual Income (₹)</label>
              <input
                type="number"
                {...register('annual_income', { required: 'Income is required', min: 0 })}
                className="form-input"
                placeholder="800000"
              />
              {errors.annual_income && (
                <p className="text-red-500 text-sm mt-1">{errors.annual_income.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="form-label">Age</label>
              <input
                type="number"
                {...register('age', { required: 'Age is required', min: 18, max: 100 })}
                className="form-input"
                placeholder="30"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Senior citizens (60+) get higher deduction limits
              </p>
            </div>

            {/* 80C Deductions */}
            <div>
              <label className="form-label">80C Deductions (₹)</label>
              <input
                type="number"
                {...register('deductions_80c', { min: 0, max: 150000 })}
                className="form-input"
                placeholder="150000"
              />
              <p className="text-sm text-gray-500 mt-1">
                Max: ₹1.5L (PPF, ELSS, Life Insurance, etc.)
              </p>
            </div>

            {/* 80D Deductions */}
            <div>
              <label className="form-label">80D Health Insurance (₹)</label>
              <input
                type="number"
                {...register('deductions_80d', { min: 0, max: 100000 })}
                className="form-input"
                placeholder="25000"
              />
              <p className="text-sm text-gray-500 mt-1">
                Max: ₹25K (₹50K for senior citizens)
              </p>
            </div>

            {/* Other Deductions */}
            <div>
              <label className="form-label">Other Deductions (₹)</label>
              <input
                type="number"
                {...register('other_deductions', { min: 0 })}
                className="form-input"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                HRA, LTA, 80CCD(1B), etc.
              </p>
            </div>

            {/* Quick Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Quick Preview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Income:</span>
                  <span className="font-medium">{formatCurrency(watchedIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deductions:</span>
                  <span className="font-medium">{formatCurrency(watchedDeductions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Income:</span>
                  <span className="font-medium">{formatCurrency(Math.max(0, watchedIncome - watchedDeductions))}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center py-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Tax
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <>
            {/* Tax Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <PieChart className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Tax Calculation Results</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatCurrency(result.gross_income)}
                  </div>
                  <div className="text-sm text-gray-600">Gross Income</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(result.total_deductions)}
                  </div>
                  <div className="text-sm text-gray-600">Total Deductions</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {formatCurrency(result.total_tax)}
                  </div>
                  <div className="text-sm text-gray-600">Total Tax</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {formatCurrency(result.net_income)}
                  </div>
                  <div className="text-sm text-gray-600">Net Income</div>
                </div>
              </div>

              {/* Effective Tax Rate */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Effective Tax Rate</h3>
                    <p className="text-sm text-gray-600">Percentage of gross income paid as tax</p>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {result.effective_tax_rate.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Tax Slab Breakdown</h3>
                <div className="space-y-3">
                  {result.tax_breakdown.map((slab, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{slab.slab}</div>
                        <div className="text-sm text-gray-600">Rate: {slab.rate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(slab.tax)}
                        </div>
                        <div className="text-sm text-gray-600">
                          on {formatCurrency(slab.taxable_amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tax Saving Suggestions */}
            {result.tax_saving_suggestions.length > 0 && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                <div className="flex items-center mb-4">
                  <TrendingDown className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Tax Saving Suggestions</h3>
                </div>
                <ul className="space-y-2">
                  {result.tax_saving_suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">💡</span>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Explanation */}
            {result.ai_explanation && (
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <div className="flex items-center mb-4">
                  <Info className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {result.ai_explanation.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Calculate Your Tax?
            </h3>
            <p className="text-gray-600">
              Fill in your income and deduction details to get a detailed tax breakdown 
              with AI-powered insights and tax-saving suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}