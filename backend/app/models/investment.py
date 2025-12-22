from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class InvestmentType(str, Enum):
    SIP = "sip"
    RD = "rd"
    FD = "fd"
    PPF = "ppf"
    NPS = "nps"

class InvestmentRequest(BaseModel):
    investment_type: InvestmentType
    monthly_amount: float = Field(..., gt=0, description="Monthly investment amount in INR")
    annual_return_rate: float = Field(..., gt=0, le=50, description="Expected annual return rate in %")
    investment_period_years: int = Field(..., gt=0, le=50, description="Investment period in years")
    age: Optional[int] = Field(None, ge=18, le=100, description="Current age")
    inflation_rate: Optional[float] = Field(6.0, description="Expected inflation rate in %")

class YearlyBreakdown(BaseModel):
    year: int
    invested_amount: float
    corpus_value: float
    inflation_adjusted_value: float
    real_returns: float

class InvestmentResult(BaseModel):
    investment_type: str
    total_invested: float
    final_corpus: float
    total_returns: float
    inflation_adjusted_corpus: float
    real_returns: float
    yearly_breakdown: List[YearlyBreakdown]
    ai_explanation: str
    recommendations: List[str]

class InsuranceRequest(BaseModel):
    age: int = Field(..., ge=18, le=65)
    annual_income: float = Field(..., gt=0)
    dependents: int = Field(..., ge=0)
    existing_coverage: Optional[float] = Field(0)
    health_conditions: Optional[List[str]] = Field([])

class InsuranceResult(BaseModel):
    recommended_life_cover: float
    recommended_health_cover: float
    estimated_premium: float
    coverage_gap: float
    ai_explanation: str
    recommendations: List[str]