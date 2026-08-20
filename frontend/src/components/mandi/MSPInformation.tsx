'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp } from 'lucide-react'

interface MSPRate {
  crop: string
  msp: number
  unit: string
}

interface MSPData {
  year: string
  msp_rates: MSPRate[]
  note: string
}

export default function MSPInformation() {
  const { t } = useTranslation()
  const [mspData, setMspData] = useState<MSPData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMSPRates()
  }, [])

  const fetchMSPRates = async () => {
    try {
      const response = await fetch('/api/mandi/msp-rates')
      if (response.ok) {
        const data = await response.json()
        setMspData(data)
      }
    } catch (error) {
      console.error('Error fetching MSP rates:', error)
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t('mandi.loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* MSP Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Calculator className="h-6 w-6 text-orange-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">{t('mandi.mspTitle')} - {mspData?.year}</h2>
        </div>
        <p className="text-gray-600 mb-4">{mspData?.note}</p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">{t('mandi.whatIsMsp')}</h3>
          <p className="text-orange-800 text-sm">
            {t('mandi.mspSubtitle')}
          </p>
        </div>
      </div>

      {/* MSP Rates Table */}
      {mspData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('mandi.currentMspRates')}</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('mandi.cropName')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('mandi.mspRate')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('mandi.unit')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('mandi.category')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mspData.msp_rates.map((rate, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rate.crop}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                      {formatCurrency(rate.msp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {rate.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {rate.crop.includes('Paddy') || rate.crop.includes('Rice') ? 'Kharif' : 
                       rate.crop.includes('Wheat') ? 'Rabi' : 'Other'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* MSP Benefits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits of MSP</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{t('mandi.mspBenefitsFarmers')}</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Guaranteed minimum price for crops</li>
              <li>• Protection from market price volatility</li>
              <li>• Assured income and financial security</li>
              <li>• Encourages crop diversification</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{t('mandi.mspBenefitsEconomy')}</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Food security and buffer stock creation</li>
              <li>• Price stability in essential commodities</li>
              <li>• Rural income support and development</li>
              <li>• Inflation control mechanism</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How to Sell at MSP */}
      <div className="bg-green-50 rounded-xl border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('mandi.howToSell')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{t('mandi.register')}</h4>
            <p className="text-sm text-gray-600">Register with local procurement agency or FCI</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{t('mandi.qualityCheck')}</h4>
            <p className="text-sm text-gray-600">Ensure crop meets quality specifications</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{t('mandi.sell')}</h4>
            <p className="text-sm text-gray-600">Deliver crop to procurement center and get paid</p>
          </div>
        </div>
      </div>
    </div>
  )
}