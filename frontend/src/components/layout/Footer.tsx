'use client'

import Link from 'next/link'
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart,
  Calculator,
  Bot,
  FileText,
  BookOpen,
  Wheat
} from 'lucide-react'

const footerNavigation = {
  platform: [
    { name: 'Investment Simulator', href: '/investment', icon: Calculator },
    { name: 'AI Finance Coach', href: '/ai-coach', icon: Bot },
    { name: 'Policy Simulator', href: '/policy', icon: FileText },
    { name: 'Financial Literacy', href: '/literacy', icon: BookOpen },
    { name: 'Mandi Support', href: '/mandi', icon: Wheat },
  ],
  resources: [
    { name: 'API Documentation', href: '/docs' },
    { name: 'User Guide', href: '/guide' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Tutorials', href: '/tutorials' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Report Bug', href: '/bug-report' },
    { name: 'Feature Request', href: '/feature-request' },
    { name: 'Status', href: '/status' },
  ],
}

const socialLinks = [
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Email', href: 'mailto:contact@bharatfinance.com', icon: Mail },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                <div className="flag-orange w-2 h-6 rounded-sm"></div>
                <div className="flag-white w-2 h-6 rounded-sm"></div>
                <div className="flag-green w-2 h-6 rounded-sm"></div>
              </div>
              <span className="text-xl font-bold">Bharat Finance</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Democratizing financial knowledge for every Indian. 
              Built with ❤️ for financial inclusion.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {footerNavigation.platform.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerNavigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Get the latest financial insights and platform updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for financial inclusion in India</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <span>© 2024 Bharat Finance Platform. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <span>Powered by</span>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    FastAPI
                  </span>
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Gemini AI
                  </span>
                  <span className="bg-black text-white px-2 py-1 rounded text-xs font-medium">
                    Next.js
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-300">Disclaimer:</strong> This platform is for educational purposes only. 
              Investment advice is general in nature and not personalized. Mutual fund investments are subject to market risks. 
              Please read all scheme-related documents carefully before investing. Past performance does not guarantee future returns. 
              Consult a certified financial advisor before making investment decisions. Tax calculations are approximate and may vary based on individual circumstances.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}