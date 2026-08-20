import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Example products and their pre-duty prices by category.
const CATEGORY_PRODUCTS: Record<string, Record<string, number>> = {
  electronics: {
    Smartphone: 20000,
    Laptop: 55000,
    'LED TV 43"': 28000,
  },
  automobiles: {
    '2-Wheeler': 90000,
    'Compact Car': 600000,
    'SUV (Base)': 1500000,
  },
  textiles: {
    'Cotton Shirt': 1200,
    'Saree (Silk)': 3500,
    Jeans: 1800,
  },
  machinery: {
    'CNC Machine': 800000,
    Generator: 150000,
    'Tractor Attachment': 250000,
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category = 'electronics', duty_change_percentage = 0, current_duty_percentage = 10 } = body

    const current_duty = Number(current_duty_percentage) || 0
    const new_duty = Math.max(0, current_duty + (Number(duty_change_percentage) || 0))

    const products = CATEGORY_PRODUCTS[category] || CATEGORY_PRODUCTS.electronics
    const dutyDelta = new_duty - current_duty

    const example_product_price_change: Record<string, string> = {}
    let totalPriceIncreasePct = 0
    let count = 0
    for (const [product, basePrice] of Object.entries(products)) {
      const priceIncrease = basePrice * (dutyDelta / 100)
      example_product_price_change[product] = `₹${Math.round(basePrice + priceIncrease).toLocaleString('en-IN')}`
      totalPriceIncreasePct += (priceIncrease / basePrice) * 100
      count++
    }

    const price_increase_percentage = count > 0 ? totalPriceIncreasePct / count : 0

    const recommendations: string[] = []
    if (dutyDelta > 0) {
      recommendations.push('Higher import duty raises prices - consider buying before the hike or exploring domestic alternatives.')
      recommendations.push('Domestic manufacturers benefit from this policy - check Make in India schemes.')
    } else if (dutyDelta < 0) {
      recommendations.push('Lower import duty reduces prices - good time for planned purchases of imported goods.')
      recommendations.push('Domestic industry may face more competition - review sector exposure.')
    } else {
      recommendations.push('No change in duty - prices remain stable for this category.')
    }

    return NextResponse.json({
      simulation_type: `${category} import duty`,
      impact_analysis: {
        current_duty: `${current_duty}%`,
        new_duty: `${new_duty}%`,
        price_impact: {
          price_increase_percentage: Number(price_increase_percentage.toFixed(1)),
          example_product_price_change,
        },
        recommendations,
      },
      simulation_date: new Date().toISOString().split('T')[0],
      disclaimer:
        'This is a simplified simulation for educational purposes. Actual prices depend on exchange rates, taxes and market conditions.',
    })
  } catch (error) {
    console.error('Import duty simulation error:', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}