#!/usr/bin/env node

/**
 * Translation Helper Script
 * Helps manage translations across all supported languages
 */

const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '../public/locales')
const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'or', 'pa', 'as']
const NAMESPACES = ['translation', 'common', 'navigation', 'dashboard', 'aicoach', 'investment', 'budget', 'policy', 'mandi', 'literacy', 'forms', 'errors']

function getAllKeys(obj, prefix = '') {
  let keys = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      keys = keys.concat(getAllKeys(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

function checkMissingKeys() {
  console.log('🔍 Checking for missing translation keys...\n')
  
  for (const namespace of NAMESPACES) {
    console.log(`📁 Namespace: ${namespace}`)
    
    // Get English keys as reference
    const enFile = path.join(LOCALES_DIR, 'en', `${namespace}.json`)
    if (!fs.existsSync(enFile)) {
      console.log(`   ⚠️  English file not found: ${namespace}.json`)
      continue
    }
    
    const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'))
    const enKeys = getAllKeys(enContent)
    
    for (const lang of SUPPORTED_LANGUAGES) {
      if (lang === 'en') continue
      
      const langFile = path.join(LOCALES_DIR, lang, `${namespace}.json`)
      if (!fs.existsSync(langFile)) {
        console.log(`   ❌ ${lang}: File missing`)
        continue
      }
      
      const langContent = JSON.parse(fs.readFileSync(langFile, 'utf8'))
      const langKeys = getAllKeys(langContent)
      
      const missingKeys = enKeys.filter(key => !langKeys.includes(key))
      const extraKeys = langKeys.filter(key => !enKeys.includes(key))
      
      if (missingKeys.length > 0 || extraKeys.length > 0) {
        console.log(`   ⚠️  ${lang}:`)
        if (missingKeys.length > 0) {
          console.log(`      Missing: ${missingKeys.join(', ')}`)
        }
        if (extraKeys.length > 0) {
          console.log(`      Extra: ${extraKeys.join(', ')}`)
        }
      } else {
        console.log(`   ✅ ${lang}: All keys present`)
      }
    }
    console.log()
  }
}

function generateStats() {
  console.log('📊 Translation Statistics\n')
  
  let totalKeys = 0
  let translatedKeys = 0
  
  for (const namespace of NAMESPACES) {
    const enFile = path.join(LOCALES_DIR, 'en', `${namespace}.json`)
    if (!fs.existsSync(enFile)) continue
    
    const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'))
    const enKeys = getAllKeys(enContent)
    totalKeys += enKeys.length
    
    console.log(`📁 ${namespace}: ${enKeys.length} keys`)
    
    for (const lang of SUPPORTED_LANGUAGES) {
      if (lang === 'en') continue
      
      const langFile = path.join(LOCALES_DIR, lang, `${namespace}.json`)
      if (fs.existsSync(langFile)) {
        const langContent = JSON.parse(fs.readFileSync(langFile, 'utf8'))
        const langKeys = getAllKeys(langContent)
        const coverage = Math.round((langKeys.length / enKeys.length) * 100)
        console.log(`   ${lang}: ${langKeys.length}/${enKeys.length} (${coverage}%)`)
        translatedKeys += langKeys.length
      }
    }
    console.log()
  }
  
  const overallCoverage = Math.round((translatedKeys / (totalKeys * (SUPPORTED_LANGUAGES.length - 1))) * 100)
  console.log(`🎯 Overall Translation Coverage: ${overallCoverage}%`)
  console.log(`📈 Total Keys: ${totalKeys}`)
  console.log(`🌍 Languages: ${SUPPORTED_LANGUAGES.length}`)
}

function createMissingFiles() {
  console.log('🔧 Creating missing translation files...\n')
  
  for (const lang of SUPPORTED_LANGUAGES) {
    const langDir = path.join(LOCALES_DIR, lang)
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true })
      console.log(`📁 Created directory: ${lang}`)
    }
    
    for (const namespace of NAMESPACES) {
      const langFile = path.join(langDir, `${namespace}.json`)
      if (!fs.existsSync(langFile)) {
        fs.writeFileSync(langFile, '{}', 'utf8')
        console.log(`📄 Created file: ${lang}/${namespace}.json`)
      }
    }
  }
  
  console.log('\n✅ All translation files created!')
}

// CLI Interface
const command = process.argv[2]

switch (command) {
  case 'check':
    checkMissingKeys()
    break
  case 'stats':
    generateStats()
    break
  case 'create':
    createMissingFiles()
    break
  default:
    console.log(`
🌍 Translation Helper

Usage:
  node scripts/translation-helper.js <command>

Commands:
  check   - Check for missing translation keys
  stats   - Show translation statistics
  create  - Create missing translation files

Examples:
  node scripts/translation-helper.js check
  node scripts/translation-helper.js stats
  node scripts/translation-helper.js create
`)
}