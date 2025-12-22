from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class RiskLevel(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

class FinancialGoal(str, Enum):
    EMERGENCY_FUND = "emergency_fund"
    HOME_PURCHASE = "home_purchase"
    RETIREMENT = "retirement"
    CHILD_EDUCATION = "child_education"
    WEALTH_CREATION = "wealth_creation"

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    user_context: Optional[Dict] = Field(None, description="User's financial context")

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    warnings: List[str]
    follow_up_questions: List[str]

class FinancialAnalysisRequest(BaseModel):
    monthly_income: float = Field(..., gt=0)
    monthly_expenses: float = Field(..., gt=0)
    age: int = Field(..., ge=18, le=100)
    risk_level: RiskLevel
    financial_goals: List[FinancialGoal]
    current_savings: Optional[float] = Field(0)
    current_investments: Optional[float] = Field(0)
    dependents: Optional[int] = Field(0)
    city_tier: Optional[str] = Field("tier2", description="tier1, tier2, tier3")

class BudgetRecommendation(BaseModel):
    category: str
    current_allocation: float
    recommended_allocation: float
    difference: float
    explanation: str

class FinancialAnalysisResult(BaseModel):
    financial_health_score: float
    budget_recommendations: List[BudgetRecommendation]
    savings_suggestions: List[str]
    investment_recommendations: List[str]
    insurance_needs: List[str]
    warnings: List[str]
    ai_explanation: str
    action_plan: List[str]