'use client'

import React from 'react'

interface TranslationFallbackProps {
  children: React.ReactNode
  fallback?: string
}

const TranslationFallback: React.FC<TranslationFallbackProps> = ({ 
  children, 
  fallback = 'Loading...' 
}) => {
  return (
    <React.Suspense fallback={<span>{fallback}</span>}>
      {children}
    </React.Suspense>
  )
}

export default TranslationFallback