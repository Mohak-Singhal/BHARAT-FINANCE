'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  Video,
  FileText,
  TrendingUp,
  Target,
  Shield,
  Calculator,
  Play,
  ExternalLink,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { learningService, VideoResult, ArticleResult } from '@/services/learningService'

const learningCategories = [
  {
    icon: TrendingUp,
    title: 'Investment Basics',
    description: 'Learn about stocks, mutual funds, and building wealth',
    topics: ['Stock Market', 'Mutual Funds', 'SIP', 'Portfolio Management'],
    color: 'from-blue-500 to-cyan-500',
    search: 'stock market investing',
  },
  {
    icon: Calculator,
    title: 'Financial Planning',
    description: 'Budget management and financial goal setting',
    topics: ['Budgeting', 'Emergency Fund', 'Goal Setting', 'Expense Tracking'],
    color: 'from-green-500 to-emerald-500',
    search: 'budgeting personal finance',
  },
  {
    icon: Shield,
    title: 'Insurance & Protection',
    description: 'Understand different types of insurance and protection',
    topics: ['Life Insurance', 'Health Insurance', 'Term Insurance', 'Claims'],
    color: 'from-purple-500 to-violet-500',
    search: 'insurance planning india',
  },
  {
    icon: Target,
    title: 'Tax Planning',
    description: 'Save taxes and optimize your financial strategy',
    topics: ['Section 80C', 'Tax Deductions', 'ITR Filing', 'Tax Saving'],
    color: 'from-orange-500 to-red-500',
    search: 'tax saving india',
  },
]

const trendingTopics = [
  'SIP vs Lump Sum',
  'ELSS Funds',
  'Emergency Fund Planning',
  'Home Loan vs Rent',
  'Crypto Investment',
  'Retirement Corpus',
  'Tax Saving FD',
  'Health Insurance Claims',
]

export default function LearningPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [videos, setVideos] = useState<VideoResult[]>([])
  const [articles, setArticles] = useState<ArticleResult[]>([])
  const [summary, setSummary] = useState('')
  const [relatedTopics, setRelatedTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return
    setLoading(true)
    setHasSearched(true)
    try {
      const content = await learningService.getLearningContent(query.trim(), { maxResults: 8 })
      setVideos(content.videos)
      setArticles(content.articles)
      setSummary(content.summary)
      setRelatedTopics(content.relatedTopics)
    } catch (error) {
      console.error('Learning content error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchTerm)
  }

  const handleCategoryClick = (category: (typeof learningCategories)[number]) => {
    setActiveCategory(category.title)
    setSearchTerm(category.search)
    performSearch(category.search)
  }

  const handleTrendingClick = (topic: string) => {
    setSearchTerm(topic)
    performSearch(topic)
  }

  useEffect(() => {
    if (!hasSearched) {
      performSearch('personal finance basics')
    }
  }, [hasSearched, performSearch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full px-6 py-3 mb-6">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Financial Education</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Learning <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Expand your financial knowledge with curated educational videos and articles
            powered by the YouTube Data API.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search financial topics (e.g. mutual funds, stock market, budgeting)..."
              className="w-full pl-12 pr-28 py-4 bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Learn
            </button>
          </div>
        </form>

        {/* Learning Categories */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {learningCategories.map((category, index) => (
              <motion.button
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleCategoryClick(category)}
                className={`text-left bg-white rounded-2xl p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${activeCategory === category.title ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white mb-4`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {category.topics.map(topic => (
                    <span key={topic} className="text-xs text-gray-500 bg-gray-100 rounded-lg px-2 py-1">
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Content Results */}
        {hasSearched && (
          <section>
            {loading ? (
              <div className="space-y-6">
                <div className="skeleton h-24 rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton h-56 rounded-2xl" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Summary */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl p-6 mb-8 shadow-xl"
                  >
                    <p className="text-white/90 leading-relaxed">{summary}</p>
                    {relatedTopics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {relatedTopics.map(topic => (
                          <button
                            key={topic}
                            onClick={() => {
                              setSearchTerm(topic)
                              performSearch(topic)
                            }}
                            className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5 transition-colors duration-200"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Videos */}
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Video className="w-5 h-5 text-primary-600" />
                      Video Tutorials ({videos.length})
                    </h2>
                    {videos.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100">
                        <p className="text-gray-500">No videos found. Try a different search.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {videos.map((video, i) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover"
                          >
                            <button
                              onClick={() => setSelectedVideo(video)}
                              className="w-full relative block group"
                            >
                              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                                {video.thumbnail ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Play className="w-12 h-12 text-primary-500" />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors duration-300">
                                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-6 h-6 text-primary-600 ml-0.5" />
                                  </div>
                                </div>
                              </div>
                            </button>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{video.title}</h3>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{video.channel}</span>
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary-600 font-semibold hover:text-primary-700"
                                >
                                  Watch <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Articles */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-secondary-600" />
                      Reading List ({articles.length})
                    </h2>
                    <div className="space-y-4">
                      {articles.map((article, i) => (
                        <motion.a
                          key={article.id}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="block bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-secondary-600 bg-secondary-50 rounded-full px-2.5 py-1">
                              {article.source}
                            </span>
                            {article.publishedDate && (
                              <span className="text-xs text-gray-400">
                                {article.publishedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{article.title}</h3>
                          {article.description && (
                            <p className="text-xs text-gray-500 line-clamp-3">{article.description}</p>
                          )}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* Trending Topics */}
        <section className="mt-12 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            Trending Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map(topic => (
              <button
                key={topic}
                onClick={() => handleTrendingClick(topic)}
                className="text-sm px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full hover:from-primary-100 hover:to-secondary-100 transition-all duration-200 border border-primary-100"
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{selectedVideo.title}</h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Video className="w-4 h-4" />
                    {selectedVideo.channel}
                  </div>
                  {selectedVideo.description && (
                    <p className="text-gray-600 text-sm">{selectedVideo.description}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}