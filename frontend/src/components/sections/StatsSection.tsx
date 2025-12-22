'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, BookOpen, Calculator } from 'lucide-react'

const stats = [
  {
    id: 1,
    name: 'Investment Calculations',
    value: '10,000+',
    icon: Calculator,
    description: 'Simulations completed',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 2,
    name: 'Active Users',
    value: '5,000+',
    icon: Users,
    description: 'Making smarter decisions',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 3,
    name: 'Lessons Completed',
    value: '25,000+',
    icon: BookOpen,
    description: 'Financial education milestones',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 4,
    name: 'Average Returns',
    value: '12.5%',
    icon: TrendingUp,
    description: 'Projected annual growth',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
]

export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Indians
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform is helping people across India make better financial decisions every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className={`${stat.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-gray-900 mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {stat.name}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Growing Every Day
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              From students learning their first financial concepts to farmers optimizing their crop sales, 
              our platform serves diverse users across India with localized, AI-powered financial guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white px-4 py-2 rounded-full text-gray-700 font-medium">
                🎓 Students & Young Professionals
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-gray-700 font-medium">
                👨‍💼 Salaried Individuals
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-gray-700 font-medium">
                🏪 Small Business Owners
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-gray-700 font-medium">
                🌾 Farmers & Rural Users
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}