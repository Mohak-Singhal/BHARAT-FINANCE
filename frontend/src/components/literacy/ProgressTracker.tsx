'use client'

import { Award } from 'lucide-react'

export default function ProgressTracker() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Award className="h-6 w-6 text-purple-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
      </div>
      <p className="text-gray-600">Track your learning progress and achievements here!</p>
    </div>
  )
}