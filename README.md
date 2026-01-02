# Bharat Finance Platform

A modern, responsive Next.js frontend for the Bharat Finance & Policy Simulator platform.

## 🚀 Features

- **Modern UI/UX**: Built with Next.js 15, React 19, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Investment Calculator**: Interactive forms with real-time calculations
- **AI Chat Interface**: Conversational financial guidance
- **Data Visualization**: Charts and graphs using Recharts
- **Multilingual Support**: Ready for 6+ Indian languages
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Fast loading with modern React features

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── investment/        # Investment simulator
│   ├── ai-coach/          # AI financial coach
│   ├── policy/            # Policy simulator
│   ├── literacy/          # Financial education
│   └── mandi/             # Rural market support
├── components/            # Reusable components
│   ├── layout/           # Header, Footer
│   ├── ui/               # UI components
│   ├── investment/       # Investment-specific components
│   ├── ai-coach/         # AI coach components
│   └── sections/         # Page sections
├── lib/                  # Utilities and helpers
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🎨 Design System

### Colors
- **Primary**: Orange gradient (Indian flag inspired)
- **Secondary**: Blue tones
- **Success**: Green variants
- **Warning**: Yellow/Orange
- **Error**: Red variants

### Typography
- **Primary Font**: Inter (clean, modern)
- **Indian Languages**: Noto Sans Devanagari

### Components
- Consistent spacing and sizing
- Hover effects and animations
- Mobile-responsive design
- Accessibility compliant

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 8000

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bharat-finance-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Bharat Finance Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 📱 Pages Overview

### Home Page (`/`)
- Hero section with platform overview
- Feature cards for all modules
- Statistics and testimonials
- Call-to-action sections

### Investment Simulator (`/investment`)
- Interactive investment calculator
- Real-time results with charts
- AI-powered insights
- Educational content

### AI Financial Coach (`/ai-coach`)
- Chat interface with AI
- Financial profile analysis
- Daily tips and insights
- Personalized recommendations

### Policy Simulator (`/policy`)
- Tax calculation tools
- GST impact analysis
- Subsidy change simulator
- Policy comparison features

### Financial Literacy (`/literacy`)
- Interactive lessons
- Multilingual content
- Progress tracking
- Quizzes and assessments

### Mandi Support (`/mandi`)
- Crop price checker
- Market recommendations
- Profit calculators
- MSP information

## 🎯 Key Components

### Investment Calculator
```tsx
<InvestmentForm onCalculate={handleCalculate} loading={loading} />
<InvestmentResults result={result} />
<InvestmentChart data={result.yearly_breakdown} />
```

### AI Chat Interface
```tsx
<ChatInterface />
// Features:
// - Real-time messaging
// - AI response streaming
// - Suggestion chips
// - Warning alerts
```

### Data Visualization
```tsx
<ResponsiveContainer>
  <LineChart data={chartData}>
    <Line dataKey="corpus_value" stroke="#10b981" />
    <Line dataKey="inflation_adjusted" stroke="#f59e0b" />
  </LineChart>
</ResponsiveContainer>
```

## 🌐 API Integration

### Investment API
```typescript
const response = await fetch('/api/simulate/investment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(investmentData),
})
```

### AI Coach API
```typescript
const response = await fetch('/api/ai/finance-coach/chat', {
  method: 'POST',
  body: JSON.stringify({ message, user_context }),
})
```

## 🎨 Styling Guidelines

### Tailwind Classes
```css
/* Buttons */
.btn-primary { @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200; }

/* Forms */
.form-input { @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500; }

/* Cards */
.card-hover { @apply transition-all duration-300 hover:shadow-lg hover:-translate-y-1; }
```

### Custom Animations
```css
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  animation: shimmer 1.5s infinite;
}
```

## 📊 Performance Optimizations

### Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components
- Lazy loading for charts and visualizations

### Image Optimization
- Next.js Image component
- WebP format support
- Responsive images

### Bundle Optimization
- Tree shaking enabled
- Package imports optimized
- Unused code elimination

## 🌍 Internationalization

### Language Support
- English (default)
- Hindi (हिंदी)
- Marathi (मराठी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)

### Implementation
```typescript
const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  // ... more languages
]
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Type Checking
```bash
npm run type-check
```

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Static Export
```bash
npm run build
npm run export
```

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Next.js Config
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts']
  },
}
```

### Tailwind Config
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* custom color palette */ },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Indian financial platforms
- **Icons**: Lucide React
- **Charts**: Recharts library
- **Animations**: Framer Motion
- **UI Components**: Tailwind CSS

---

**Built with ❤️ for financial inclusion in India**
