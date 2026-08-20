import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface BudgetAnalysisRequest {
  monthly_income: number
  expenses: Record<string, number>
  financial_goals?: string[]
  age?: number
  dependents?: number
}

// Recommended share of income per expense category (Indian context).
const CATEGORY_GUIDELINES: Record<string, { name: string; recommended: number }> = {
  housing: { name: 'Housing (Rent/EMI)', recommended: 0.3 },
  food: { name: 'Food & Groceries', recommended: 0.15 },
  utilities: { name: 'Utilities', recommended: 0.08 },
  transportation: { name: 'Transportation', recommended: 0.1 },
  healthcare: { name: 'Healthcare', recommended: 0.06 },
  entertainment: { name: 'Entertainment', recommended: 0.05 },
  dining: { name: 'Dining Out', recommended: 0.05 },
  shopping: { name: 'Shopping', recommended: 0.05 },
  savings: { name: 'Savings', recommended: 0.12 },
  investments: { name: 'Investments', recommended: 0.09 },
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export async function POST(request: NextRequest) {
  try {
    const body: BudgetAnalysisRequest = await request.json()
    const { monthly_income, expenses = {}, age = 30, dependents = 0 } = body

    if (!monthly_income || monthly_income <= 0) {
      return NextResponse.json({ error: 'Monthly income is required' }, { status: 400 })
    }

    const total_expenses = Object.values(expenses).reduce((sum, value) => sum + (Number(value) || 0), 0)
    const savings_rate = clamp(((monthly_income - total_expenses) / monthly_income) * 100, -100, 100)
    const recommended_savings_rate = 20
    const debt_to_income_ratio = clamp((expenses.housing || 0) / monthly_income, 0, 1) * 100

    const categories = Object.entries(CATEGORY_GUIDELINES).map(([key, guideline]) => {
      const current_amount = Number(expenses[key]) || 0
      const recommended_amount = Math.round(monthly_income * guideline.recommended)
      const percentage_of_income = (current_amount / monthly_income) * 100
      const overBy = current_amount - recommended_amount
      const status: 'good' | 'warning' | 'critical' =
        overBy <= recommended_amount * 0.1
          ? 'good'
          : overBy <= recommended_amount * 0.4
            ? 'warning'
            : 'critical'

      const tips: string[] = []
      if (overBy > 0) {
        tips.push(
          `Try to bring ${guideline.name.toLowerCase()} to ₹${recommended_amount.toLocaleString('en-IN')} (${Math.round(guideline.recommended * 100)}% of income).`
        )
        tips.push(`You are currently spending ₹${Math.abs(overBy).toLocaleString('en-IN')} more than the benchmark.`)
      } else {
        tips.push(`Your ${guideline.name.toLowerCase()} spend is within the recommended range.`)
      }

      const description =
        overBy > 0
          ? `Spending on ${guideline.name.toLowerCase()} exceeds the recommended ${Math.round(guideline.recommended * 100)}% of income.`
          : `Spending on ${guideline.name.toLowerCase()} is within healthy limits.`

      return {
        name: guideline.name,
        current_amount,
        recommended_amount,
        percentage_of_income: Number(percentage_of_income.toFixed(1)),
        recommended_percentage: Math.round(guideline.recommended * 100),
        status,
        description,
        tips,
      }
    })

    // Overall score (0-100)
    let score = 0
    score += clamp(savings_rate, 0, 100) * 0.5
    for (const category of categories) {
      if (category.status === 'good') score += 4
      else if (category.status === 'warning') score += 1.5
    }
    score = Math.round(clamp(score, 0, 100))

    const recommendations: string[] = []
    if (savings_rate < recommended_savings_rate) {
      recommendations.push(
        `Increase savings to at least ${recommended_savings_rate}% of income (currently ${savings_rate.toFixed(1)}%). Cut ₹${Math.round(
          monthly_income * ((recommended_savings_rate - savings_rate) / 100)
        ).toLocaleString('en-IN')} of discretionary spend.`
      )
    } else {
      recommendations.push(`Excellent savings rate of ${savings_rate.toFixed(1)}% - keep it up.`)
    }
    const emergencyMonthsRaw = ((expenses.savings || 0) + (expenses.investments || 0)) / Math.max(total_expenses, 1)
    if (emergencyMonthsRaw < 6) {
      recommendations.push(
        `Build an emergency fund covering 6 months of expenses (₹${(total_expenses * 6).toLocaleString('en-IN')}).`
      )
    }
    if (debt_to_income_ratio > 30) {
      recommendations.push(`Housing cost is ${debt_to_income_ratio.toFixed(0)}% of income - keep it under 30%.`)
    }
    if (age > 35 && (expenses.healthcare || 0) < monthly_income * 0.05) {
      recommendations.push('Add health insurance - medical costs rise sharply after 35.')
    }
    if ((expenses.investments || 0) < monthly_income * 0.09) {
      recommendations.push('Consider starting a monthly SIP in a diversified equity mutual fund.')
    }
    recommendations.push('Review this budget every 3 months and adjust for income changes.')

    const emergency_fund_months = Number(
      clamp(((expenses.savings || 0) + (expenses.investments || 0)) / Math.max(total_expenses, 1), 0, 24).toFixed(1)
    )

    return NextResponse.json({
      total_income: monthly_income,
      total_expenses,
      savings_rate: Number(savings_rate.toFixed(1)),
      recommended_savings_rate,
      categories,
      overall_score: score,
      recommendations,
      emergency_fund_months,
      debt_to_income_ratio: Number(debt_to_income_ratio.toFixed(1)),
      dependents,
    })
  } catch (error) {
    console.error('Budget analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze budget' }, { status: 500 })
  }
}