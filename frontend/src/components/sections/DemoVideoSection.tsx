'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Sparkles, Bot, Calculator, Languages } from 'lucide-react'

const VIDEO_ID = 'yz2bTPrCqD4'
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`
const THUMBNAIL = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`
const FALLBACK_THUMBNAIL = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`

const highlights = [
  { icon: Bot, label: 'AI Financial Coach' },
  { icon: Calculator, label: 'Live SIP & Tax Simulators' },
  { icon: Languages, label: '6+ Indian Languages' },
]

export default function DemoVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbnailSrc, setThumbnailSrc] = useState(THUMBNAIL)

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-gray-50 via-[#0d1420] to-[#070707]">
      {/* Ambient Glow */}
      <motion.div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-semibold text-white">Product Demo</span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">See Bharat Finance</span>{' '}
            <span className="bg-gradient-to-r from-primary-400 via-orange-400 to-secondary-400 bg-clip-text text-transparent">
              in Action
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Take a quick tour of the platform — from AI-powered investment guidance
            to multilingual financial literacy, all in under three minutes.
          </p>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow Frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/40 via-purple-500/40 to-secondary-500/40 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

          <div className="relative rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-black">
            {isPlaying ? (
              <div className="aspect-video">
                <iframe
                  src={EMBED_URL}
                  title="Bharat Finance Platform Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsPlaying(true)}
                className="group block w-full aspect-video relative focus:outline-none"
                aria-label="Play Bharat Finance demo video"
              >
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailSrc}
                  onError={() => setThumbnailSrc(FALLBACK_THUMBNAIL)}
                  alt="Bharat Finance demo video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:from-black/90 group-hover:via-black/40 transition-all duration-500" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/30"
                      animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-500/40"
                    >
                      <Play className="w-9 h-9 sm:w-11 sm:h-11 text-white ml-1 fill-current" />
                    </motion.div>
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                  <div className="text-left">
                    <h3 className="text-white font-bold text-base sm:text-xl mb-1 drop-shadow-lg">
                      Full Platform Tour
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      Dashboard · Investments · AI Coach · Policy Simulator & more
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                    HD
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Fallback link for restricted embeds */}
          {!isPlaying && (
            <a
              href={WATCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sr-only"
            >
              Watch on YouTube
            </a>
          )}
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          {highlights.map((item) => (
            <div
              key={item.label}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2.5"
            >
              <item.icon className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-gray-200">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
