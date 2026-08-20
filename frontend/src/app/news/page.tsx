'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Newspaper,
  RefreshCw,
  Clock,
  ExternalLink,
  CheckCircle2,
  PlusCircle,
  Loader2,
  Radio,
  TrendingUp,
} from 'lucide-react'
import {
  newsService,
  NewsArticle,
  NEWS_TOPICS,
  NewsTopic,
  STORAGE_KEY,
} from '@/services/newsService'

export default function NewsPage() {
  const { t } = useTranslation()
  const [followedTopics, setFollowedTopics] = useState<NewsTopic[]>([])
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadPreferences = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const ids = JSON.parse(stored) as string[]
        const topics = NEWS_TOPICS.filter(topic => ids.includes(topic.id))
        return topics.length > 0 ? topics : [NEWS_TOPICS[0], NEWS_TOPICS[1]]
      }
    } catch (error) {
      console.error('Error loading news preferences:', error)
    }
    return [NEWS_TOPICS[0], NEWS_TOPICS[1]]
  }, [])

  const savePreferences = (topics: NewsTopic[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(topics.map(t => t.id)))
    } catch (error) {
      console.error('Error saving news preferences:', error)
    }
  }

  const fetchNews = useCallback(async (topics: NewsTopic[]) => {
    setLoading(true)
    try {
      const queries = topics.map(t => t.query)
      const results = await newsService.getFollowedNews(queries, 5)

      const combined: NewsArticle[] = []
      const seen = new Set<string>()
      for (const article of results) {
        if (!seen.has(article.id)) {
          seen.add(article.id)
          combined.push(article)
        }
      }
      setArticles(combined.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()))
    } catch (error) {
      console.error('News fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const topics = loadPreferences()
    setFollowedTopics(topics)
    fetchNews(topics)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleTopic = (topic: NewsTopic) => {
    let updated: NewsTopic[]
    if (followedTopics.some(t => t.id === topic.id)) {
      updated = followedTopics.filter(t => t.id !== topic.id)
    } else {
      updated = [...followedTopics, topic]
    }
    setFollowedTopics(updated)
    savePreferences(updated)
    fetchNews(updated)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNews(followedTopics)
    setRefreshing(false)
  }

  const timeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full px-6 py-3 mb-6">
            <Newspaper className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Personalized Updates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('news.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Follow the topics that matter to you and get all the latest updates
            delivered in one place. Powered by NewsAPI.
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>{t('common.refresh')}</span>
          </button>
        </div>

        {/* Topic Selection */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary-600" />
            What do you want to follow?
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Select topics to receive the latest news updates. Your preferences are saved on this device.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {NEWS_TOPICS.map((topic, i) => {
              const isFollowed = followedTopics.some(t => t.id === topic.id)
              return (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => toggleTopic(topic)}
                  className={`relative flex flex-col items-start text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                    isFollowed
                      ? 'bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-400 shadow-md'
                      : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-2xl">{topic.icon}</span>
                    {isFollowed ? (
                      <CheckCircle2 className="w-5 h-5 text-success-500" />
                    ) : (
                      <PlusCircle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <span className={`font-semibold text-sm ${isFollowed ? 'text-primary-700' : 'text-gray-700'}`}>
                    {topic.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* News Feed */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary-600" />
              Latest Updates
            </h2>
            {followedTopics.length > 0 && (
              <span className="text-xs text-gray-500">
                {t('news.following')} {followedTopics.length} {followedTopics.length === 1 ? 'topic' : 'topics'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                {followedTopics.length === 0
                  ? 'You are not following any topics yet. Select topics above to see news.'
                  : 'No news found for your followed topics. Try again or follow different topics.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {articles.map((article, i) => (
                  <motion.a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-hover flex flex-col"
                  >
                    {article.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                        onError={e => {
                          ;(e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary-700 bg-primary-50 rounded-full px-2.5 py-1">
                          {article.source}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(article.publishedAt)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-3 mb-3 flex-1">{article.description}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-secondary-600 font-semibold">
                        {t('news.readMore')} <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Disclaimer */}
        <div className="mt-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-700">Disclaimer:</strong> News articles are aggregated from third-party
            sources via NewsAPI for informational purposes only. Bharat Finance does not endorse any news source
            and is not responsible for the accuracy or content of external articles. Headlines may include
            simulated content when the API is unavailable.
          </p>
        </div>
      </div>
    </div>
  )
}