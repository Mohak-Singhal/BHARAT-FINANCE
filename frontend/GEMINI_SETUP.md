# 🔑 Gemini API Setup Instructions

## ✅ **FIXED - Gemini 2.0 Flash & Multi-Model Support**

The AI Finance Coach now uses **multiple Gemini models** with automatic fallback for maximum reliability.

## 🚀 **Current Models Supported**
- **gemini-1.5-flash-002** (Primary)
- **gemini-1.5-flash-001** 
- **gemini-1.5-flash**
- **gemini-1.5-pro-002**
- **gemini-1.5-pro-001**
- **gemini-1.5-pro**
- **gemini-2.0-flash-exp** (Latest experimental)
- **gemini-pro** (Fallback)

## 📋 Setup Steps

### 1. Get Your Free Gemini API Key

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the generated key**

### 2. Configure Your Environment

1. **Open** `frontend/.env.local`
2. **Add your API key**:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```
3. **Save the file**

### 3. Restart the Development Server

```bash
cd frontend
npm run dev
```

## ✅ Verification

1. **Go to**: http://localhost:3000/ai-coach
2. **Send a message** - you should get AI responses from the best available model
3. **Check for errors** - proper error handling for all scenarios

## 🔧 API Status Check

```bash
curl http://localhost:3000/api/chat
```

Should return:
```json
{
  "gemini_configured": true,
  "setup_required": false,
  "available_models": ["gemini-1.5-flash-002", "..."]
}
```

## ❌ Troubleshooting

### ✅ **"Setup Required" Error**
- **Cause**: API key not configured
- **Solution**: Add your Gemini API key to `.env.local`

### ✅ **"API Error: 400"**
- **Cause**: Invalid API key
- **Solution**: Check your API key is correct

### ✅ **"API Error: 403"**
- **Cause**: API key doesn't have permissions
- **Solution**: Generate a new API key

### ✅ **"API Error: 404" (Model Not Found)**
- **Cause**: ✅ **FIXED** - Now tries multiple models automatically

### ✅ **"Rate Limit Exceeded"**
- **Cause**: Free tier quota exceeded
- **Solution**: Wait 1 minute or upgrade API plan
- **Status**: ✅ **Proper error handling implemented**

### ✅ **Network Errors**
- **Cause**: Internet connection or server issues
- **Solution**: Check your connection and try again

## 🎯 Features (Once Configured)

- **✅ Multi-model support** - Automatic fallback between models
- **✅ Real AI responses** powered by latest Gemini models
- **✅ Indian finance expertise** (SIP, PPF, ELSS, tax planning)
- **✅ Conversation context** maintained
- **✅ No hardcoded responses** - all AI generated
- **✅ Intelligent error handling** with detailed messages
- **✅ Rate limit management** with user-friendly feedback
- **✅ Fast responses** with the latest Gemini models

## 🔒 Security Notes

- **Never commit** your API key to version control
- **Keep your API key private**
- **The `.env.local` file is gitignored** for security

## 🚀 Model Selection Logic

The API automatically tries models in this order:
1. **gemini-1.5-flash-002** (Latest stable)
2. **gemini-1.5-flash-001** (Stable)
3. **gemini-1.5-flash** (Standard)
4. **gemini-1.5-pro-002** (High quality)
5. **gemini-1.5-pro-001** (High quality)
6. **gemini-1.5-pro** (Standard pro)
7. **gemini-2.0-flash-exp** (Experimental)
8. **gemini-pro** (Legacy fallback)

## 📊 Rate Limits (Free Tier)

- **Requests per minute**: 15
- **Requests per day**: 1,500
- **Tokens per minute**: 32,000
- **Tokens per day**: 50,000

**Upgrade to paid plan for higher limits!**

---

**✅ The AI Finance Coach now works with the latest Gemini models and provides intelligent error handling!** 🚀