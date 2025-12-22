'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wheat, TrendingUp, MapPin, Calculator } from 'lucide-react'
import MandiPriceChecker from '@/components/mandi/MandiPriceChecker'
import MarketRecommendation from '@/components/mandi/MarketRecommendation'
import MSPInformation from '@/components/mandi/MSPInformation'

type TabType = 'prices' | 'markets' | 'msp'

export default function MandiPage() {
  const [activeTab, setActiveTab] = useState<TabType>('prices')

  const tabs = [
    { id: 'prices', label: 'Mandi Prices', icon: TrendingUp, description: 'Check crop prices' },
    { id: 'markets', label: 'Best Markets', icon: MapPin, description: 'Find profitable markets' },
    { id: 'msp', label: 'MSP Rates', icon: Calculator, description: 'Government rates' },
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
            <div className="bg-yellow-100 rounded-full p-3">
              <Wheat className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mandi & Rural Market Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get real-time mandi prices, find the most profitable markets for your crops, 
            and access MSP information to make informed selling decisions.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Mandis Covered', value: '500+', icon: '🏪' },
            { label: 'Crops Tracked', value: '50+', icon: '🌾' },
            { label: 'States', value: '28', icon: '🗺️' },
            { label: 'Daily Updates', value: '24/7', icon: '🔄' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="grid grid-cols-3 gap-2">
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
                      <div className="font-medium">{tab.label}</div>
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
          {activeTab === 'prices' && <MandiPriceChecker />}
          {activeTab === 'markets' && <MarketRecommendation />}
          {activeTab === 'msp' && <MSPInformation />}
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
              Understanding Mandi System
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🏪 What is a Mandi?
                </h3>
                <p className="text-gray-600 mb-4">
                  Mandis are regulated markets where farmers sell their produce. 
                  They provide price discovery, quality assessment, and payment security.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Regulated by Agricultural Produce Market Committee (APMC)</li>
                  <li>• Transparent price discovery mechanism</li>
                  <li>• Quality grading and standardization</li>
                  <li>• Secure payment systems</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💰 MSP (Minimum Support Price)
                </h3>
                <p className="text-gray-600 mb-4">
                  MSP is the minimum price guaranteed by the government for certain crops. 
                  It acts as a safety net for farmers.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Announced before sowing season</li>
                  <li>• Based on cost of production + profit margin</li>
                  <li>• Government procurement at MSP</li>
                  <li>• Covers 23 major crops</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}