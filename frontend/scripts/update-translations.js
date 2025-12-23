#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '../public/locales')

// Read the English translation as template
const enTranslation = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en/translation.json'), 'utf8'))

// Language mappings for the missing translations
const translations = {
  te: {
    "hero": {
      "title_part1": "భారత్ ఫైనాన్స్",
      "title_part2": "ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్",
      "subtitle": "ప్రతి భారతీయుడిని AI-శక్తితో కూడిన ఆర్థిక మేధస్సు, రియల్-టైమ్ మార్కెట్ అంతర్దృష్టులు మరియు మీ ఇష్టమైన భాషలో వ్యక్తిగతీకరించిన పెట్టుబడి వ్యూహాలతో శక్తివంతం చేయడం.",
      "launchDashboard": "డ్యాష్‌బోర్డ్ లాంచ్ చేయండి",
      "tryBudget": "బడ్జెట్ ఎనలైజర్ ప్రయత్నించండి"
    },
    "features": {
      "investment": {
        "title": "స్మార్ట్ ఇన్వెస్ట్‌మెంట్ కాలిక్యులేటర్",
        "description": "రియల్-టైమ్ మ్యూచువల్ ఫండ్ డేటాతో AI-శక్తితో కూడిన SIP, PPF, NPS లెక్కలు"
      },
      "budget": {
        "title": "ప్రొఫెషనల్ బడ్జెట్ ఎనలైజర్",
        "description": "వ్యక్తిగతీకరించిన సిఫార్సులతో తెలివైన ఖర్చు ట్రాకింగ్"
      },
      "aiCoach": {
        "title": "AI ఫైనాన్స్ కోచ్",
        "description": "మా అధునాతన AI అసిస్టెంట్ నుండి వ్యక్తిగతీకరించిన ఆర్థిక సలహా పొందండి"
      },
      "mutualFunds": {
        "title": "మ్యూచువల్ ఫండ్ సిఫార్సులు",
        "description": "పనితీరు మెట్రిక్స్ మరియు రేటింగ్‌లతో రియల్-టైమ్ ఫండ్ విశ్లేషణ"
      },
      "policy": {
        "title": "పాలసీ ఇంపాక్ట్ సిమ్యులేటర్",
        "description": "ప్రభుత్వ విధానాలు మీ ఆర్థిక వ్యవహారాలను ఎలా ప్రభావితం చేస్తాయో అర్థం చేసుకోండి"
      },
      "literacy": {
        "title": "బహుభాషా అభ్యాసం",
        "description": "6+ భారతీయ భాషలలో ఇంటరాక్టివ్ కంటెంట్‌తో ఆర్థిక విద్య"
      }
    },
    "stats": {
      "users": "క్రియాశీల వినియోగదారులు",
      "calculations": "లెక్కలు పూర్తయ్యాయి",
      "languages": "మద్దతు ఉన్న భాషలు",
      "success": "విజయ రేటు"
    },
    "common": {
      "exploreFeature": "ఫీచర్‌ను అన్వేషించండి"
    },
    "aiCoach": {
      "title": "AI ఫైనాన్స్ కోచ్",
      "subtitle": "Groq Llama 3 చే శక్తివంతం చేయబడిన మీ వ్యక్తిగత ఆర్థిక సలహాదారు",
      "suggestions": {
        "house": "నేను 5 సంవత్సరాలలో ఇల్లు కొనాలనుకుంటున్నాను",
        "investment": "₹5000తో పెట్టుబడిని ఎలా ప్రారంభించాలి?",
        "tax": "నాకు ఉత్తమ పన్ను ఆదా ఎంపికలు",
        "sip": "SIP మంచిదా లేక మొత్తం పెట్టుబడిదా?",
        "budget": "బడ్జెట్ రూపొందించడంలో నాకు సహాయం చేయండి",
        "emergency": "అత్యవసర నిధి - నాకు ఎంత అవసరం?"
      }
    }
  },
  bn: {
    "hero": {
      "title_part1": "ভারত অর্থ",
      "title_part2": "বুদ্ধিমত্তা প্ল্যাটফর্ম",
      "subtitle": "প্রতিটি ভারতীয়কে AI-চালিত আর্থিক বুদ্ধিমত্তা, রিয়েল-টাইম বাজার অন্তর্দৃষ্টি এবং আপনার পছন্দের ভাষায় ব্যক্তিগতকৃত বিনিয়োগ কৌশল দিয়ে ক্ষমতায়ন করা।",
      "launchDashboard": "ড্যাশবোর্ড চালু করুন",
      "tryBudget": "বাজেট বিশ্লেষক চেষ্টা করুন"
    },
    "features": {
      "investment": {
        "title": "স্মার্ট বিনিয়োগ ক্যালকুলেটর",
        "description": "রিয়েল-টাইম মিউচুয়াল ফান্ড ডেটা সহ AI-চালিত SIP, PPF, NPS গণনা"
      },
      "budget": {
        "title": "পেশাদার বাজেট বিশ্লেষক",
        "description": "ব্যক্তিগতকৃত সুপারিশ সহ বুদ্ধিমান ব্যয় ট্র্যাকিং"
      },
      "aiCoach": {
        "title": "AI অর্থ কোচ",
        "description": "আমাদের উন্নত AI সহায়ক থেকে ব্যক্তিগতকৃত আর্থিক পরামর্শ পান"
      },
      "mutualFunds": {
        "title": "মিউচুয়াল ফান্ড সুপারিশ",
        "description": "পারফরম্যান্স মেট্রিক্স এবং রেটিং সহ রিয়েল-টাইম ফান্ড বিশ্লেষণ"
      },
      "policy": {
        "title": "নীতি প্রভাব সিমুলেটর",
        "description": "সরকারি নীতিগুলি আপনার অর্থের উপর কীভাবে প্রভাব ফেলে তা বুঝুন"
      },
      "literacy": {
        "title": "বহুভাষিক শিক্ষা",
        "description": "৬+ ভারতীয় ভাষায় ইন্টারঅ্যাক্টিভ কন্টেন্ট সহ আর্থিক শিক্ষা"
      }
    },
    "stats": {
      "users": "সক্রিয় ব্যবহারকারী",
      "calculations": "গণনা সম্পন্ন",
      "languages": "সমর্থিত ভাষা",
      "success": "সাফল্যের হার"
    },
    "common": {
      "exploreFeature": "বৈশিষ্ট্য অন্বেষণ করুন"
    },
    "aiCoach": {
      "title": "AI অর্থ কোচ",
      "subtitle": "Groq Llama 3 দ্বারা চালিত আপনার ব্যক্তিগত আর্থিক উপদেষ্টা",
      "suggestions": {
        "house": "আমি ৫ বছরে একটি বাড়ি কিনতে চাই",
        "investment": "₹৫০০০ দিয়ে বিনিয়োগ কীভাবে শুরু করব?",
        "tax": "আমার জন্য সেরা কর সাশ্রয়ী বিকল্প",
        "sip": "SIP ভাল নাকি একমুশত বিনিয়োগ?",
        "budget": "বাজেট তৈরিতে আমাকে সাহায্য করুন",
        "emergency": "জরুরি তহবিল - আমার কত প্রয়োজন?"
      }
    }
  }
}

// Update each language file
Object.entries(translations).forEach(([lang, translation]) => {
  const filePath = path.join(LOCALES_DIR, lang, 'translation.json')
  fs.writeFileSync(filePath, JSON.stringify(translation, null, 2), 'utf8')
  console.log(`Updated ${lang}/translation.json`)
})

console.log('All translation files updated!')