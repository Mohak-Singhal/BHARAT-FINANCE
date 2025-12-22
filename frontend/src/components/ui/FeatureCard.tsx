'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  color: string
}

export default function FeatureCard({ icon: Icon, title, description, href, color }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={href}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full hover:shadow-lg transition-all duration-300 group-hover:border-primary-200">
          <div className="flex items-center mb-4">
            <div className={`${color} rounded-lg p-3 mr-4`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              {title}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-200">
            <span className="text-sm">Learn more</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}