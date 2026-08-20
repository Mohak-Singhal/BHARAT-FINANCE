import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Base effective tax rates by income bracket (old regime approximations).
const BRACKET_RATES: Record<string, { income: number; baseRate: number }> = {
  low: { income: 400000, baseRate: 5 },
  middle: { income: 800000, baseRate: 15 },
  high: { income: 2000000, baseRate: 30 },
}

const DISCLAIMER =
  'This is a simplified simulation for educational purposes. Actual impact depends on many factors and should be confirmed with a tax professional.'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type = 'income_tax', change_percentage = 0, income_bracket = 'middle' } = body

    const bracket = BRACKET_RATES[income_bracket] || BRACKET_RATES.middle
    const current_rate = bracket.baseRate
    const new_rate = Math.max(0, current_rate + (Number(change_percentage) || 0))

    // Impact across income levels
    const incomeLevels = [300000, 600000, 1000000, 2000000, 5000000]
    const impact_analysis = incomeLevels.map((income) => {
      const currentTax = income * (current_rate / 100)
      const newTax = income * (new_rate / 100)
      const annual_savings = Math.round(currentTax - newTax)
      return {
        income,
        monthly_savings: Math.round(annual_savings / 12),
        annual_savings,
      }
    })

    const average_savings =
      Math.round(impact_analysis.reduce((sum, item) => sum + item.annual_savings, 0) / impact_analysis.length)

    const recommendations: string[] = []
    if (new_rate < current_rate) {
      recommendations.push('A rate cut increases disposable income - direct the surplus into SIPs or debt repayment.')
      recommendations.push('Higher tax on top brackets improves progressivity - the middle class gains the most here.')
      recommendations.push('Lock in the benefit by automating savings on salary day.')
    } else {
      recommendations.push('A rate hike reduces take-home income - review discretionary spending.')
      recommendations.push('Maximise 80C, 80D and NPS deductions to offset the increase.')
      recommendations.push('Consider salary restructuring (allowances) to optimise tax.')
    }

    return NextResponse.json({
      simulation_type: type,
      impact_analysis: {
        current_rate: `${current_rate}%`,
        new_rate: `${new_rate}%`,
        overall_impact: { average_savings },
        impact_analysis,
        recommendations,
      },
      simulation_date: new Date().toISOString().split('T')[0],
      disclaimer: DISCLAIMER,
    })
  } catch (error) {
    console.error('Tax impact simulation error:', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}