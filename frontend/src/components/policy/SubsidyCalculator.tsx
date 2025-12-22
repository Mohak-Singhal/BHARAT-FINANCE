'use client'

import { useState } from 'react'
import { Fuel } from 'lucide-react'

export default function SubsidyCalculator() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Fuel className="h-6 w-6 text-yellow-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Subsidy Impact Calculator</h2>
      </div>
      <p className="text-gray-600">Coming soon: Calculate the impact of fuel and LPG subsidy changes on your monthly budget.</p>
    </div>
  )
}