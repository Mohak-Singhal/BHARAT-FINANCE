'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronRight, Clock, Star, Loader2, Play, ExternalLink, Award, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface EnhancedLessonViewerProps {
  language: string
}

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  channel: string
  url: string
  embed_url: string
}

interface Article {
  title: string
  summary: string
  source: string
  url: string
  key_points: string[]
  indian_context?: string
}

interface GovernmentScheme {
  name: string
  category: string
  description: string
  benefits: string[]
  eligibility: string
  how_to_apply: string
  official_website?: string
  launched_year?: string
  beneficiaries?: string
}

interface EnhancedLesson {
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
  videos: Video[]
  articles: Article[]
  government_schemes: GovernmentScheme[]
}

const topics = [
  { id: 'budgeting', name: 'Budgeting Basics', difficulty: 'Beginner', duration: '10 min', icon: '💰', color: 'bg-blue-500' },
  { id: 'investing', name: 'Investment Fundamentals', difficulty: 'Beginner', duration: '15 min', icon: '📈', color: 'bg-green-500' },
  { id: 'insurance', name: 'Insurance Planning', difficulty: 'Intermediate', duration: '12 min', icon: '🛡️', color: 'bg-purple-500' },
  { id: 'taxes', name: 'Tax Planning', difficulty: 'Intermediate', duration: '18 min', icon: '📊', color: 'bg-orange-500' },
  { id: 'retirement', name: 'Retirement Planning', difficulty: 'Advanced', duration: '20 min', icon: '🏖️', color: 'bg-red-500' },
  { id: 'banking', name: 'Banking & Digital Payments', difficulty: 'Beginner', duration: '8 min', icon: '🏦', color: 'bg-indigo-500' },
]

export default function EnhancedLessonViewer({ language }: EnhancedLessonViewerProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [lesson, setLesson] = useState<EnhancedLesson | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<'content' | 'videos' | 'articles' | 'schemes'>('content')

  const fetchLesson = async (topic: string) => {    se
tLoading(true)
    try {
      const response = await fetch(`/api/literacy/comprehensive-guide/${topic}?language=${language}`)

      if (response.ok) {
        const data = await response.json()
        setLesson(data.lesson)
        toast.success('Comprehensive lesson loaded!')
      } else {
        throw new Error('Failed to fetch lesson')
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
      toast.error('Failed to load lesson. Please try again.')
      
      // Enhanced fallback lesson
      setLesson({
        topic: topic,
        language: language,
        content: `# ${topic.charAt(0).toUpperCase() + topic.slice(1)} - Complete Guide

This comprehensive lesson covers everything you need to know about ${topic} in the Indian context.

## What You'll Learn
- Fundamental concepts and principles
- Practical implementation strategies
- Real-world examples from Indian markets
- Common pitfalls and how to avoid them
- Government schemes and benefits available

## Getting Started
Understanding ${topic} is crucial for your financial well-being. This lesson will guide you through step-by-step implementation with practical examples relevant to Indian users.`,
        key_points: [
          `Master the fundamentals of ${topic}`,
          'Apply concepts in real-world scenarios',
          'Avoid common mistakes and pitfalls',
          'Leverage government schemes and benefits',
          'Create an action plan for implementation'
        ],
        examples: [
          `Practical ${topic} example for Indian families`,
          `Step-by-step implementation guide`,
          `Real success stories and case studies`
        ],
        quiz_questions: [
          {
            question: `What is the most important first step in ${topic}?`,
            options: ['A) High returns', 'B) Understanding basics', 'C) Quick profits', 'D) Following trends'],
            correct: 'B'
          }
        ],
        videos: [
          {
            id: 'sample1',
            title: `${topic} Explained in Simple Terms`,
            description: `Learn ${topic} basics with practical examples and real-world applications for Indian users.`,
            thumbnail: `https://img.youtube.com/vi/sample1/mqdefault.jpg`,
            channel: 'Finance Education India',
            url: `https://www.youtube.com/watch?v=sample1`,
            embed_url: `https://www.youtube.com/embed/sample1`
          }
        ],
        articles: [
          {
            title: `Complete Guide to ${topic} in India`,
            summary: `Comprehensive guide covering all aspects of ${topic} with Indian context and practical examples.`,
            source: 'MoneyControl',
            url: '#',
            key_points: [
              `Understanding ${topic} fundamentals`,
              'Indian regulatory framework',
              'Practical implementation steps',
              'Tax implications and benefits'
            ],
            indian_context: `Specifically designed for Indian users with local examples and regulations.`
          }
        ],
        government_schemes: [
          {
            name: 'Pradhan Mantri Jan Dhan Yojana',
            category: 'banking',
            description: 'Financial inclusion program for all Indian households',
            benefits: ['Zero balance account', 'RuPay debit card', 'Insurance coverage'],
            eligibility: 'All Indian citizens',
            how_to_apply: 'Visit nearest bank branch',
            official_website: 'https://www.pmjdy.gov.in/'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId)
    setActiveSection('content')
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

  const sectionTabs = [
    { id: 'content', label: 'Lesson', icon: BookOpen, count: lesson ? 1 : 0 },
    { id: 'videos', label: 'Videos', icon: Play, count: lesson?.videos?.length || 0 },
    { id: 'articles', label: 'Articles', icon: ExternalLink, count: lesson?.articles?.length || 0 },
    { id: 'schemes', label: 'Schemes', icon: Award, count: lesson?.government_schemes?.length || 0 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Enhanced Topic Selection */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opaci