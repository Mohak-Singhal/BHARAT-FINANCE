'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Language {
  code: string
  name: string
  native: string
  flag: string
}

interface LanguageContextType {
  currentLanguage: string
  setLanguage: (code: string) => void
  languages: Language[]
  t: (key: string) => string
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
]

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
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
    'hero.title': 'Future of Financial Freedom',
    'hero.subtitle': 'Democratizing financial knowledge for every Indian with AI-powered insights, real-time data, and personalized guidance',
    'hero.launchDashboard': 'Launch Dashboard',
    'hero.tryBudget': 'Try Budget Analyzer',
    'hero.aiPowered': 'AI-Powered Financial Intelligence',
    'features.title': 'Everything You Need for Financial Success',
    'features.subtitle': 'From AI-powered investment advice to real-time policy analysis, we\'ve built the most comprehensive financial platform for India',
    'aiCoach.title': 'Your Personal AI Finance Coach',
    'aiCoach.subtitle': 'Get instant, personalized financial advice powered by advanced AI',
    'aiCoach.welcome': 'Hello! I\'m your AI Finance Coach. You can speak to me or type your questions. How can I help you today?',
    'aiCoach.placeholder': 'Ask me anything about finance, investments, budgeting...',
    'aiCoach.placeholderVoice': 'Type your message or click the mic to speak...',
    'aiCoach.error': 'Sorry, I encountered an error. Please try again.',
    'aiCoach.suggestions.investment': 'Help me plan my investments',
    'aiCoach.suggestions.budget': 'Create a monthly budget',
    'aiCoach.suggestions.tax': 'Tax saving strategies',
    'aiCoach.suggestions.emergency': 'Emergency fund planning',
  },
  hi: {
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
    'hero.title': 'वित्तीय स्वतंत्रता का भविष्य',
    'hero.subtitle': 'AI-संचालित अंतर्दृष्टि, रीयल-टाइम डेटा और व्यक्तिगत मार्गदर्शन के साथ हर भारतीय के लिए वित्तीय ज्ञान का लोकतंत्रीकरण',
    'hero.launchDashboard': 'डैशबोर्ड लॉन्च करें',
    'hero.tryBudget': 'बजट विश्लेषक आज़माएं',
    'hero.aiPowered': 'AI-संचालित वित्तीय बुद्धिमत्ता',
    'features.title': 'वित्तीय सफलता के लिए आपको जो कुछ भी चाहिए',
    'features.subtitle': 'AI-संचालित निवेश सलाह से लेकर रीयल-टाइम नीति विश्लेषण तक, हमने भारत के लिए सबसे व्यापक वित्तीय प्लेटफॉर्म बनाया है',
    'aiCoach.title': 'आपका व्यक्तिगत AI वित्त कोच',
    'aiCoach.subtitle': 'उन्नत AI द्वारा संचालित तत्काल, व्यक्तिगत वित्तीय सलाह प्राप्त करें',
    'aiCoach.welcome': 'नमस्ते! मैं आपका AI वित्त कोच हूं। आप मुझसे बात कर सकते हैं या अपने प्रश्न टाइप कर सकते हैं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    'aiCoach.placeholder': 'वित्त, निवेश, बजट के बारे में कुछ भी पूछें...',
    'aiCoach.placeholderVoice': 'अपना संदेश टाइप करें या बोलने के लिए माइक पर क्लिक करें...',
    'aiCoach.error': 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।',
    'aiCoach.suggestions.investment': 'निवेश योजना में मदद करें',
    'aiCoach.suggestions.budget': 'मासिक बजट बनाएं',
    'aiCoach.suggestions.tax': 'कर बचत रणनीतियां',
    'aiCoach.suggestions.emergency': 'आपातकालीन फंड योजना',
  },
  mr: {
    'nav.home': 'मुख्यपृष्ठ',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.tools': 'साधने',
    'nav.investment': 'गुंतवणूक कॅल्क्युलेटर',
    'nav.budget': 'बजेट विश्लेषक',
    'nav.mutualFunds': 'म्युच्युअल फंड',
    'nav.policySimulator': 'धोरण सिम्युलेटर',
    'nav.aiCoach': 'AI प्रशिक्षक',
    'nav.learning': 'शिकणे',
    'nav.mandi': 'मंडी',
    'hero.title': 'आर्थिक स्वातंत्र्याचे भविष्य',
    'hero.subtitle': 'AI-चालित अंतर्दृष्टी, रिअल-टाइम डेटा आणि वैयक्तिक मार्गदर्शनासह प्रत्येक भारतीयासाठी आर्थिक ज्ञानाचे लोकशाहीकरण',
    'hero.launchDashboard': 'डॅशबोर्ड लॉन्च करा',
    'hero.tryBudget': 'बजेट विश्लेषक वापरून पहा',
    'features.title': 'आर्थिक यशासाठी आपल्याला आवश्यक असलेले सर्वकाही',
    'features.subtitle': 'AI-चालित गुंतवणूक सल्ल्यापासून रिअल-टाइम धोरण विश्लेषणापर्यंत, आम्ही भारतासाठी सर्वात व्यापक आर्थिक प्लॅटफॉर्म तयार केले आहे',
  },
  ta: {
    'nav.home': 'முகப்பு',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.tools': 'கருவிகள்',
    'nav.investment': 'முதலீட்டு கணிப்பான்',
    'nav.budget': 'பட்ஜெட் பகுப்பாய்வி',
    'nav.mutualFunds': 'மியூச்சுவல் ஃபண்ட்',
    'nav.policySimulator': 'கொள்கை சிமுலேட்டர்',
    'nav.aiCoach': 'AI பயிற்சியாளர்',
    'nav.learning': 'கற்றல்',
    'nav.mandi': 'மண்டி',
    'hero.title': 'நிதி சுதந்திரத்தின் எதிர்காலம்',
    'hero.subtitle': 'AI-இயங்கும் நுண்ணறிவு, நிகழ்நேர தரவு மற்றும் தனிப்பட்ட வழிகாட்டுதலுடன் ஒவ்வொரு இந்தியருக்கும் நிதி அறிவை ஜனநாயகமாக்குதல்',
    'hero.launchDashboard': 'டாஷ்போர்டை தொடங்கவும்',
    'hero.tryBudget': 'பட்ஜெட் பகுப்பாய்வியை முயற்சிக்கவும்',
    'features.title': 'நிதி வெற்றிக்கு தேவையான அனைத்தும்',
    'features.subtitle': 'AI-இயங்கும் முதலீட்டு ஆலோசனையிலிருந்து நிகழ்நேர கொள்கை பகுப்பாய்வு வரை, இந்தியாவிற்கான மிக விரிவான நிதி தளத்தை நாங்கள் உருவாக்கியுள்ளோம்',
  },
  te: {
    'nav.home': 'హోమ్',
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.tools': 'సాధనాలు',
    'nav.investment': 'పెట్టుబడి కాలిక్యులేటర్',
    'nav.budget': 'బడ్జెట్ విశ్లేషకుడు',
    'nav.mutualFunds': 'మ్యూచువల్ ఫండ్స్',
    'nav.policySimulator': 'పాలసీ సిమ్యులేటర్',
    'nav.aiCoach': 'AI కోచ్',
    'nav.learning': 'నేర్చుకోవడం',
    'nav.mandi': 'మండి',
    'hero.title': 'ఆర్థిక స్వేచ్ఛ యొక్క భవిష్యత్తు',
    'hero.subtitle': 'AI-శక్తితో కూడిన అంతర్దృష్టులు, రియల్-టైమ్ డేటా మరియు వ్యక్తిగత మార్గదర్శకత్వంతో ప్రతి భారతీయుడికి ఆర్థిక జ్ఞానాన్ని ప్రజాస్వామ్యీకరించడం',
    'hero.launchDashboard': 'డాష్‌బోర్డ్‌ను ప్రారంభించండి',
    'hero.tryBudget': 'బడ్జెట్ విశ్లేషకుడిని ప్రయత్నించండి',
    'features.title': 'ఆర్థిక విజయానికి మీకు అవసరమైనవన్నీ',
    'features.subtitle': 'AI-శక్తితో కూడిన పెట్టుబడి సలహా నుండి రియల్-టైమ్ పాలసీ విశ్లేషణ వరకు, మేము భారతదేశం కోసం అత్యంత సమగ్రమైన ఆర్థిక వేదికను నిర్మించాము',
  },
  bn: {
    'nav.home': 'হোম',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.tools': 'সরঞ্জাম',
    'nav.investment': 'বিনিয়োগ ক্যালকুলেটর',
    'nav.budget': 'বাজেট বিশ্লেষক',
    'nav.mutualFunds': 'মিউচুয়াল ফান্ড',
    'nav.policySimulator': 'নীতি সিমুলেটর',
    'nav.aiCoach': 'AI কোচ',
    'nav.learning': 'শেখা',
    'nav.mandi': 'মান্ডি',
    'hero.title': 'আর্থিক স্বাধীনতার ভবিষ্যৎ',
    'hero.subtitle': 'AI-চালিত অন্তর্দৃষ্টি, রিয়েল-টাইম ডেটা এবং ব্যক্তিগত নির্দেশনা সহ প্রতিটি ভারতীয়ের জন্য আর্থিক জ্ঞানের গণতন্ত্রীকরণ',
    'hero.launchDashboard': 'ড্যাশবোর্ড চালু করুন',
    'hero.tryBudget': 'বাজেট বিশ্লেষক চেষ্টা করুন',
    'features.title': 'আর্থিক সাফল্যের জন্য আপনার যা প্রয়োজন সব কিছু',
    'features.subtitle': 'AI-চালিত বিনিয়োগ পরামর্শ থেকে রিয়েল-টাইম নীতি বিশ্লেষণ পর্যন্ত, আমরা ভারতের জন্য সবচেয়ে ব্যাপক আর্থিক প্ল্যাটফর্ম তৈরি করেছি',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Load saved language from localStorage (only on client)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage')
      if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage)
      }

      // Listen for language change events
      const handleLanguageChange = (event: CustomEvent) => {
        setCurrentLanguage(event.detail)
      }

      window.addEventListener('languageChange', handleLanguageChange as EventListener)
      return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener)
    }
  }, [])

  const setLanguage = (code: string) => {
    setCurrentLanguage(code)
    
    // Only use localStorage and window on client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', code)
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('languageChange', { detail: code }))
    }
  }

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      languages,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}