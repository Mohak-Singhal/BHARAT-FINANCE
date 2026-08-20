'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calculator, TrendingDown, TrendingUp, Fuel, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import TaxCalculator from '@/components/policy/TaxCalculator'
import GSTSimulator from '@/components/policy/GSTSimulator'
import SubsidyCalculator from '@/components/policy/SubsidyCalculator'
import PolicyComparison from '@/components/policy/PolicyComparison'

type TabType = 'tax' | 'gst' | 'subsidy' | 'comparison'

export default function PolicyPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('tax')

  const tabs = [
    { id: 'tax', label: t('policy.taxCalculator'), icon: Calculator, description: 'Calculate income tax' },
    { id: 'gst', label: 'GST Impact', icon: TrendingUp, description: 'GST rate changes' },
    { id: 'subsidy', label: t('policySimulator.subsidyImpact'), icon: Fuel, description: 'Fuel & LPG subsidies' },
    { id: 'comparison', label: t('policy.comparisonTitle'), icon: FileText, description: 'Compare policies' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Policy & Tax Impact Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understand how government policies, tax changes, and subsidies affect your finances. 
            Make informed decisions with real-world impact analysis.
          </p>
        </motion.div>

        {/* Current Tax Rates Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Tax Rates (FY 2023-24)</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {[
              { range: 'Up to ₹3L', rate: '0%', color: 'bg-green-100 text-green-600' },
              { range: '₹3L - ₹6L', rate: '5%', color: 'bg-blue-100 text-blue-600' },
              { range: '₹6L - ₹9L', rate: '10%', color: 'bg-yellow-100 text-yellow-600' },
              { range: '₹9L - ₹12L', rate: '15%', color: 'bg-orange-100 text-orange-600' },
              { range: '₹12L - ₹15L', rate: '20%', color: 'bg-red-100 text-red-600' },
              { range: 'Above ₹15L', rate: '30%', color: 'bg-purple-100 text-purple-600' },
            ].map((slab, index) => (
              <div key={index} className={`p-3 rounded-lg ${slab.color}`}>
                <div className="text-xs font-medium mb-1">{slab.range}</div>
                <div className="text-lg font-bold">{slab.rate}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'tax' && <TaxCalculator />}
          {activeTab === 'gst' && <GSTSimulator />}
          {activeTab === 'subsidy' && <SubsidyCalculator />}
          {activeTab === 'comparison' && <PolicyComparison />}
        </motion.div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Understanding Indian Tax System
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📊 New Tax Regime (Default)
                </h3>
                <p className="text-gray-600 mb-4">
                  Introduced in Budget 2020, offers lower tax rates but with limited deductions. 
                  Standard deduction of ₹50,000 is available.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Lower tax rates across slabs</li>
                  <li>• Limited deductions available</li>
                  <li>• No 80C, 80D deductions</li>
                  <li>• Suitable for those with fewer investments</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🏛️ Old Tax Regime (Optional)
                </h3>
                <p className="text-gray-600 mb-4">
                  Traditional tax structure with higher rates but extensive deductions. 
                  You can choose this regime if it's more beneficial.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Higher tax rates</li>
                  <li>• Multiple deduction options</li>
                  <li>• 80C limit: ₹1.5 lakh</li>
                  <li>• Suitable for high savers/investors</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💰 Key Deductions (Old Regime)
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 80C: ₹1.5L (PPF, ELSS, Life Insurance)</li>
                  <li>• 80D: ₹25K (Health Insurance)</li>
                  <li>• 80CCD(1B): ₹50K (NPS)</li>
                  <li>• HRA: Rent paid minus 10% of salary</li>
                  <li>• LTA: Travel allowance exemption</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📈 GST Impact on Daily Life
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Essential items: 0-5% GST</li>
                  <li>• Most goods: 12-18% GST</li>
                  <li>• Luxury items: 28% GST</li>
                  <li>• Services: Generally 18% GST</li>
                  <li>• Fuel: Outside GST (state taxes apply)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}