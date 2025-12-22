'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Software Engineer, Bangalore',
    content: 'The AI coach helped me understand SIP investments in simple terms. I started with ₹5,000/month and now I\'m confident about my financial future.',
    rating: 5,
    avatar: '👩‍💻'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    role: 'Farmer, Punjab',
    content: 'Mandi price feature saved me ₹15,000 on my wheat sale. The transport cost calculator is brilliant for finding the best markets.',
    rating: 5,
    avatar: '👨‍🌾'
  },
  {
    id: 3,
    name: 'Anita Patel',
    role: 'Teacher, Gujarat',
    content: 'Learning about tax savings in Gujarati made it so much easier. The platform explains everything in simple language.',
    rating: 5,
    avatar: '👩‍🏫'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Small Business Owner, Delhi',
    content: 'Policy simulator showed me exactly how GST changes affect my business. Now I can plan better for policy changes.',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    id: 5,
    name: 'Meera Reddy',
    role: 'Student, Hyderabad',
    content: 'Started learning about investments while in college. The Telugu lessons made financial concepts crystal clear.',
    rating: 5,
    avatar: '👩‍🎓'
  },
  {
    id: 6,
    name: 'Arjun Das',
    role: 'IT Professional, Kolkata',
    content: 'The retirement calculator opened my eyes. I increased my PPF contribution after seeing the long-term projections.',
    rating: 5,
    avatar: '👨‍💻'
  }
]

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real people who transformed their financial lives with our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="h-8 w-8 text-primary-200" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="text-2xl mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Thousands of Happy Users
            </h3>
            <p className="text-gray-600 mb-6">
              Start your financial journey today and become the next success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Get Started Free
              </button>
              <button className="btn-outline">
                Watch Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}