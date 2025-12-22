export interface InvestmentData {
  investment_type: 'sip' | 'rd' | 'fd' | 'ppf' | 'nps'
  monthly_amount: number
  annual_return_rate: number
  investment_period_years: number
  age?: number
  inflation_rate?: number
}

export interface YearlyBreakdown {
  year: number
  invested_amount: number
  corpus_value: number
  inflation_adjusted_value: number
  real_returns: number
}

export interface InvestmentResult {
  investment_type: string
  total_invested: number
  final_corpus: number
  total_returns: number
  inflation_adjusted_corpus: number
  real_returns: number
  yearly_breakdown: YearlyBreakdown[]
  ai_explanation: string
  recommendations: string[]
}

export interface InsuranceData {
  age: number
  annual_income: number
  dependents: number
  existing_coverage?: number
  health_conditions?: string[]
}

export interface InsuranceResult {
  recommended_life_cover: number
  recommended_health_cover: number
  estimated_premium: number
  coverage_gap: number
  ai_explanation: string
  recommendations: string[]
}