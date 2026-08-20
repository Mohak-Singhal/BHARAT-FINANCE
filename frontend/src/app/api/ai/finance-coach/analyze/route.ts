import { NextRequest, NextResponse } from 'next/server'
import { getGroqCompletion } from '@/lib/api/llm'

interface AnalysisRequest {
  monthly_income: number
  monthly_expenses: number
  age: number
  risk_level: 'conservative' | 'moderate' | 'aggressive'
  financial_goals?: string[]
  current_savings?: number
  current_investments?: number
  dependents?: number
  city_tier?: 'tier1' | 'tier2' | 'tier3'
}

const RECOMMENDED_BUDGET = [
  { category: 'Housing', percentage: 0.3 },
  { category: 'Food & Groceries', percentage: 0.15 },
  { category: 'Transport', percentage: 0.1 },
  { category: 'Utilities & Bills', percentage: 0.08 },
  { category: 'Healthcare', percentage: 0.06 },
  { category: 'Discretionary', percentage: 0.1 },
  { category: 'Savings & Investments', percentage: 0.21 },
]

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()
    const {
      monthly_income,
      monthly_expenses,
      age,
      risk_level,
      financial_goals = [],
      current_savings = 0,
      current_investments = 0,
      dependents = 0,
      city_tier = 'tier2',
    } = body

    if (!monthly_income || monthly_income <= 0) {
      return NextResponse.json({ error: 'Monthly income is required' }, { status: 400 })
    }

    const savingsRate = clamp(((monthly_income - monthly_expenses) / monthly_income) * 100, -100, 100)
    const totalAssets = current_savings + current_investments
    const emergencyMonths = monthly_expenses > 0 ? totalAssets / monthly_expenses : 0
    const cityTierFactor = city_tier === 'tier1' ? 1.2 : city_tier === 'tier3' ? 0.8 : 1
    const costOfLiving = 24000 * cityTierFactor

    // ---- Scoring (0-100) ----
    let score = 0
    score += clamp(savingsRate, 0, 100) * 0.4
    score += clamp(emergencyMonths / 6, 0, 1) * 20
    score += clamp(totalAssets / (monthly_income * 12), 0, 1) * 20
    score += clamp(60 - (age - 25), 0, 60) > 0 ? 10 : 5
    if (dependents > 0) score -= Math.min(10, dependents * 3)
    score = Math.round(clamp(score, 0, 100))

    // ---- Budget recommendations ----
    const budget_recommendations = RECOMMENDED_BUDGET.map((item) => {
      const current_allocation = Math.round((monthly_expenses * item.percentage) / 0.79)
      const recommended_allocation = Math.round(monthly_income * item.percentage)
      const difference = current_allocation - recommended_allocation
      return {
        category: item.category,
        current_allocation,
        recommended_allocation,
        difference,
        explanation:
          difference > 0
            ? `You are spending ₹${Math.abs(difference).toLocaleString('en-IN')} more than recommended on ${item.category.toLowerCase()}.`
            : `Your ${item.category.toLowerCase()} allocation is on track or better than recommended.`,
      }
    })

    // ---- Savings suggestions ----
    const savings_suggestions: string[] = []
    if (savingsRate < 20) {
      savings_suggestions.push(
        `Aim to save at least 20% of income - currently saving ${savingsRate.toFixed(1)}%. Cut discretionary spending first.`
      )
    }
    if (monthly_expenses > costOfLiving) {
      savings_suggestions.push(
        `Monthly expenses (₹${monthly_expenses.toLocaleString('en-IN')}) exceed the typical ${city_tier.toUpperCase()} cost of living (₹${costOfLiving.toLocaleString('en-IN')}). Review housing and transport costs.`
      )
    }
    savings_suggestions.push(
      'Automate a fixed transfer to a savings account on salary day - pay yourself first.'
    )
    if (emergencyMonths < 3) {
      savings_suggestions.push(
        `Emergency fund covers only ${emergencyMonths.toFixed(1)} months - build up to 6 months of expenses.`
      )
    }
    savings_suggestions.push('Use the 50-30-20 rule and track spending with a budgeting app or notebook.')

    // ---- Investment recommendations ----
    const investment_recommendations: string[] = []
    const riskAllocations: Record<string, { equity: number; debt: number; gold: number }> = {
      conservative: { equity: 30, debt: 60, gold: 10 },
      moderate: { equity: 50, debt: 40, gold: 10 },
      aggressive: { equity: 70, debt: 20, gold: 10 },
    }
    const allocation = riskAllocations[risk_level] || riskAllocations.moderate
    investment_recommendations.push(
      `Based on your ${risk_level} risk profile, consider ${allocation.equity}% equity (SIP in index or flexi-cap funds), ${allocation.debt}% debt (PPF, FD, debt funds), ${allocation.gold}% gold (SGB or gold ETF).`
    )
    if (age < 35) {
      investment_recommendations.push('You are young - a higher equity allocation can maximise long-term compounding.')
    } else if (age >= 55) {
      investment_recommendations.push('Near retirement - shift gradually towards safe instruments like PPF, FD and senior citizen savings schemes.')
    }
    investment_recommendations.push('Start a monthly SIP of at least ₹500-₹2000 in a diversified fund for long-term wealth creation.')
    if (financial_goals.includes('retirement')) {
      investment_recommendations.push('Open an NPS account for retirement - it adds an extra ₹50,000 deduction under 80CCD(1B).')
    }

    // ---- Insurance needs ----
    const insurance_needs: string[] = []
    if (dependents > 0) {
      insurance_needs.push(
        `You have ${dependents} dependent(s) - a term life cover of at least 10-15x your annual income is essential.`
      )
    }
    insurance_needs.push('Health insurance covering at least ₹5 lakh per family is a must before any investment.')
    if (age > 40) {
      insurance_needs.push('Add a critical illness rider - medical costs rise sharply with age.')
    }

    // ---- Warnings ----
    const warnings: string[] = []
    if (savingsRate <= 0) {
      warnings.push('You are spending more than you earn every month. Cut expenses or increase income immediately.')
    }
    if (dependents > 0 && insurance_needs.length === 0) {
      warnings.push('Family without insurance is exposed to major financial risk.')
    }
    if (monthly_expenses > monthly_income * 0.9) {
      warnings.push('Over 90% of income goes to expenses - savings priority is critical.')
    }

    // ---- Action plan ----
    const action_plan: string[] = [
      savingsRate < 20
        ? `Reduce expenses by ₹${Math.round(monthly_income * 0.2 - (monthly_income - monthly_expenses)).toLocaleString('en-IN')}/month to hit a 20% savings rate.`
        : `Maintain your current savings rate of ${savingsRate.toFixed(1)}%.`,
      emergencyMonths < 6
        ? `Build your emergency fund from ${emergencyMonths.toFixed(1)} to 6 months (₹${Math.round(monthly_expenses * 6).toLocaleString('en-IN')}).`
        : 'Emergency fund is healthy - keep it in a liquid fund.',
      `Start SIPs aligned to your ${risk_level} risk profile this month.`,
      'Review insurance cover and add term + health insurance if missing.',
      'Track expenses weekly and review your budget every 3 months.',
    ]

    // ---- AI explanation (best effort; falls back to generated summary) ----
    let ai_explanation =
      `Your financial health score is ${score}/100. You save ${savingsRate.toFixed(1)}% of income, ` +
      `your emergency fund covers ${emergencyMonths.toFixed(1)} months, and your total assets are ₹${totalAssets.toLocaleString('en-IN')}. ` +
      (score >= 80
        ? 'This is an excellent position - focus on optimisation and growth.'
        : score >= 60
          ? 'You are in decent shape - tighten the weak areas highlighted above.'
          : 'There is significant room for improvement - follow the action plan step by step.')

    try {
      const llmResult = await getGroqCompletion([
        {
          role: 'user',
          content:
            `Act as a financial advisor. The user's monthly income is ₹${monthly_income}, monthly expenses ₹${monthly_expenses}, ` +
            `age ${age}, risk level ${risk_level}, savings ₹${current_savings}, investments ₹${current_investments}, ` +
            `dependents ${dependents}, city tier ${city_tier}, financial health score ${score}. ` +
            'Write a 4-6 sentence personal financial analysis in simple English, ending with one clear first step.',
        },
      ])
      ai_explanation = llmResult.response
    } catch {
      // keep generated explanation
    }

    return NextResponse.json({
      financial_health_score: score,
      budget_recommendations,
      savings_suggestions,
      investment_recommendations,
      insurance_needs,
      warnings,
      ai_explanation,
      action_plan,
    })
  } catch (error) {
    console.error('Financial analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze financial profile' }, { status: 500 })
  }
}