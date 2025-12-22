# 🔑 Gemini API Setup Instructions

## ✅ **UPDATED - Gemini 2.5 Flash Priority & Multi-Model Support**

The AI Finance Coach now prioritizes **Gemini 2.5 Flash** models with automatic fallback for maximum performance.

## 🚀 **Current Models Supported (Priority Order)**
- **gemini-2.5-flash** (Primary - Latest 2.5 Flash)
- **gemini-2.5-flash-latest** (Latest 2.5 version)
- **gemini-2.5-flash-002** (Stable 2.5)
- **gemini-2.5-flash-001** (Stable 2.5)
- **gemini-2.5-flash-exp** (Experimental 2.5)
- **gemini-1.5-flash-002** (Fallback)
- **gemini-1.5-flash-001** (Fallback)
- **gemini-1.5-flash** (Fallback)
- **gemini-1.5-pro-002** (Fallback)
- **gemini-1.5-pro-001** (Fallback)
- **gemini-1.5-pro** (Fallback)
- **gemini-2.0-flash-exp** (Fallback)
- **gemini-pro** (Legacy fallback)

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
2. **Send a message** - you should get AI responses from Gemini 2.5 Flash
3. **Check response** - will show which model was used

## 🔧 API Status Check

```bash
curl http://localhost:3000/api/chat
```

Should return:
```json
{
  "gemini_configured": true,
  "setup_required": false,
  "available_models": ["gemini-2.5-flash", "..."]
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
- **Cause**: ✅ **FIXED** - Now tries multiple models automatically starting with 2.5 Flash

### ✅ **"Rate Limit Exceeded"**
- **Cause**: Free tier quota exceeded
- **Solution**: Wait 1 minute or upgrade API plan
- **Status**: ✅ **Proper error handling implemented**

### ✅ **Network Errors**
- **Cause**: Internet connection or server issues
- **Solution**: Check your connection and try again

## 🎯 Features (Once Configured)

- **✅ Gemini 2.5 Flash Priority** - Uses the latest and fastest model first
- **✅ Multi-model support** - Automatic fallback between 13 models
- **✅ Real AI responses** powered by latest Gemini models
- **✅ Indian finance expertise** (SIP, PPF, ELSS, tax planning)
- **✅ Conversation context** maintained
- **✅ No hardcoded responses** - all AI generated
- **✅ Intelligent error handling** with detailed messages
- **✅ Rate limit management** with user-friendly feedback
- **✅ Fast responses** with the latest Gemini 2.5 Flash

## 🔒 Security Notes

- **Never commit** your API key to version control
- **Keep your API key private**
- **The `.env.local` file is gitignored** for security

## 🚀 Model Selection Logic

The API automatically tries models in this priority order:
1. **gemini-2.5-flash** (Primary - Latest 2.5 Flash)
2. **gemini-2.5-flash-latest** (Latest 2.5 version)
3. **gemini-2.5-flash-002** (Stable 2.5)
4. **gemini-2.5-flash-001** (Stable 2.5)
5. **gemini-2.5-flash-exp** (Experimental 2.5)
6. **Fallback to 1.5 models** if 2.5 not available

## 📊 Rate Limits (Free Tier)

- **Requests per minute**: 15
- **Requests per day**: 1,500
- **Tokens per minute**: 32,000
- **Tokens per day**: 50,000

**Upgrade to paid plan for higher limits!**

## 🆕 Gemini 2.5 Flash Benefits

- **Faster responses** than previous versions
- **Better reasoning** capabilities
- **Improved context understanding**
- **Enhanced financial knowledge**
- **More accurate calculations**

---

**✅ The AI Finance Coach now prioritizes Gemini 2.5 Flash for the best performance and latest capabilities!** 🚀