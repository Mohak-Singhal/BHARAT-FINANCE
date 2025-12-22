'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingCart, Loader2, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface GSTFormData {
  monthly_expenses: number
  expense_categories: {
    food: number
    clothing: number
    electronics: number
    fuel: number
    services: number
    medicines: number
    education: number
  }
  gst_rate_change: {
    food: number
    clothing: number
    electronics: number
    fuel: number
    services: number
    medicines: number
    education: number
  }
}

interface GSTResult {
  current_gst_burden: number
  new_gst_burden: number
  monthly_impact: number
  annual_impact: number
  category_wise_impact: { [key: string]: number }
  ai_explanation: string
}

const expenseCategories = [
  { key: 'food', label: 'Food & Groceries', currentRate: 5, icon: '🍽️' },
  { key: 'clothing', label: 'Clothing & Textiles', currentRate: 12, icon: '👕' },
  { key: 'electronics', label: 'Electronics', currentRate: 18, icon: '📱' },
  { key: 'fuel', label: 'Fuel & Transport', currentRate: 28, icon: '⛽' },
  { key: 'services', label: 'Services', currentRate: 18, icon: '🔧' },
  { key: 'medicines', label: 'Medicines', currentRate: 5, icon: '💊' },
  { key: 'education', label: 'Education', currentRate: 0, icon: '📚' },
]

export default function GSTSimulator() {
  const [result, setResult] = useState<GSTResult | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<GSTFormData>({
    defaultValues: {
      monthly_expenses: 30000,
      expense_categories: {
        food: 8000,
        clothing: 3000,
        electronics: 2000,
        fuel: 5000,
        services: 4000,
        medicines: 1000,
        education: 2000,
      },
      gst_rate_change: {
        food: 5,
        clothing: 12,
        electronics: 18,
        fuel: 28,
        services: 18,
        medicines: 5,
        education: 0,
      }
    }
  })

  const watchedExpenses = watch('expense_categories')
  const watchedRates = watch('gst_rate_change')
  const totalExpenses = Object.values(watchedExpenses).reduce((sum, val) => sum + (val || 0), 0)

  const onSubmit = async (data: GSTFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/policy/simulate-gst', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const gstResult = await response.json()
        setResult(gstResult)
        toast.success('GST impact analysis completed!')
      } else {
        throw new Error('Failed to simulate GST impact')
      }
    } catch (error) {
      console.error('Error simulating GST:', error)
      toast.error('Failed to simulate GST impact. Please try again.')
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

  const autoDistribute = () => {
    const baseExpenses = {
      food: 0.30,
      clothing: 0.10,
      electronics: 0.08,
      fuel: 0.20,
      services: 0.15,
      medicines: 0.05,
      education: 0.12,
    }
    
    const monthlyExpenses = watch('monthly_expenses')
    Object.entries(baseExpenses).forEach(([category, percentage]) => {
      setValue(`expense_categories.${category as keyof typeof baseExpenses}`, Math.round(monthlyExpenses * percentage))
    })
  }

  return (
    <div className="space-y-8">
      {/* GST Simulator Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">GST Impact Simulator</h2>
          </div>
          <button
            type="button"
            onClick={autoDistribute}
            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          >
            Auto Distribute
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Monthly Expenses */}
          <div>
            <label className="form-label">Total Monthly Expenses (₹)</label>
            <input
              type="number"
              {...register('monthly_expenses', { required: 'Monthly expenses are required', min: 1000 })}
              className="form-input"
              placeholder="30000"
            />
            {errors.monthly_expenses && (
              <p className="text-red-500 text-sm mt-1">{errors.monthly_expenses.message}</p>
            )}
          </div>

          {/* Expense Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Category-wise Monthly Expenses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenseCategories.map((category) => (
                <div key={category.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">{category.icon}</span>
                    <label className="font-medium text-gray-900">{category.label}</label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Amount (₹)</label>
                      <input
                        type="number"
                        {...register(`expense_categories.${category.key as keyof typeof watchedExpenses}`, { min: 0 })}
                        className="form-input text-sm"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600">New GST Rate (%)</label>
                      <input
                        type="number"
                        {...register(`gst_rate_change.${category.key as keyof typeof watchedRates}`, { min: 0, max: 50 })}
                        className="form-input text-sm"
                        placeholder={category.currentRate.toString()}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Current GST: {category.currentRate}% → New: {watchedRates[category.key as keyof typeof watchedRates] || category.currentRate}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Expense Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Allocated:</span>
                <div className="font-medium">{formatCurrency(totalExpenses)}</div>
              </div>
              <div>
                <span className="text-gray-600">Remaining:</span>
                <div className={`font-medium ${watch('monthly_expenses') - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(watch('monthly_expenses') - totalExpenses)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Allocation:</span>
                <div className="font-medium">
                  {((totalExpenses / watch('monthly_expenses')) * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Categories:</span>
                <div className="font-medium">{expenseCategories.length}</div>
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
                Analyzing Impact...
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5 mr-2" />
                Simulate GST Impact
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Impact Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <ShoppingCart className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">GST Impact Analysis</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(result.current_gst_burden)}
                </div>
                <div className="text-sm text-gray-600">Current GST Burden</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatCurrency(result.new_gst_burden)}
                </div>
                <div className="text-sm text-gray-600">New GST Burden</div>
              </div>
              
              <div className={`rounded-lg p-4 text-center ${result.monthly_impact >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className={`text-2xl font-bold mb-1 ${result.monthly_impact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.monthly_impact >= 0 ? '+' : ''}{formatCurrency(result.monthly_impact)}
                </div>
                <div className="text-sm text-gray-600">Monthly Impact</div>
              </div>
              
              <div className={`rounded-lg p-4 text-center ${result.annual_impact >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className={`text-2xl font-bold mb-1 ${result.annual_impact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.annual_impact >= 0 ? '+' : ''}{formatCurrency(result.annual_impact)}
                </div>
                <div className="text-sm text-gray-600">Annual Impact</div>
              </div>
            </div>

            {/* Impact Indicator */}
            <div className={`rounded-lg p-4 ${result.monthly_impact >= 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center">
                <AlertCircle className={`h-5 w-5 mr-2 ${result.monthly_impact >= 0 ? 'text-red-600' : 'text-green-600'}`} />
                <div>
                  <h3 className={`font-semibold ${result.monthly_impact >= 0 ? 'text-red-900' : 'text-green-900'}`}>
                    {result.monthly_impact >= 0 ? 'Increased Burden' : 'Reduced Burden'}
                  </h3>
                  <p className={`text-sm ${result.monthly_impact >= 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {result.monthly_impact >= 0 
                      ? `Your monthly expenses will increase by ${formatCurrency(Math.abs(result.monthly_impact))}`
                      : `Your monthly expenses will decrease by ${formatCurrency(Math.abs(result.monthly_impact))}`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category-wise Impact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category-wise Impact</h3>
            <div className="space-y-3">
              {Object.entries(result.category_wise_impact).map(([category, impact]) => {
                const categoryInfo = expenseCategories.find(cat => cat.key === category)
                return (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{categoryInfo?.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{categoryInfo?.label}</div>
                        <div className="text-sm text-gray-600">
                          Monthly expense: {formatCurrency(watchedExpenses[category as keyof typeof watchedExpenses] || 0)}
                        </div>
                      </div>
                    </div>
                    <div className={`text-right font-medium ${impact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {impact >= 0 ? '+' : ''}{formatCurrency(impact)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Explanation */}
          {result.ai_explanation && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                {result.ai_explanation.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* GST Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding GST Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Current GST Slabs</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 0%: Essential items (milk, bread, vegetables)</li>
              <li>• 5%: Household necessities (sugar, tea, medicines)</li>
              <li>• 12%: Processed foods, mobile phones</li>
              <li>• 18%: Most goods and services</li>
              <li>• 28%: Luxury items (cars, AC, cigarettes)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Impact on Common Items</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Restaurant bills: 5% (non-AC) / 18% (AC)</li>
              <li>• Movie tickets: 18% + entertainment tax</li>
              <li>• Online services: 18%</li>
              <li>• Clothing under ₹1000: 5%, above: 12%</li>
              <li>• Fuel: Outside GST (state taxes apply)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}