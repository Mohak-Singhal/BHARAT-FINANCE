import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SUPPORTED_LANGUAGES = [
  { code: 'english', name: 'English', native: 'English' },
  { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
  { code: 'marathi', name: 'Marathi', native: 'मराठी' },
  { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
  { code: 'telugu', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bengali', name: 'Bengali', native: 'বাংলা' },
]

export async function GET() {
  return NextResponse.json({ languages: SUPPORTED_LANGUAGES })
}