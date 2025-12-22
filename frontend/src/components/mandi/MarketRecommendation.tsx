'use client'

import { MapPin } from 'lucide-react'

export default function MarketRecommendation() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Best Market Finder</h2>
      </div>
      <p className="text-gray-600">Find the most profitable markets for your crops considering transport costs and prices.</p>
    </div>
  )
}