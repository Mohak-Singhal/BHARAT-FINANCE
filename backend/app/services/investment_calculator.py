import math
from typing import List, Dict, Any
from app.models.investment import InvestmentRequest, InvestmentResult, YearlyBreakdown, InsuranceRequest, InsuranceResult
from app.services.gemini_service import gemini_service

class InvestmentCalculator:
    
    def calculate_sip(self, request: InvestmentRequest) -> Dict[str, Any]:
        """Calculate SIP returns using compound interest formula"""
        monthly_rate = request.annual_return_rate / (12 * 100)
        total_months = request.investment_period_years * 12
        
        # SIP Future Value Formula: PMT * [((1 + r)^n - 1) / r] * (1 + r)
        if monthly_rate > 0:
            future_value = request.monthly_amount * (
                ((1 + monthly_rate) ** total_months - 1) / monthly_rate
            ) * (1 + monthly_rate)
        else:
            future_value = request.monthly_amount * total_months
        
        total_invested = request.monthly_amount * total_months
        
        return {
            'total_invested': total_invested,
            'final_corpus': future_value,
            'total_returns': future_value - total_invested
        }
    
    def calculate_rd(self, request: InvestmentRequest) -> Dict[str, Any]:
        """Calculate Recurring Deposit returns"""
        # RD typically has quarterly compounding
        quarterly_rate = request.annual_return_rate / (4 * 100)
        total_quarters = request.investment_period_years * 4
        monthly_amount = request.monthly_amount
        
        # RD formula with quarterly compounding
        maturity_amount = 0
        for month in range(1, int(request.investment_period_years * 12) + 1):
            quarters_remaining = (request.investment_period_years * 12 - month) / 3
            maturity_amount += monthly_amount * ((1 + quarterly_rate) ** quarters_remaining)
        
        total_invested = request.monthly_amount * request.investment_period_years * 12
        
        return {
            'total_invested': total_invested,
            'final_corpus': maturity_amount,
            'total_returns': maturity_amount - total_invested
        }
    
    def calculate_fd(self, request: InvestmentRequest) -> Dict[str, Any]:
        """Calculate Fixed Deposit returns"""
        principal = request.monthly_amount * 12  # Annual investment
        rate = request.annual_return_rate / 100
        time = request.investment_period_years
        
        # Compound interest formula: A = P(1 + r)^t
        final_amount = principal * ((1 + rate) ** time)
        total_invested = principal * time
        
        return {
            'total_invested': total_invested,
            'final_corpus': final_amount,
            'total_returns': final_amount - total_invested
        }
    
    def calculate_ppf(self, request: InvestmentRequest) -> Dict[str, Any]:
        """Calculate PPF returns (15-year lock-in, current rate ~7.1%)"""
        annual_investment = request.monthly_amount * 12
        ppf_rate = 7.1 / 100  # Current PPF rate
        years = min(request.investment_period_years, 15)  # PPF is 15 years
        
        maturity_amount = 0
        for year in range(1, years + 1):
            maturity_amount = (maturity_amount + annual_investment) * (1 + ppf_rate)
        
        total_invested = annual_investment * years
        
        return {
            'total_invested': total_invested,
            'final_corpus': maturity_amount,
            'total_returns': maturity_amount - total_invested
        }
    
    def calculate_nps(self, request: InvestmentRequest) -> Dict[str, Any]:
        """Calculate NPS returns"""
        # NPS allows withdrawal at 60, so calculate accordingly
        monthly_amount = request.monthly_amount
        annual_rate = request.annual_return_rate / 100
        monthly_rate = annual_rate / 12
        total_months = request.investment_period_years * 12
        
        # SIP-like calculation for NPS
        if monthly_rate > 0:
            corpus = monthly_amount * (
                ((1 + monthly_rate) ** total_months - 1) / monthly_rate
            )
        else:
            corpus = monthly_amount * total_months
        
        total_invested = monthly_amount * total_months
        
        # NPS allows 60% lump sum withdrawal, 40% annuity
        lump_sum = corpus * 0.6
        annuity_amount = corpus * 0.4
        
        return {
            'total_invested': total_invested,
            'final_corpus': corpus,
            'total_returns': corpus - total_invested,
            'lump_sum_withdrawal': lump_sum,
            'annuity_amount': annuity_amount
        }
    
    def generate_yearly_breakdown(self, request: InvestmentRequest, calculation_result: Dict) -> List[YearlyBreakdown]:
        """Generate year-wise breakdown of investment growth"""
        breakdown = []
        monthly_rate = request.annual_return_rate / (12 * 100)
        inflation_rate = request.inflation_rate / 100
        
        for year in range(1, request.investment_period_years + 1):
            months = year * 12
            invested_amount = request.monthly_amount * months
            
            # Calculate corpus value at this year
            if request.investment_type.value == "sip":
                if monthly_rate > 0:
                    corpus_value = request.monthly_amount * (
                        ((1 + monthly_rate) ** months - 1) / monthly_rate
                    ) * (1 + monthly_rate)
                else:
                    corpus_value = invested_amount
            else:
                # Simplified calculation for other types
                annual_rate = request.annual_return_rate / 100
                corpus_value = invested_amount * ((1 + annual_rate) ** year)
            
            # Inflation-adjusted value
            inflation_adjusted = corpus_value / ((1 + inflation_rate) ** year)
            real_returns = inflation_adjusted - invested_amount
            
            breakdown.append(YearlyBreakdown(
                year=year,
                invested_amount=invested_amount,
                corpus_value=corpus_value,
                inflation_adjusted_value=inflation_adjusted,
                real_returns=real_returns
            ))
        
        return breakdown
    
    async def simulate_investment(self, request: InvestmentRequest) -> InvestmentResult:
        """Main method to simulate investment and generate AI explanation"""
        
        # Calculate based on investment type
        calculation_methods = {
            "sip": self.calculate_sip,
            "rd": self.calculate_rd,
            "fd": self.calculate_fd,
            "ppf": self.calculate_ppf,
            "nps": self.calculate_nps
        }
        
        calc_method = calculation_methods.get(request.investment_type.value, self.calculate_sip)
        result = calc_method(request)
        
        # Generate yearly breakdown
        yearly_breakdown = self.generate_yearly_breakdown(request, result)
        
        # Calculate inflation-adjusted final corpus
        inflation_rate = request.inflation_rate / 100
        inflation_adjusted_corpus = result['final_corpus'] / (
            (1 + inflation_rate) ** request.investment_period_years
        )
        real_returns = inflation_adjusted_corpus - result['total_invested']
        
        # Prepare data for AI explanation
        investment_data = {
            'investment_type': request.investment_type.value.upper(),
            'monthly_amount': request.monthly_amount,
            'period_years': request.investment_period_years,
            'return_rate': request.annual_return_rate,
            'total_invested': result['total_invested'],
            'final_corpus': result['final_corpus'],
            'inflation_adjusted_corpus': inflation_adjusted_corpus,
            'real_returns': real_returns
        }
        
        # Get AI explanation
        ai_explanation = await gemini_service.explain_investment_result(investment_data)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(request, result)
        
        return InvestmentResult(
            investment_type=request.investment_type.value.upper(),
            total_invested=result['total_invested'],
            final_corpus=result['final_corpus'],
            total_returns=result['total_returns'],
            inflation_adjusted_corpus=inflation_adjusted_corpus,
            real_returns=real_returns,
            yearly_breakdown=yearly_breakdown,
            ai_explanation=ai_explanation,
            recommendations=recommendations
        )
    
    def _generate_recommendations(self, request: InvestmentRequest, result: Dict) -> List[str]:
        """Generate investment recommendations"""
        recommendations = []
        
        if request.investment_type.value == "sip":
            recommendations.extend([
                "Consider increasing SIP amount by 10% annually",
                "Diversify across large-cap, mid-cap, and international funds",
                "Review and rebalance portfolio every 6 months"
            ])
        elif request.investment_type.value == "ppf":
            recommendations.extend([
                "PPF has 15-year lock-in period with tax benefits",
                "Maximum investment limit is ₹1.5 lakh per year",
                "Consider additional investments for higher returns"
            ])
        elif request.investment_type.value == "nps":
            recommendations.extend([
                "NPS offers additional tax deduction under 80CCD(1B)",
                "Choose active choice for better returns",
                "Review asset allocation based on age"
            ])
        
        return recommendations
    
    async def calculate_insurance_needs(self, request: InsuranceRequest) -> InsuranceResult:
        """Calculate insurance requirements"""
        
        # Life insurance calculation (10-15x annual income)
        recommended_life_cover = request.annual_income * 12
        
        # Health insurance (₹5-10 lakh minimum in metros)
        base_health_cover = 500000  # ₹5 lakh base
        if request.dependents > 0:
            base_health_cover += request.dependents * 200000
        
        recommended_health_cover = max(base_health_cover, request.annual_income * 0.5)
        
        # Estimate premium (rough calculation)
        life_premium = recommended_life_cover * 0.002  # 0.2% of cover
        health_premium = recommended_health_cover * 0.03  # 3% of cover
        estimated_premium = life_premium + health_premium
        
        # Coverage gap
        coverage_gap = max(0, recommended_life_cover - request.existing_coverage)
        
        # Get AI explanation
        insurance_data = {
            'age': request.age,
            'annual_income': request.annual_income,
            'dependents': request.dependents,
            'recommended_life_cover': recommended_life_cover,
            'recommended_health_cover': recommended_health_cover,
            'coverage_gap': coverage_gap
        }
        
        ai_explanation = await gemini_service.generate_content(
            f"Explain insurance needs for: Age {request.age}, Income ₹{request.annual_income:,.0f}, "
            f"Dependents {request.dependents}. Recommended life cover: ₹{recommended_life_cover:,.0f}",
            insurance_data
        )
        
        recommendations = [
            "Buy term life insurance early for lower premiums",
            "Choose health insurance with family floater option",
            "Consider critical illness and disability coverage",
            "Review insurance needs every 3-5 years"
        ]
        
        return InsuranceResult(
            recommended_life_cover=recommended_life_cover,
            recommended_health_cover=recommended_health_cover,
            estimated_premium=estimated_premium,
            coverage_gap=coverage_gap,
            ai_explanation=ai_explanation,
            recommendations=recommendations
        )

investment_calculator = InvestmentCalculator()