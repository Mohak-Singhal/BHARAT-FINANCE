from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from app.services.budget_analyzer import budget_analyzer, BudgetAnalysis

router = APIRouter()

class BudgetRequest(BaseModel):
    monthly_income: float
    expenses: Dict[str, float]  # category -> amount
    financial_goals: Optional[List[str]] = []
    age: Optional[int] = None
    dependents: Optional[int] = 0

class BudgetOptimizationRequest(BaseModel):
    current_budget: Dict[str, float]
    target_savings_rate: float
    priority_goals: List[str]

@router.post("/analyze", response_model=BudgetAnalysis)
async def analyze_budget(request: BudgetRequest):
    """
    Analyze budget and provide professional recommendations
    
    Provides detailed analysis of spending patterns, savings rate,
    and personalized recommendations for financial optimization.
    """
    try:
        if request.monthly_income <= 0:
            raise HTTPException(status_code=400, detail="Monthly income must be positive")
        
        analysis = budget_analyzer.analyze_budget(
            income=request.monthly_income,
            expenses=request.expenses
        )
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Budget analysis error: {str(e)}")

@router.post("/optimize")
async def optimize_budget(request: BudgetOptimizationRequest):
    """
    Optimize budget to achieve target savings rate
    
    Provides specific recommendations on how to adjust spending
    to reach desired savings goals.
    """
    try:
        total_expenses = sum(request.current_budget.values())
        total_income = total_expenses / (1 - request.target_savings_rate / 100)
        
        # Calculate required expense reduction
        target_expenses = total_income * (1 - request.target_savings_rate / 100)
        reduction_needed = total_expenses - target_expenses
        
        # Generate optimization suggestions
        optimization_plan = {
            "current_expenses": total_expenses,
            "target_expenses": target_expenses,
            "reduction_needed": reduction_needed,
            "target_savings_rate": request.target_savings_rate,
            "optimization_suggestions": []
        }
        
        # Priority-based reduction suggestions
        if reduction_needed > 0:
            suggestions = []
            
            # Discretionary spending cuts (highest priority)
            discretionary = request.current_budget.get('entertainment', 0) + request.current_budget.get('dining', 0)
            if discretionary > 0:
                discretionary_cut = min(discretionary * 0.5, reduction_needed * 0.6)
                suggestions.append({
                    "category": "Discretionary Spending",
                    "current": discretionary,
                    "suggested": discretionary - discretionary_cut,
                    "savings": discretionary_cut,
                    "difficulty": "Easy",
                    "tips": [
                        "Cook at home more often instead of dining out",
                        "Find free entertainment alternatives",
                        "Use streaming services instead of movie theaters"
                    ]
                })
                reduction_needed -= discretionary_cut
            
            # Transportation optimization
            transport = request.current_budget.get('transportation', 0)
            if transport > 0 and reduction_needed > 0:
                transport_cut = min(transport * 0.3, reduction_needed * 0.4)
                suggestions.append({
                    "category": "Transportation",
                    "current": transport,
                    "suggested": transport - transport_cut,
                    "savings": transport_cut,
                    "difficulty": "Medium",
                    "tips": [
                        "Use public transportation or carpooling",
                        "Work from home when possible",
                        "Combine errands into single trips"
                    ]
                })
                reduction_needed -= transport_cut
            
            # Utilities optimization
            utilities = request.current_budget.get('utilities', 0)
            if utilities > 0 and reduction_needed > 0:
                utilities_cut = min(utilities * 0.2, reduction_needed)
                suggestions.append({
                    "category": "Utilities",
                    "current": utilities,
                    "suggested": utilities - utilities_cut,
                    "savings": utilities_cut,
                    "difficulty": "Easy",
                    "tips": [
                        "Switch to energy-efficient appliances",
                        "Negotiate better rates with service providers",
                        "Reduce unnecessary usage"
                    ]
                })
            
            optimization_plan["optimization_suggestions"] = suggestions
        
        return optimization_plan
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Budget optimization error: {str(e)}")

@router.get("/templates")
async def get_budget_templates():
    """Get budget templates for different income levels and life stages"""
    
    templates = {
        "young_professional": {
            "income_range": "₹30,000 - ₹60,000",
            "age_group": "22-30 years",
            "template": {
                "essential_expenses": 50,  # percentage
                "discretionary_spending": 25,
                "savings_investments": 20,
                "emergency_fund": 5
            },
            "priorities": [
                "Build emergency fund",
                "Start SIP investments",
                "Get health insurance",
                "Skill development"
            ]
        },
        "family_oriented": {
            "income_range": "₹60,000 - ₹1,50,000",
            "age_group": "30-45 years",
            "template": {
                "essential_expenses": 55,
                "discretionary_spending": 20,
                "savings_investments": 20,
                "children_education": 5
            },
            "priorities": [
                "Children's education fund",
                "Life insurance",
                "Home loan planning",
                "Retirement savings"
            ]
        },
        "pre_retirement": {
            "income_range": "₹1,00,000+",
            "age_group": "45-60 years",
            "template": {
                "essential_expenses": 45,
                "discretionary_spending": 15,
                "savings_investments": 30,
                "healthcare": 10
            },
            "priorities": [
                "Maximize retirement corpus",
                "Healthcare planning",
                "Debt elimination",
                "Estate planning"
            ]
        }
    }
    
    return {"templates": templates}

@router.get("/expense-categories")
async def get_expense_categories():
    """Get standardized expense categories for budget tracking"""
    
    categories = {
        "essential": {
            "housing": {
                "name": "Housing (Rent/EMI)",
                "description": "Rent, home loan EMI, property tax, maintenance",
                "typical_percentage": "25-30%"
            },
            "food": {
                "name": "Food & Groceries",
                "description": "Groceries, household items, basic food expenses",
                "typical_percentage": "10-15%"
            },
            "utilities": {
                "name": "Utilities",
                "description": "Electricity, water, gas, internet, mobile",
                "typical_percentage": "5-8%"
            },
            "transportation": {
                "name": "Transportation",
                "description": "Fuel, public transport, vehicle maintenance",
                "typical_percentage": "8-12%"
            },
            "healthcare": {
                "name": "Healthcare",
                "description": "Medical expenses, insurance premiums",
                "typical_percentage": "3-5%"
            }
        },
        "discretionary": {
            "entertainment": {
                "name": "Entertainment",
                "description": "Movies, subscriptions, hobbies, sports",
                "typical_percentage": "5-10%"
            },
            "dining": {
                "name": "Dining Out",
                "description": "Restaurants, food delivery, social dining",
                "typical_percentage": "5-8%"
            },
            "shopping": {
                "name": "Shopping",
                "description": "Clothing, electronics, non-essential items",
                "typical_percentage": "5-10%"
            },
            "travel": {
                "name": "Travel & Vacation",
                "description": "Holidays, weekend trips, travel expenses",
                "typical_percentage": "3-8%"
            }
        },
        "financial": {
            "savings": {
                "name": "Savings",
                "description": "Bank savings, fixed deposits",
                "typical_percentage": "10-15%"
            },
            "investments": {
                "name": "Investments",
                "description": "Mutual funds, stocks, SIP, PPF",
                "typical_percentage": "10-20%"
            },
            "insurance": {
                "name": "Insurance",
                "description": "Life, health, vehicle insurance premiums",
                "typical_percentage": "3-5%"
            },
            "debt_payments": {
                "name": "Debt Payments",
                "description": "Credit card, personal loan, other EMIs",
                "typical_percentage": "0-10%"
            }
        }
    }
    
    return {"categories": categories}

@router.post("/track-expenses")
async def track_monthly_expenses(expenses: Dict[str, float], month: str, year: int):
    """Track monthly expenses for budget analysis"""
    
    # In a real application, this would save to database
    # For now, return analysis of the submitted expenses
    
    total_expenses = sum(expenses.values())
    
    # Categorize expenses
    essential = sum([
        expenses.get('housing', 0),
        expenses.get('food', 0),
        expenses.get('utilities', 0),
        expenses.get('transportation', 0),
        expenses.get('healthcare', 0)
    ])
    
    discretionary = sum([
        expenses.get('entertainment', 0),
        expenses.get('dining', 0),
        expenses.get('shopping', 0),
        expenses.get('travel', 0)
    ])
    
    financial = sum([
        expenses.get('savings', 0),
        expenses.get('investments', 0),
        expenses.get('insurance', 0)
    ])
    
    analysis = {
        "month": month,
        "year": year,
        "total_expenses": total_expenses,
        "breakdown": {
            "essential": {
                "amount": essential,
                "percentage": (essential / total_expenses * 100) if total_expenses > 0 else 0
            },
            "discretionary": {
                "amount": discretionary,
                "percentage": (discretionary / total_expenses * 100) if total_expenses > 0 else 0
            },
            "financial": {
                "amount": financial,
                "percentage": (financial / total_expenses * 100) if total_expenses > 0 else 0
            }
        },
        "insights": [
            f"Essential expenses: ₹{essential:,.0f} ({essential/total_expenses*100:.1f}%)" if total_expenses > 0 else "No expenses recorded",
            f"Discretionary spending: ₹{discretionary:,.0f} ({discretionary/total_expenses*100:.1f}%)" if total_expenses > 0 else "",
            f"Financial allocations: ₹{financial:,.0f} ({financial/total_expenses*100:.1f}%)" if total_expenses > 0 else ""
        ]
    }
    
    return analysis

@router.get("/savings-goals")
async def get_savings_goal_calculator():
    """Get savings goal calculation templates"""
    
    goals = {
        "emergency_fund": {
            "name": "Emergency Fund",
            "description": "3-6 months of essential expenses",
            "calculation": "monthly_essential_expenses * 6",
            "priority": "High",
            "timeline": "6-12 months"
        },
        "home_down_payment": {
            "name": "Home Down Payment",
            "description": "20% of property value",
            "calculation": "property_value * 0.20",
            "priority": "Medium",
            "timeline": "2-5 years"
        },
        "child_education": {
            "name": "Child Education Fund",
            "description": "Future education costs with inflation",
            "calculation": "current_education_cost * (1.08 ^ years_to_education)",
            "priority": "High",
            "timeline": "10-18 years"
        },
        "retirement": {
            "name": "Retirement Corpus",
            "description": "25x annual expenses at retirement",
            "calculation": "annual_expenses_at_retirement * 25",
            "priority": "High",
            "timeline": "20-40 years"
        },
        "vacation": {
            "name": "Dream Vacation",
            "description": "Travel and experience fund",
            "calculation": "estimated_vacation_cost",
            "priority": "Low",
            "timeline": "1-3 years"
        }
    }
    
    return {"savings_goals": goals}