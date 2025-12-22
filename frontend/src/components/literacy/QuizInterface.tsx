'use client'

import { Play } from 'lucide-react'

interface QuizInterfaceProps {
  language: string
}

export default function QuizInterface({ language }: QuizInterfaceProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Play className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Financial Quiz</h2>
      </div>
      <p className="text-gray-600">Interactive quizzes in {language} coming soon!</p>
    </div>
  )
}