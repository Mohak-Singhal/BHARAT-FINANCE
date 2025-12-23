'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Calculator, 
  Bot, 
  FileText, 
  BookOpen,
  TrendingUp,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Globe,
  BarChart3,
  PieChart,
  DollarSign,
  Award,
  Rocket,
  Brain,
  Heart
} from 'lucide-react'
import StatsSection from '@/components/sections/StatsSection'
import TestimonialSection from '@/components/sections/TestimonialSection'
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard'

const features = [
  {
    icon: Calculator,
    title: 'features.investment.title',
    description: 'features.investment.description',
    href: '/investment',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50'
  },
  {
    icon: BarChart3,
    title: 'features.budget.title',
    description: 'features.budget.description',
    href: '/budget',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50'
  },
  {
    icon: Bot,
    title: 'features.aiCoach.title',
    description: 'features.aiCoach.description',
    href: '/ai-coach',
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50'
  },
  {
    icon: PieChart,
    title: 'features.mutualFunds.title',
    description: 'features.mutualFunds.description',
    href: '/mutual-funds',
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50'
  },
  {
    icon: FileText,
    title: 'features.policy.title',
    description: 'features.policy.description',
    href: '/policy-simulator',
    color: 'from-indigo-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50'
  },
  {
    icon: BookOpen,
    title: 'features.literacy.title',
    description: 'features.literacy.description',
    href: '/literacy',
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-50 to-pink-50'
  },
]

const stats = [
  { label: 'stats.users', value: '50K+', icon: Users },
  { label: 'stats.calculations', value: '1M+', icon: Calculator },
  { label: 'stats.languages', value: '6+', icon: Globe },
  { label: 'stats.success', value: '98%', icon: Target },
]

const floatingElements = [
  { icon: TrendingUp, delay: 0, x: '10%', y: '20%' },
  { icon: DollarSign, delay: 0.5, x: '80%', y: '15%' },
  { icon: PieChart, delay: 1, x: '15%', y: '70%' },
  { icon: BarChart3, delay: 1.5, x: '85%', y: '75%' },
  { icon: Target, delay: 2, x: '50%', y: '10%' },
  { icon: Award, delay: 2.5, x: '90%', y: '45%' },
]

export default function HomePage() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const { t } = useTranslation()
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      x.set(e.clientX / 50)
      y.set(e.clientY / 50)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, y])

  if (showDashboard) {
    return <ProfessionalDashboard />
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        
        {/* Floating Geometric Shapes */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute w-8 h-8 text-primary-200"
            style={{
              left: element.x,
              top: element.y,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          >
            <element.icon className="w-full h-full" />
          </motion.div>
        ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Mouse Follower */}
      <motion.div
        className="fixed w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: y1, opacity }}
          className="max-w-7xl mx-auto text-center"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-white/20"
          >
            <Sparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              AI-Powered Financial Intelligence
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="block">{t('hero.title_part1')}</span>
            <span className="block bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
              {t('hero.title_part2')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl sm:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              onClick={() => setShowDashboard(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-3">
                <Rocket className="w-6 h-6" />
                <span>{t('hero.launchDashboard')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.button>

            <motion.div
              className="group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/budget"
                className="flex items-center space-x-3 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 rounded-2xl font-semibold text-lg shadow-xl border border-white/20 hover:bg-white/90 transition-all duration-300"
              >
                <Brain className="w-6 h-6 text-primary-500" />
                <span>{t('hero.tryBudget')}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{t(stat.label)}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          style={{ y: y2 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full px-6 py-3 mb-6">
              <Zap className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Powerful Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Financial Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-powered investment advice to real-time policy analysis, 
              we've built the most comprehensive financial platform for India
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link href={feature.href}>
                  <div className={`${feature.gradient} p-8 rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 h-full`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {t(feature.title)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {t(feature.description)}
                    </p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>{t('common.exploreFeature')}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-gradient">Bharat Finance?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for the Indian financial ecosystem with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                {[
                  { icon: Brain, title: "AI-Powered Intelligence", desc: "Advanced algorithms provide personalized financial insights" },
                  { icon: Shield, title: "Bank-Grade Security", desc: "Your financial data is protected with enterprise-level encryption" },
                  { icon: Globe, title: "Multi-Language Support", desc: "Available in 6+ Indian languages for inclusive access" },
                  { icon: Zap, title: "Real-Time Updates", desc: "Live market data and instant policy impact analysis" },
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/80 text-sm">Portfolio Value</span>
                    <TrendingUp className="w-5 h-5 text-green-300" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">₹12,45,000</div>
                  <div className="text-green-300 text-sm">+8.5% this month</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-white/80 text-xs mb-1">SIP Returns</div>
                    <div className="text-white font-bold">14.2%</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-white/80 text-xs mb-1">Goal Progress</div>
                    <div className="text-white font-bold">68%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary-600 via-secondary-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-semibold">Join 50,000+ Happy Users</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
              Ready to Transform Your
              <span className="block">Financial Future?</span>
            </h2>
            
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              Join thousands of Indians who are already making smarter financial decisions 
              with our AI-powered platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={() => setShowDashboard(true)}
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:scale-105"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-3">
                  <Rocket className="w-6 h-6" />
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.button>
              
              <motion.div
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/literacy"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-8 rounded-2xl transition-all duration-300 inline-flex items-center space-x-3"
                >
                  <BookOpen className="w-6 h-6" />
                  <span>Learn First</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}