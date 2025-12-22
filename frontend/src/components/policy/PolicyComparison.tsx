'use client'

import { FileText } from 'lucide-react'

export default function PolicyComparison() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-purple-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Policy Comparison Tool</h2>
      </div>
      <p className="text-gray-600">Coming soon: Compare different government policies and their impact on your finances.</p>
    </div>
  )
}