import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Official MSP rates for Kharif and Rabi crops (Government of India).
const MSP_RATES = [
  { crop: 'Paddy (Common)', msp: 2300, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Paddy (Grade A)', msp: 2330, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Jowar (Hybrid)', msp: 3371, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Jowar (Maldandi)', msp: 3421, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Bajra', msp: 2625, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Ragi', msp: 4290, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Maize', msp: 2225, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Arhar (Tur)', msp: 7550, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Moong', msp: 8687, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Urad', msp: 7400, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Groundnut', msp: 6783, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Sunflower Seed', msp: 7280, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Soyabean (Yellow)', msp: 4892, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Sesamum', msp: 7559, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Nigerseed', msp: 8717, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Cotton (Medium Staple)', msp: 7121, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Cotton (Long Staple)', msp: 7521, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Wheat', msp: 2275, unit: 'per quintal', season: 'Rabi' },
  { crop: 'Barley', msp: 1850, unit: 'per quintal', season: 'Rabi' },
  { crop: 'Gram (Chana)', msp: 5650, unit: 'per quintal', season: 'Rabi' },
  { crop: 'Masur (Lentil)', msp: 6700, unit: 'per quintal', season: 'Rabi' },
  { crop: 'Rapeseed & Mustard', msp: 5650, unit: 'per quintal', season: 'Rabi' },
  { crop: 'Safflower', msp: 6950, unit: 'per quintal', season: 'Rabi' },
  { crop: 'Copra (Milling)', msp: 11332, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Copra (Ball)', msp: 11750, unit: 'per quintal', season: 'Kharif' },
  { crop: 'Jute', msp: 5350, unit: 'per quintal', season: 'Kharif' },
]

export async function GET() {
  return NextResponse.json({
    year: '2024-25',
    msp_rates: MSP_RATES,
    note: 'MSP rates for Kharif and Rabi crops of the 2024-25 season, announced by the Government of India. MSP is the minimum price at which farmers can sell their produce to procurement agencies, ensuring assured income. The government has committed to MSP at a minimum of 50% over the cost of production.',
  })
}