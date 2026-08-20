import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface TopicGroup {
  category: string
  topics: string[]
}

const TOPIC_GROUPS: TopicGroup[] = [
  {
    category: 'Basic Finance',
    topics: ['Budgeting', 'Saving', 'Banking', 'Digital Payments'],
  },
  {
    category: 'Investments',
    topics: ['Mutual Funds', 'SIP', 'PPF', 'NPS', 'ELSS', 'Fixed Deposits'],
  },
  {
    category: 'Insurance',
    topics: ['Life Insurance', 'Health Insurance', 'Motor Insurance', 'Crop Insurance'],
  },
  {
    category: 'Tax & Planning',
    topics: ['Tax Planning', 'Emergency Fund', 'Retirement Planning'],
  },
  {
    category: 'Markets',
    topics: ['Stock Market', 'Gold Investment', 'Real Estate'],
  },
]

export async function GET() {
  return NextResponse.json({ topics: TOPIC_GROUPS, count: TOPIC_GROUPS.length })
}