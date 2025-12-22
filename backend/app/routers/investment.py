from fastapi import APIRouter, HTTPException
from app.models.investment import InvestmentRequest, InvestmentResult, InsuranceRequest, InsuranceResult
from app.services.investment_calculator import investment_calculator
from app.services.mutual_fund_service import mutual_fund_service
from typing import List, Dict, Any

router = APIRouter()

@router.post("/investment", response_model=InvestmentResult)
async def simulate_investment(request: InvestmentRequest):
    """
    Simulate investment returns for SIP, RD, FD, PPF, NPS
    
    - **investment_type**: Type of investment (sip, rd, fd, ppf, nps)
    - **monthly_amount**: Monthly investment amount in INR
    - **annual_return_rate**: Expected annual return rate in %
    - **investment_period_years**: Investment period in years
    - **age**: Current age (optional)
    - **inflation_rate**: Expected inflation rate in % (default: 6%)
    """
    try:
        result = await investment_calculator.simulate_investment(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@router.post("/insurance", response_model=InsuranceResult)
async def calculate_insurance_needs(request: InsuranceRequest):
    """
    Calculate insurance requirements based on user profile
    
    - **age**: Current age
    - **annual_income**: Annual income in INR
    - **dependents**: Number of dependents
    - **existing_coverage**: Existing life insurance coverage
    - **health_conditions**: List of existing health conditions
    """
    try:
        result = await investment_calculator.calculate_insurance_needs(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@router.get("/investment-types")
async def get_investment_types():
    """Get available investment types with descriptions"""
    return {
        "investment_types": [
            {
                "type": "sip",
                "name": "Systematic Investment Plan",
                "description": "Regular monthly investment in mutual funds",
                "typical_returns": "10-15% annually",
                "risk": "Market-linked",
                "liquidity": "High"
            },
            {
                "type": "rd",
                "name": "Recurring Deposit",
                "description": "Fixed monthly deposit with guaranteed returns",
                "typical_returns": "5-7% annually",
                "risk": "Very Low",
                "liquidity": "Low (penalty on early withdrawal)"
            },
            {
                "type": "fd",
                "name": "Fixed Deposit",
                "description": "Lump sum deposit with fixed returns",
                "typical_returns": "5-7% annually",
                "risk": "Very Low",
                "liquidity": "Low (penalty on early withdrawal)"
            },
            {
                "type": "ppf",
                "name": "Public Provident Fund",
                "description": "15-year tax-saving investment scheme",
                "typical_returns": "7-8% annually",
                "risk": "Very Low",
                "liquidity": "Very Low (15-year lock-in)"
            },
            {
                "type": "nps",
                "name": "National Pension System",
                "description": "Retirement-focused investment with tax benefits",
                "typical_returns": "8-12% annually",
                "risk": "Moderate",
                "liquidity": "Very Low (till age 60)"
            }
        ]
    }

@router.get("/mutual-funds/all")
async def get_all_mutual_funds():
    """Get all available mutual fund schemes"""
    try:
        schemes = await mutual_fund_service.get_all_schemes()
        return {"schemes": schemes[:50], "total": len(schemes)}  # Limit for performance
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching mutual funds: {str(e)}")

@router.get("/mutual-funds/recommend/{category}")
async def recommend_mutual_funds(category: str, risk_level: str = "moderate"):
    """Get mutual fund recommendations by category"""
    try:
        recommendations = await mutual_fund_service.recommend_funds_by_category(category, risk_level)
        return {
            "category": category,
            "risk_level": risk_level,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

@router.get("/mutual-funds/top-performers/{category}")
async def get_top_performers(category: str = "equity", period: str = "1year"):
    """Get top performing mutual funds"""
    try:
        top_funds = await mutual_fund_service.get_top_performers(category, period)
        return {
            "category": category,
            "period": period,
            "top_performers": top_funds
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching top performers: {str(e)}")

@router.get("/mutual-funds/scheme/{scheme_code}")
async def get_scheme_details(scheme_code: str):
    """Get detailed information about a specific mutual fund scheme"""
    try:
        details = await mutual_fund_service.get_scheme_details(scheme_code)
        nav_data = await mutual_fund_service.get_scheme_nav(scheme_code)
        
        return {
            "scheme_code": scheme_code,
            "details": details,
            "current_nav": nav_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching scheme details: {str(e)}")

@router.post("/mutual-funds/sip-calculator")
async def calculate_mutual_fund_sip(scheme_code: str, monthly_amount: float, years: int):
    """Calculate SIP returns for a specific mutual fund scheme"""
    try:
        if monthly_amount <= 0 or years <= 0:
            raise HTTPException(status_code=400, detail="Monthly amount and years must be positive")
        
        calculation = await mutual_fund_service.get_sip_calculator_data(scheme_code, monthly_amount, years)
        return calculation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating SIP: {str(e)}")

@router.get("/mutual-funds/categories")
async def get_mutual_fund_categories():
    """Get mutual fund categories with descriptions"""
    return {
        "categories": [
            {
                "category": "equity",
                "name": "Equity Funds",
                "description": "Invest primarily in stocks for long-term growth",
                "risk": "High",
                "expected_returns": "12-15%",
                "investment_horizon": "5+ years"
            },
            {
                "category": "debt",
                "name": "Debt Funds",
                "description": "Invest in bonds and fixed-income securities",
                "risk": "Low to Moderate",
                "expected_returns": "6-9%",
                "investment_horizon": "1-3 years"
            },
            {
                "category": "hybrid",
                "name": "Hybrid Funds",
                "description": "Mix of equity and debt for balanced returns",
                "risk": "Moderate",
                "expected_returns": "8-12%",
                "investment_horizon": "3-5 years"
            },
            {
                "category": "elss",
                "name": "ELSS Funds",
                "description": "Tax-saving equity funds with 3-year lock-in",
                "risk": "High",
                "expected_returns": "12-15%",
                "investment_horizon": "3+ years",
                "tax_benefit": "80C deduction up to ₹1.5L"
            },
            {
                "category": "index",
                "name": "Index Funds",
                "description": "Track market indices like Nifty, Sensex",
                "risk": "Moderate to High",
                "expected_returns": "10-13%",
                "investment_horizon": "5+ years"
            }
        ]
    }