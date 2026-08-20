import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface FundCategory {
  category: string
  name: string
  description: string
  risk: string
  expected_returns: string
  investment_horizon: string
  tax_benefit?: string
}

const FUND_CATEGORIES: FundCategory[] = [
  {
    category: 'equity',
    name: 'Equity Funds',
    description: 'Growth-focused funds investing in company shares. Ideal for long-term wealth creation.',
    risk: 'High',
    expected_returns: '12-15% p.a.',
    investment_horizon: '5+ years',
    tax_benefit: 'LTCG tax above ₹1L @ 10%',
  },
  {
    category: 'debt',
    name: 'Debt Funds',
    description: 'Lower-risk funds investing in bonds and government securities. Stable, predictable returns.',
    risk: 'Low',
    expected_returns: '6-8% p.a.',
    investment_horizon: '1-3 years',
  },
  {
    category: 'hybrid',
    name: 'Hybrid Funds',
    description: 'Balanced mix of equity and debt for moderate risk with reasonable growth.',
    risk: 'Moderate',
    expected_returns: '9-12% p.a.',
    investment_horizon: '3-5 years',
  },
  {
    category: 'elss',
    name: 'ELSS Funds',
    description: 'Equity funds with 3-year lock-in offering tax deduction under Section 80C.',
    risk: 'High',
    expected_returns: '12-15% p.a.',
    investment_horizon: '3+ years (lock-in)',
    tax_benefit: 'Up to ₹1.5L deduction under 80C',
  },
  {
    category: 'gold',
    name: 'Gold Funds',
    description: 'Invest in gold through ETFs or fund-of-funds. Hedge against inflation.',
    risk: 'Moderate',
    expected_returns: '8-12% p.a.',
    investment_horizon: '5+ years',
  },
  {
    category: 'international',
    name: 'International Funds',
    description: 'Diversification into US and global markets for currency and geography hedge.',
    risk: 'High',
    expected_returns: '10-14% p.a.',
    investment_horizon: '5+ years',
  },
  {
    category: 'smallcap',
    name: 'Small Cap Funds',
    description: 'Invest in small companies with explosive growth potential but higher volatility.',
    risk: 'Very High',
    expected_returns: '15-20% p.a.',
    investment_horizon: '7+ years',
  },
  {
    category: 'index',
    name: 'Index Funds',
    description: 'Passive funds tracking NIFTY 50 or SENSEX with very low expense ratios.',
    risk: 'Moderate',
    expected_returns: '10-12% p.a.',
    investment_horizon: '5+ years',
  },
]

export async function GET() {
  return NextResponse.json({ categories: FUND_CATEGORIES, count: FUND_CATEGORIES.length })
}