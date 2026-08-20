import { NextRequest, NextResponse } from 'next/server'
import { getGroqCompletion } from '@/lib/api/llm'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['food', 'clothing', 'electronics', 'fuel', 'services', 'medicines', 'education'] as const

const CURRENT_GST_RATES: Record<string, number> = {
  food: 5,
  clothing: 12,
  electronics: 18,
  fuel: 28,
  services: 18,
  medicines: 5,
  education: 0,
}

interface GSTRequest {
  monthly_expenses: number
  expense_categories: Record<string, number>
  gst_rate_change: Record<string, number>
}

// GST is tax-inclusive in India: tax = amount * rate / (100 + rate)
function gstBurden(amount: number, rate: number): number {
  if (amount <= 0 || rate <= 0) return 0
  return (amount * rate) / (100 + rate)
}

export async function POST(request: NextRequest) {
  try {
    const body: GSTRequest = await request.json()
    const { monthly_expenses, expense_categories = {}, gst_rate_change = {} } = body

    if (!monthly_expenses || monthly_expenses <= 0) {
      return NextResponse.json({ error: 'Monthly expenses are required' }, { status: 400 })
    }

    let current_gst_burden = 0
    let new_gst_burden = 0
    const category_wise_impact: Record<string, number> = {}

    for (const category of CATEGORIES) {
      const amount = Number(expense_categories[category]) || 0
      const currentRate = CURRENT_GST_RATES[category]
      const newRate = Number(gst_rate_change[category])
      const currentTax = gstBurden(amount, currentRate)
      const newTax = gstBurden(amount, newRate)
      current_gst_burden += currentTax
      new_gst_burden += newTax
      category_wise_impact[category] = Math.round((newTax - currentTax) * 100) / 100
    }

    current_gst_burden = Math.round(current_gst_burden)
    new_gst_burden = Math.round(new_gst_burden)
    const monthly_impact = new_gst_burden - current_gst_burden
    const annual_impact = monthly_impact * 12

    let ai_explanation =
      `With your monthly spending of ₹${monthly_expenses.toLocaleString('en-IN')}, you currently pay ₹${current_gst_burden.toLocaleString('en-IN')} in GST. ` +
      `After the proposed rate changes, your GST burden would be ₹${new_gst_burden.toLocaleString('en-IN')}. ` +
      (monthly_impact >= 0
        ? `This is an increase of ₹${monthly_impact.toLocaleString('en-IN')} per month (₹${Math.abs(annual_impact).toLocaleString('en-IN')} per year).`
        : `This is a saving of ₹${Math.abs(monthly_impact).toLocaleString('en-IN')} per month (₹${Math.abs(annual_impact).toLocaleString('en-IN')} per year).`) +
      ' The biggest drivers are the categories with the largest rate changes.'

    try {
      const llmResult = await getGroqCompletion([
        {
          role: 'user',
          content:
            `A user spends ₹${monthly_expenses}/month. Their current GST burden is ₹${current_gst_burden} and after proposed rate changes it becomes ₹${new_gst_burden} (monthly change ₹${monthly_impact}). ` +
            'Summarise the impact in 3-4 simple English sentences for a rural Indian user.',
        },
      ])
      ai_explanation = llmResult.response
    } catch {
      // keep generated explanation
    }

    return NextResponse.json({
      current_gst_burden,
      new_gst_burden,
      monthly_impact,
      annual_impact,
      category_wise_impact,
      ai_explanation,
    })
  } catch (error) {
    console.error('GST simulation error:', error)
    return NextResponse.json({ error: 'Failed to simulate GST impact' }, { status: 500 })
  }
}