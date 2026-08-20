import { NextRequest, NextResponse } from 'next/server'
import { getGroqCompletion } from '@/lib/api/llm'

export const dynamic = 'force-dynamic'

interface TaxRequest {
  annual_income: number
  age: number
  deductions_80c: number
  deductions_80d: number
  other_deductions: number
}

interface Slab {
  slab: string
  rate: string
  taxable_amount: number
  tax: number
}

// FY 2024-25 slabs.
const NEW_REGIME_SLABS = [
  { limit: 300000, rate: 0 },
  { limit: 700000, rate: 0.05 },
  { limit: 1000000, rate: 0.1 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.2 },
  { limit: Infinity, rate: 0.3 },
]

const OLD_REGIME_SLABS = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 0.05 },
  { limit: 1000000, rate: 0.2 },
  { limit: Infinity, rate: 0.3 },
]

function computeSlabs(taxable: number, slabs: Array<{ limit: number; rate: number }>): Slab[] {
  const breakdown: Slab[] = []
  let previous = 0
  for (const slab of slabs) {
    if (previous >= taxable) break
    const amountInSlab = Math.max(0, Math.min(slab.limit, taxable) - previous)
    const tax = Math.round(amountInSlab * slab.rate)
    breakdown.push({
      slab: `₹${previous.toLocaleString('en-IN')} - ₹${slab.limit === Infinity ? '∞' : slab.limit.toLocaleString('en-IN')}`,
      rate: `${slab.rate * 100}%`,
      taxable_amount: amountInSlab,
      tax,
    })
    previous = slab.limit
  }
  return breakdown
}

export async function POST(request: NextRequest) {
  try {
    const body: TaxRequest = await request.json()
    const { annual_income, age = 30, deductions_80c = 0, deductions_80d = 0, other_deductions = 0 } = body

    if (!annual_income || annual_income <= 0) {
      return NextResponse.json({ error: 'Annual income is required' }, { status: 400 })
    }

    const isSenior = age >= 60
    const isSuperSenior = age >= 80

    // ---- New regime (FY 2024-25) ----
    const newTaxable = Math.max(0, annual_income - 75000) // standard deduction
    const newBreakdown = computeSlabs(newTaxable, NEW_REGIME_SLABS)
    let newTax = newBreakdown.reduce((sum, s) => sum + s.tax, 0)
    if (newTaxable <= 700000) newTax = 0 // rebate under Section 87A
    const newCess = Math.round(newTax * 0.04)
    const newTotal = newTax + newCess

    // ---- Old regime ----
    const capped80c = Math.min(deductions_80c, 150000)
    const capped80d = Math.min(deductions_80d, isSenior ? 50000 : 25000)
    const totalDeductions = capped80c + capped80d + Math.max(0, Number(other_deductions) || 0)
    const oldTaxable = Math.max(0, annual_income - 50000 - totalDeductions) // standard deduction ₹50k
    const oldBreakdown = computeSlabs(oldTaxable, OLD_REGIME_SLABS)
    let oldTax = oldBreakdown.reduce((sum, s) => sum + s.tax, 0)
    if (oldTaxable <= 500000) oldTax = 0
    const oldCess = Math.round(oldTax * 0.04)
    const oldTotal = oldTax + oldCess

    // ---- Pick better regime ----
    const newRegimeBetter = newTotal <= oldTotal
    const total_tax = Math.min(newTotal, oldTotal)
    const income_tax = Math.round(total_tax / 1.04)
    const cess = total_tax - income_tax
    const taxable_income = newRegimeBetter ? newTaxable : oldTaxable
    const tax_breakdown = (newRegimeBetter ? newBreakdown : oldBreakdown).filter((s) => s.taxable_amount > 0)
    const net_income = annual_income - total_tax
    const effective_tax_rate = (total_tax / annual_income) * 100

    const tax_saving_suggestions: string[] = []
    if (totalDeductions < 150000) {
      tax_saving_suggestions.push(
        `You have used ₹${totalDeductions.toLocaleString('en-IN')} of the ₹1.5 lakh 80C limit - fill the rest with PPF, ELSS or life insurance premium.`
      )
    }
    if (!newRegimeBetter) {
      tax_saving_suggestions.push('The old regime benefits you - maximise 80C, 80D and HRA deductions.')
    } else {
      tax_saving_suggestions.push('The new regime is better for you - avoid forcing investments just for tax savings.')
    }
    if (isSenior) {
      tax_saving_suggestions.push('Senior citizen benefits: higher 80D limit (₹50,000) and senior savings scheme interest exemption under 80TTB (₹50,000).')
    }
    tax_saving_suggestions.push('Contribute to NPS up to ₹50,000 under 80CCD(1B) for extra deductions.')

    let ai_explanation =
      `Based on your annual income of ₹${annual_income.toLocaleString('en-IN')}, the ${newRegimeBetter ? 'new' : 'old'} tax regime is more beneficial, ` +
      `with total tax of ₹${total_tax.toLocaleString('en-IN')} (${effective_tax_rate.toFixed(1)}% effective rate). ` +
      (newRegimeBetter
        ? 'The new regime keeps things simple with lower rates and a ₹75,000 standard deduction.'
        : 'The old regime rewards your deductions, saving you more tax overall.') +
      ` Your net take-home income after tax is ₹${net_income.toLocaleString('en-IN')} per year.`

    try {
      const llmResult = await getGroqCompletion([
        {
          role: 'user',
          content:
            `The user has annual income ₹${annual_income}, age ${age}, total deductions ₹${totalDeductions}. ` +
            `They chose the ${newRegimeBetter ? 'new' : 'old'} regime with total tax ₹${total_tax}. ` +
            'Explain their tax position in 3-4 simple sentences in English, with one practical tax-saving tip.',
        },
      ])
      ai_explanation = llmResult.response
    } catch {
      // keep generated explanation
    }

    return NextResponse.json({
      gross_income: annual_income,
      total_deductions: newRegimeBetter ? 75000 : totalDeductions,
      taxable_income,
      income_tax,
      cess,
      total_tax,
      net_income,
      effective_tax_rate: Number(effective_tax_rate.toFixed(1)),
      tax_breakdown,
      ai_explanation,
      tax_saving_suggestions,
      regime_used: newRegimeBetter ? 'new' : 'old',
    })
  } catch (error) {
    console.error('Tax calculation error:', error)
    return NextResponse.json({ error: 'Failed to calculate tax' }, { status: 500 })
  }
}