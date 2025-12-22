'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.tools': 'Tools',
      'nav.investment': 'Investment Calculator',
      'nav.budget': 'Budget Analyzer',
      'nav.mutualFunds': 'Mutual Funds',
      'nav.policySimulator': 'Policy Simulator',
      'nav.aiCoach': 'AI Coach',
      'nav.learning': 'Learning',
      'nav.mandi': 'Mandi',
      
      // Hero Section
      'hero.title': 'Future of Financial Freedom',
      'hero.subtitle': 'Democratizing financial knowledge for every Indian with AI-powered insights, real-time data, and personalized guidance',
      'hero.launchDashboard': 'Launch Dashboard',
      'hero.tryBudget': 'Try Budget Analyzer',
      'hero.aiPowered': 'AI-Powered Financial Intelligence',
      
      // Features
      'features.title': 'Everything You Need for Financial Success',
      'features.subtitle': 'From AI-powered investment advice to real-time policy analysis, we\'ve built the most comprehensive financial platform for India',
      'features.smartInvestment': 'Smart Investment Calculator',
      'features.smartInvestmentDesc': 'AI-powered SIP, PPF, NPS calculations with real-time mutual fund data',
      'features.budgetAnalyzer': 'Professional Budget Analyzer',
      'features.budgetAnalyzerDesc': 'Intelligent expense tracking with personalized recommendations',
      'features.aiCoach': 'AI Finance Coach',
      'features.aiCoachDesc': 'Get personalized financial advice from our advanced AI assistant',
      'features.mutualFunds': 'Mutual Fund Recommendations',
      'features.mutualFundsDesc': 'Real-time fund analysis with performance metrics and ratings',
      'features.policySimulator': 'Policy Impact Simulator',
      'features.policySimulatorDesc': 'Understand how government policies affect your finances',
      'features.learning': 'Multi-language Learning',
      'features.learningDesc': 'Financial education in 6+ Indian languages with interactive content',
      
      // AI Coach
      'aiCoach.title': 'Your Personal AI Finance Coach',
      'aiCoach.subtitle': 'Get instant, personalized financial advice powered by advanced AI',
      'aiCoach.welcome': 'Hello! I\'m your AI Finance Coach. You can speak to me or type your questions. How can I help you today?',
      'aiCoach.placeholder': 'Ask me anything about finance, investments, budgeting...',
      'aiCoach.placeholderVoice': 'Type your message or click the mic to speak...',
      'aiCoach.error': 'Sorry, I encountered an error. Please try again.',
      'aiCoach.send': 'Send',
      'aiCoach.listening': 'Listening...',
      'aiCoach.speaking': 'Speaking...',
      'aiCoach.voiceInput': 'Voice Input',
      'aiCoach.suggestions.investment': 'How should I start investing?',
      'aiCoach.suggestions.budget': 'Help me create a budget',
      'aiCoach.suggestions.tax': 'Tax saving strategies',
      'aiCoach.suggestions.emergency': 'Emergency fund planning',
      
      // Budget Analyzer
      'budget.title': 'Professional Budget Analyzer',
      'budget.subtitle': 'Get AI-powered budget analysis with personalized recommendations',
      'budget.monthlyIncome': 'Monthly Income',
      'budget.expenses': 'Monthly Expenses',
      'budget.totalExpenses': 'Total Expenses',
      'budget.savingsRate': 'Savings Rate',
      'budget.monthlySurplus': 'Monthly Surplus',
      'budget.budgetScore': 'Budget Score',
      'budget.essential': 'Essential Expenses',
      'budget.discretionary': 'Discretionary Spending',
      'budget.savings': 'Savings & Investments',
      
      // Investment Calculator
      'investment.title': 'Professional Investment Calculator',
      'investment.subtitle': 'Calculate returns for SIP, PPF, NPS, and more with real mutual fund recommendations',
      'investment.monthlyAmount': 'Monthly Investment',
      'investment.expectedReturn': 'Expected Annual Return',
      'investment.period': 'Investment Period',
      'investment.currentAge': 'Current Age',
      'investment.calculate': 'Calculate Returns',
      'investment.totalInvested': 'Total Invested',
      'investment.maturityAmount': 'Maturity Amount',
      'investment.totalReturns': 'Total Returns',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.continue': 'Continue',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.close': 'Close',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.currency': '₹',
    }
  },
  hi: {
    translation: {
      // Navigation
      'nav.home': 'होम',
      'nav.dashboard': 'डैशबोर्ड',
      'nav.tools': 'उपकरण',
      'nav.investment': 'निवेश कैलकुलेटर',
      'nav.budget': 'बजट विश्लेषक',
      'nav.mutualFunds': 'म्यूचुअल फंड',
      'nav.policySimulator': 'नीति सिमुलेटर',
      'nav.aiCoach': 'AI कोच',
      'nav.learning': 'सीखना',
      'nav.mandi': 'मंडी',
      
      // Hero Section
      'hero.title': 'वित्तीय स्वतंत्रता का भविष्य',
      'hero.subtitle': 'AI-संचालित अंतर्दृष्टि, रीयल-टाइम डेटा और व्यक्तिगत मार्गदर्शन के साथ हर भारतीय के लिए वित्तीय ज्ञान का लोकतंत्रीकरण',
      'hero.launchDashboard': 'डैशबोर्ड लॉन्च करें',
      'hero.tryBudget': 'बजट विश्लेषक आज़माएं',
      'hero.aiPowered': 'AI-संचालित वित्तीय बुद्धिमत्ता',
      
      // Features
      'features.title': 'वित्तीय सफलता के लिए आपको जो कुछ भी चाहिए',
      'features.subtitle': 'AI-संचालित निवेश सलाह से लेकर रीयल-टाइम नीति विश्लेषण तक, हमने भारत के लिए सबसे व्यापक वित्तीय प्लेटफॉर्म बनाया है',
      'features.smartInvestment': 'स्मार्ट निवेश कैलकुलेटर',
      'features.smartInvestmentDesc': 'रीयल-टाइम म्यूचुअल फंड डेटा के साथ AI-संचालित SIP, PPF, NPS गणना',
      'features.budgetAnalyzer': 'पेशेवर बजट विश्लेषक',
      'features.budgetAnalyzerDesc': 'व्यक्तिगत सिफारिशों के साथ बुद्धिमान व्यय ट्रैकिंग',
      'features.aiCoach': 'AI वित्त कोच',
      'features.aiCoachDesc': 'हमारे उन्नत AI सहायक से व्यक्तिगत वित्तीय सलाह प्राप्त करें',
      'features.mutualFunds': 'म्यूचुअल फंड सिफारिशें',
      'features.mutualFundsDesc': 'प्रदर्शन मेट्रिक्स और रेटिंग के साथ रीयल-टाइम फंड विश्लेषण',
      'features.policySimulator': 'नीति प्रभाव सिमुलेटर',
      'features.policySimulatorDesc': 'समझें कि सरकारी नीतियां आपके वित्त को कैसे प्रभावित करती हैं',
      'features.learning': 'बहुभाषी शिक्षा',
      'features.learningDesc': 'इंटरैक्टिव सामग्री के साथ 6+ भारतीय भाषाओं में वित्तीय शिक्षा',
      
      // AI Coach
      'aiCoach.title': 'आपका व्यक्तिगत AI वित्त कोच',
      'aiCoach.subtitle': 'उन्नत AI द्वारा संचालित तत्काल, व्यक्तिगत वित्तीय सलाह प्राप्त करें',
      'aiCoach.welcome': 'नमस्ते! मैं आपका AI वित्त कोच हूं। आप मुझसे बात कर सकते हैं या अपने प्रश्न टाइप कर सकते हैं। आज मैं आपकी कैसे मदद कर सकता हूं?',
      'aiCoach.placeholder': 'वित्त, निवेश, बजट के बारे में कुछ भी पूछें...',
      'aiCoach.placeholderVoice': 'अपना संदेश टाइप करें या बोलने के लिए माइक पर क्लिक करें...',
      'aiCoach.error': 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।',
      'aiCoach.send': 'भेजें',
      'aiCoach.listening': 'सुन रहा है...',
      'aiCoach.speaking': 'बोल रहा है...',
      'aiCoach.voiceInput': 'आवाज इनपुट',
      'aiCoach.suggestions.investment': 'मुझे निवेश कैसे शुरू करना चाहिए?',
      'aiCoach.suggestions.budget': 'बजट बनाने में मदद करें',
      'aiCoach.suggestions.tax': 'कर बचत रणनीतियां',
      'aiCoach.suggestions.emergency': 'आपातकालीन फंड योजना',
      
      // Budget Analyzer
      'budget.title': 'पेशेवर बजट विश्लेषक',
      'budget.subtitle': 'व्यक्तिगत सिफारिशों के साथ AI-संचालित बजट विश्लेषण प्राप्त करें',
      'budget.monthlyIncome': 'मासिक आय',
      'budget.expenses': 'मासिक खर्च',
      'budget.totalExpenses': 'कुल खर्च',
      'budget.savingsRate': 'बचत दर',
      'budget.monthlySurplus': 'मासिक अधिशेष',
      'budget.budgetScore': 'बजट स्कोर',
      'budget.essential': 'आवश्यक खर्च',
      'budget.discretionary': 'विवेकाधीन खर्च',
      'budget.savings': 'बचत और निवेश',
      
      // Investment Calculator
      'investment.title': 'पेशेवर निवेश कैलकुलेटर',
      'investment.subtitle': 'वास्तविक म्यूचुअल फंड सिफारिशों के साथ SIP, PPF, NPS और अधिक के लिए रिटर्न की गणना करें',
      'investment.monthlyAmount': 'मासिक निवेश',
      'investment.expectedReturn': 'अपेक्षित वार्षिक रिटर्न',
      'investment.period': 'निवेश अवधि',
      'investment.currentAge': 'वर्तमान आयु',
      'investment.calculate': 'रिटर्न की गणना करें',
      'investment.totalInvested': 'कुल निवेश',
      'investment.maturityAmount': 'परिपक्वता राशि',
      'investment.totalReturns': 'कुल रिटर्न',
      
      // Common
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      'common.save': 'सेव करें',
      'common.cancel': 'रद्द करें',
      'common.continue': 'जारी रखें',
      'common.back': 'वापस',
      'common.next': 'अगला',
      'common.previous': 'पिछला',
      'common.close': 'बंद करें',
      'common.search': 'खोजें',
      'common.filter': 'फिल्टर',
      'common.currency': '₹',
    }
  },
  // Add more languages as needed
}

// Initialize i18n only on client side
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
    })
} else {
  // Server-side fallback
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },
    })
}

export default i18n