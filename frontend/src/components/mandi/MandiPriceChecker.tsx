'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface PriceCheckForm {
  crop: string
  state?: string
  district?: string
}

interface MandiPrice {
  mandi_name: string
  district: string
  state: string
  crop: string
  variety: string
  min_price: number
  max_price: number
  modal_price: number
  date: string
}

interface PriceResult {
  crop: string
  prices: MandiPrice[]
  average_price: number
  price_trend: string
  ai_explanation: string
}

const popularCrops = [
  { name: 'Wheat', icon: '🌾' },
  { name: 'Rice', icon: '🍚' },
  { name: 'Onion', icon: '🧅' },
  { name: 'Potato', icon: '🥔' },
  { name: 'Tomato', icon: '🍅' },
  { name: 'Cotton', icon: '🌿' },
]

export default function MandiPriceChecker() {
  const [result, setResult] = useState<PriceResult | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PriceCheckForm>()

  const onSubmit = async (data: PriceCheckForm) => {
    setLoading(true)
    try {
      const response = await fetch('/api/mandi/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const priceResult = await response.json()
        setResult(priceResult)
        toast.success('Mandi prices fetched successfully!')
      } else {
        throw new Error('Failed to fetch mandi prices')
      }
    } catch (error) {
      console.error('Error fetching prices:', error)
      toast.error('Failed to fetch mandi prices. Please try again.')
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

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'rising': return 'text-green-600 bg-green-100'
      case 'falling': return 'text-red-600 bg-red-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Price Check Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Search className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Check Mandi Prices</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Crop Selection */}
            <div>
              <label className="form-label">Crop *</label>
              <input
                type="text"
                {...register('crop', { required: 'Crop name is required' })}
                className="form-input"
                placeholder="e.g., Wheat, Rice, Onion"
              />
              {errors.crop && (
                <p className="text-red-500 text-sm mt-1">{errors.crop.message}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="form-label">State (Optional)</label>
              <input
                type="text"
                {...register('state')}
                className="form-input"
                placeholder="e.g., Punjab, Haryana"
              />
            </div>

            {/* District */}
            <div>
              <label className="form-label">District (Optional)</label>
              <input
                type="text"
                {...register('district')}
                className="form-input"
                placeholder="e.g., Karnal, Amritsar"
              />
            </div>
          </div>

          {/* Popular Crops */}
          <div>
            <label className="form-label">Popular Crops</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularCrops.map((crop) => (
                <button
                  key={crop.name}
                  type="button"
                  onClick={() => setValue('crop', crop.name)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <span>{crop.icon}</span>
                  <span className="text-sm">{crop.name}</span>
                </button>
              ))}
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
                Fetching Prices...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Check Prices
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
          {/* Price Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Price Summary - {result.crop}</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(result.price_trend)}`}>
                {result.price_trend}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(result.average_price)}
                </div>
                <div className="text-sm text-gray-600">Average Price</div>
                <div className="text-xs text-gray-500">per quintal</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {result.prices.length}
                </div>
                <div className="text-sm text-gray-600">Mandis</div>
                <div className="text-xs text-gray-500">reporting prices</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {result.price_trend}
                </div>
                <div className="text-sm text-gray-600">Price Trend</div>
                <div className="text-xs text-gray-500">current direction</div>
              </div>
            </div>
          </div>

          {/* Mandi Prices Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mandi-wise Prices</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mandi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variety
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modal Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.prices.map((price, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {price.mandi_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {price.district}, {price.state}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {price.variety}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(price.min_price)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(price.max_price)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(price.modal_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          {result.ai_explanation && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                {result.ai_explanation.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}