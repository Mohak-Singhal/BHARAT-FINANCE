'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface AnalysisFormData {
  monthly_income: number
  monthly_expenses: number
  age: number
  risk_level: 'conservative' | 'moderate' | 'aggressive'
  financial_goals: string[]
  current_savings: number
  current_investments: number
  dependents: number
  city_tier: 'tier1' | 'tier2' | 'tier3'
}

interface AnalysisResult {
  financial_health_score: number
  budget_recommendations: Array<{
    category: string
    current_allocation: number
    recommended_allocation: number
    difference: number
    explanation: string
  }>
  savings_suggestions: string[]
  investment_recommendations: string[]
  insurance_needs: string[]
  warnings: string[]
  ai_explanation: string
  action_plan: string[]
}

export default function FinancialAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AnalysisFormData>({
    defaultValues: {
      monthly_income: 50000,
      monthly_expenses: 35000,
      age: 28,
      risk_level: 'moderate',
      financial_goals: ['emergency_fund'],
      current_savings: 100000,
      current_investments: 50000,
      dependents: 0,
      city_tier: 'tier2'
    }
  })

  const watchedIncome = watch('monthly_income')
  const watchedExpenses = watch('monthly_expenses')
  const savingsRate = watchedIncome > 0 ? ((watchedIncome - watchedExpenses) / watchedIncome) * 100 : 0

  const onSubmit = async (data: AnalysisFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/finance-coach/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const analysisResult = await response.json()
        setResult(analysisResult)
        toast.success('Financial analysis completed!')
      } else {
        throw new Error('Failed to analyze financial profile')
      }
    } catch (error) {
      console.error('Error analyzing finances:', error)
      toast.error('Failed to analyze your financial profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="space-y-8">
      {/* Analysis Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Financial Profile Analysis</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Income */}
            <div>
              <label className="form-label">Monthly Income (₹)</label>
              <input
                type="number"
                {...register('monthly_income', { required: 'Income is required', min: 1000 })}
                className="form-input"
                placeholder="50000"
              />
              {errors.monthly_income && (
                <p className="text-red-500 text-sm mt-1">{errors.monthly_income.message}</p>
              )}
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="form-label">Monthly Expenses (₹)</label>
              <input
                type="number"
                {...register('monthly_expenses', { required: 'Expenses are required', min: 0 })}
                className="form-input"
                placeholder="35000"
              />
              {errors.monthly_expenses && (
                <p className="text-red-500 text-sm mt-1">{errors.monthly_expenses.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="form-label">Age</label>
              <input
                type="number"
                {...register('age', { required: 'Age is required', min: 18, max: 100 })}
                className="form-input"
                placeholder="28"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* Risk Level */}
            <div>
              <label className="form-label">Risk Appetite</label>
              <select {...register('risk_level')} className="form-input">
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            {/* Current Savings */}
            <div>
              <label className="form-label">Current Savings (₹)</label>
              <input
                type="number"
                {...register('current_savings', { min: 0 })}
                className="form-input"
                placeholder="100000"
              />
            </div>

            {/* Current Investments */}
            <div>
              <label className="form-label">Current Investments (₹)</label>
              <input
                type="number"
                {...register('current_investments', { min: 0 })}
                className="form-input"
                placeholder="50000"
              />
            </div>

            {/* Dependents */}
            <div>
              <label className="form-label">Number of Dependents</label>
              <input
                type="number"
                {...register('dependents', { min: 0, max: 10 })}
                className="form-input"
                placeholder="0"
              />
            </div>

            {/* City Tier */}
            <div>
              <label className="form-label">City Tier</label>
              <select {...register('city_tier')} className="form-input">
                <option value="tier1">Tier 1 (Mumbai, Delhi, Bangalore)</option>
                <option value="tier2">Tier 2 (Pune, Ahmedabad, Chennai)</option>
                <option value="tier3">Tier 3 (Smaller cities)</option>
              </select>
            </div>
          </div>

          {/* Financial Goals */}
          <div>
            <label className="form-label">Financial Goals (Select all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {[
                { value: 'emergency_fund', label: 'Emergency Fund' },
                { value: 'home_purchase', label: 'Home Purchase' },
                { value: 'retirement', label: 'Retirement Planning' },
                { value: 'child_education', label: 'Child Education' },
                { value: 'wealth_creation', label: 'Wealth Creation' },
              ].map((goal) => (
                <label key={goal.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={goal.value}
                    {...register('financial_goals')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{goal.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Quick Preview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Monthly Savings:</span>
                <div className="font-medium">₹{(watchedIncome - watchedExpenses).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Savings Rate:</span>
                <div className={`font-medium ${savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {savingsRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Annual Income:</span>
                <div className="font-medium">₹{(watchedIncome * 12).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Annual Expenses:</span>
                <div className="font-medium">₹{(watchedExpenses * 12).toLocaleString()}</div>
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
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="h-5 w-5 mr-2" />
                Analyze My Finances
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Financial Health Score */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Health Score</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke={result.financial_health_score >= 80 ? '#10b981' : result.financial_health_score >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(result.financial_health_score / 100) * 314} 314`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getHealthScoreColor(result.financial_health_score)}`}>
                      {result.financial_health_score}
                    </div>
                    <div className="text-sm text-gray-600">out of 100</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${getHealthScoreColor(result.financial_health_score)}`}>
                {getHealthScoreLabel(result.financial_health_score)}
              </div>
              <p className="text-gray-600 mt-2">
                Your financial health is {getHealthScoreLabel(result.financial_health_score).toLowerCase()}. 
                {result.financial_health_score < 60 && " There's room for improvement!"}
              </p>
            </div>
          </div>

          {/* Budget Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Recommendations</h3>
            <div className="space-y-4">
              {result.budget_recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{rec.category}</h4>
                    <span className={`text-sm font-medium ${rec.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {rec.difference > 0 ? '+' : ''}₹{Math.abs(rec.difference).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-600">Current: </span>
                      <span className="font-medium">₹{rec.current_allocation.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Recommended: </span>
                      <span className="font-medium">₹{rec.recommended_allocation.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{rec.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Savings Suggestions */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Savings Suggestions</h3>
              </div>
              <ul className="space-y-2">
                {result.savings_suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700 text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Investment Recommendations */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Investment Recommendations</h3>
              </div>
              <ul className="space-y-2">
                {result.investment_recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700 text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Important Warnings</h3>
              </div>
              <ul className="space-y-2">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">⚠</span>
                    <span className="text-gray-700 text-sm">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

          {/* Action Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Action Plan</h3>
            <div className="space-y-3">
              {result.action_plan.map((action, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}