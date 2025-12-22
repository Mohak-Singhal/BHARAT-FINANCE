'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Clock, Star, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface LessonViewerProps {
  language: string
}

interface Lesson {
  topic: string
  language: string
  content: string
  key_points: string[]
  examples: string[]
  quiz_questions: Array<{
    question: string
    options: string[]
    correct: string
  }>
}

const topics = [
  { id: 'budgeting', name: 'Budgeting Basics', difficulty: 'Beginner', duration: '10 min', icon: '💰' },
  { id: 'investing', name: 'Investment Fundamentals', difficulty: 'Beginner', duration: '15 min', icon: '📈' },
  { id: 'insurance', name: 'Insurance Planning', difficulty: 'Intermediate', duration: '12 min', icon: '🛡️' },
  { id: 'taxes', name: 'Tax Planning', difficulty: 'Intermediate', duration: '18 min', icon: '📊' },
  { id: 'retirement', name: 'Retirement Planning', difficulty: 'Advanced', duration: '20 min', icon: '🏖️' },
  { id: 'emergency-fund', name: 'Emergency Fund', difficulty: 'Beginner', duration: '8 min', icon: '🚨' },
]

export default function LessonViewer({ language }: LessonViewerProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchLesson = async (topic: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/literacy/comprehensive-guide/' + topic, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLesson(data.lesson)
        toast.success('Comprehensive lesson loaded successfully!')
      } else {
        throw new Error('Failed to fetch lesson')
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
      toast.error('Failed to load lesson. Please try again.')
      
      // Fallback lesson content
      setLesson({
        topic: topic,
        language: language,
        content: `This is a comprehensive lesson on ${topic}. In this lesson, you will learn the fundamental concepts and practical applications that will help you make better financial decisions.

Key concepts covered:
- Understanding the basics
- Practical implementation
- Common mistakes to avoid
- Best practices for success

This lesson is designed to be easy to understand and implement in your daily financial life.`,
        key_points: [
          `Understanding ${topic} basics`,
          'Practical application in daily life',
          'Common mistakes to avoid',
          'Next steps for implementation'
        ],
        examples: [
          `Example 1: Basic ${topic} scenario`,
          `Example 2: Advanced ${topic} application`,
          `Example 3: Real-world ${topic} case study`
        ],
        quiz_questions: [
          {
            question: `What is the most important aspect of ${topic}?`,
            options: ['A) High returns', 'B) Low risk', 'C) Understanding basics', 'D) Quick profits'],
            correct: 'C'
          }
        ],
        videos: [],
        articles: [],
        government_schemes: []
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId)
    fetchLesson(topicId)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-600'
      case 'intermediate': return 'bg-yellow-100 text-yellow-600'
      case 'advanced': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Topic Selection */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Choose a Topic</h2>
          <div className="space-y-3">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  selectedTopic === topic.id
                    ? 'border-primary-200 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{topic.icon}</span>
                    <h3 className="font-medium text-gray-900">{topic.name}</h3>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {topic.duration}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="lg:col-span-2">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Loader2 className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Lesson...</h3>
            <p className="text-gray-600">Please wait while we prepare your lesson content.</p>
          </div>
        ) : lesson ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Lesson Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900 capitalize">{lesson.topic}</h1>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Language: {lesson.language}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>4.8 rating</span>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Content</h2>
              <div className="prose prose-gray max-w-none">
                {lesson.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Key Points */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Key Points</h3>
              <ul className="space-y-2">
                {lesson.key_points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Examples */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Examples</h3>
              <div className="space-y-3">
                {lesson.examples.map((example, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-gray-700">{example}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Quiz */}
            {lesson.quiz_questions.length > 0 && (
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Quick Quiz</h3>
                <div className="space-y-4">
                  {lesson.quiz_questions.map((question, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-medium text-gray-900 mb-3">{question.question}</h4>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option.charAt(0)}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        Correct answer: {question.correct}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {lesson.videos && lesson.videos.length > 0 && (
              <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📺 Related Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.videos.map((video, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="aspect-video mb-3">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{video.channel}</span>
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                        >
                          Watch
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles Section */}
            {lesson.articles && lesson.articles.length > 0 && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📰 Related Articles</h3>
                <div className="space-y-4">
                  {lesson.articles.map((article, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Key Points:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {article.key_points?.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Source: {article.source}</span>
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Government Schemes Section */}
            {lesson.government_schemes && lesson.government_schemes.length > 0 && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏛️ Related Government Schemes</h3>
                <div className="space-y-4">
                  {lesson.government_schemes.map((scheme, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{scheme.name}</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {scheme.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                      
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Benefits:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {scheme.benefits?.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Eligibility:</span>
                          <p className="text-gray-600">{scheme.eligibility}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">How to Apply:</span>
                          <p className="text-gray-600">{scheme.how_to_apply}</p>
                        </div>
                      </div>
                      
                      {scheme.official_website && (
                        <div className="mt-3">
                          <a 
                            href={scheme.official_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                          >
                            Official Website
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Select a Topic to Start Learning
            </h3>
            <p className="text-gray-600">
              Choose any topic from the left sidebar to begin your financial education journey.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}         
   {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Next Steps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <BookOpen className="h-4 w-4" />
                  <span>Take Quiz</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200">
                  <ChevronRight className="h-4 w-4" />
                  <span>Next Lesson</span>
                </button>
              </div>
            </div>