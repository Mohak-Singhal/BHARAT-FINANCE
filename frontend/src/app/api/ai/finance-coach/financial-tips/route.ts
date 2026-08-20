import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface FinancialTip {
  category: string
  tip: string
  explanation: string
}

const ALL_TIPS: FinancialTip[] = [
  {
    category: 'Budgeting',
    tip: 'Use the 50-30-20 rule: 50% needs, 30% wants, 20% savings',
    explanation: 'This helps maintain a balanced approach to spending and saving for every income level.',
  },
  {
    category: 'Budgeting',
    tip: 'Track every expense for 30 days before making a budget',
    explanation: 'You cannot manage what you do not measure - small daily spends add up to big leaks.',
  },
  {
    category: 'Investment',
    tip: 'Start a SIP early, even with ₹500 per month',
    explanation: 'Time in the market beats timing the market because of compounding growth.',
  },
  {
    category: 'Investment',
    tip: 'Build an emergency fund of 6 months of expenses first',
    explanation: 'Keep it in a liquid fund or savings account so you never sell investments in a crisis.',
  },
  {
    category: 'Insurance',
    tip: 'Buy term life insurance when you are young',
    explanation: 'Premiums are much lower when you are young and healthy - lock in the rate early.',
  },
  {
    category: 'Insurance',
    tip: 'Health insurance before any investment, always',
    explanation: 'One hospital bill can wipe out years of savings - protect yourself first.',
  },
  {
    category: 'Tax Saving',
    tip: 'Invest in ELSS funds for tax benefits under Section 80C',
    explanation: 'ELSS offers ₹1.5 lakh deduction with potential for higher returns than PPF or FD.',
  },
  {
    category: 'Tax Saving',
    tip: 'Use the new tax regime if you have few deductions',
    explanation: 'Compare both regimes every year - the new regime is simpler but removes most deductions.',
  },
  {
    category: 'Emergency Fund',
    tip: 'Keep 6 months of expenses in liquid funds',
    explanation: 'An emergency fund gives financial security during job loss, illness, or unexpected repairs.',
  },
  {
    category: 'Emergency Fund',
    tip: 'Replenish your emergency fund after every withdrawal',
    explanation: 'A partially filled emergency fund is still an emergency - refill it as a priority.',
  },
  {
    category: 'Budgeting',
    tip: 'Automate savings on salary day',
    explanation: 'Move savings to a separate account before spending - what you never see, you never miss.',
  },
  {
    category: 'Investment',
    tip: 'Diversify across equity, debt and gold',
    explanation: 'Different asset classes behave differently, so diversification reduces overall risk.',
  },
]

// Rotate the visible tips by calendar day so "daily tips" feel fresh.
export async function GET() {
  const dayOfYear = Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86400000)
  const count = 6
  const start = dayOfYear % ALL_TIPS.length
  const daily_tips = [...ALL_TIPS.slice(start), ...ALL_TIPS.slice(0, start)].slice(0, count)

  return NextResponse.json({ daily_tips, date: new Date().toISOString().split('T')[0] })
}