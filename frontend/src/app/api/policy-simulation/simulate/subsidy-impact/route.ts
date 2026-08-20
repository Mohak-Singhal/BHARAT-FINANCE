import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SECTOR_WEIGHTS: Record<string, { weight: number; sectors: string[] }> = {
  fuel: { weight: 1.0, sectors: ['Transportation', 'Agriculture', 'Household'] },
  fertilizer: { weight: 1.2, sectors: ['Agriculture', 'Food Processing'] },
  electricity: { weight: 0.9, sectors: ['Manufacturing', 'Household', 'Agriculture'] },
  food: { weight: 1.1, sectors: ['Food Processing', 'Household'] },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type = 'fuel', amount_change = 0, sector = 'transportation' } = body

    const weight = SECTOR_WEIGHTS[type]?.weight || 1
    const affected_sectors = SECTOR_WEIGHTS[type]?.sectors || ['Household']

    const direct_impact = Math.round((Number(amount_change) || 0) * weight * 12) // annualised per household

    const household_impact: Record<string, { monthly_savings: number; annual_savings: number }> = {}
    for (const s of affected_sectors) {
      const monthly = Math.round((Number(amount_change) || 0) * weight * (s === 'Household' ? 1 : 0.6))
      household_impact[s.toLowerCase().replace(/ /g, '_')] = {
        monthly_savings: monthly,
        annual_savings: monthly * 12,
      }
    }

    const recommendations: string[] = []
    if (direct_impact < 0) {
      recommendations.push('Subsidy cut raises costs - switch to more efficient alternatives in this sector.')
      recommendations.push(`The ${sector} sector faces the largest impact - plan for higher input costs.`)
    } else {
      recommendations.push('Increased subsidy improves household affordability - use the savings for debt reduction.')
      recommendations.push(`Focus on the ${sector} sector for the biggest benefit of this change.`)
    }
    recommendations.push('Track subsidy announcements quarterly as budgets are revised.')

    return NextResponse.json({
      simulation_type: `${type} subsidy`,
      impact_analysis: {
        direct_impact,
        affected_sectors,
        household_impact,
        recommendations,
      },
      simulation_date: new Date().toISOString().split('T')[0],
      disclaimer:
        'This is a simplified simulation for educational purposes. Actual impact depends on market conditions and policy details.',
    })
  } catch (error) {
    console.error('Subsidy impact simulation error:', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}