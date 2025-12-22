import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '@/lib/i18n' // Initialize i18n

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bharat Finance & Policy Simulator',
  description: 'Social-impact platform for financial literacy and AI-guided personal finance in India',
  keywords: 'finance, investment, tax, insurance, mandi, agriculture, India, financial literacy',
  authors: [{ name: 'Bharat Finance Team' }],
  openGraph: {
    title: 'Bharat Finance & Policy Simulator',
    description: 'Democratizing financial knowledge for every Indian',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bharat Finance & Policy Simulator',
    description: 'Financial literacy and AI-guided personal finance for India',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  )
}