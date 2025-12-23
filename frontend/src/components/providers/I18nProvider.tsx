'use client'

import '@/lib/i18n' // Import to initialize i18n

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // No loading state - render immediately
  return <>{children}</>
}