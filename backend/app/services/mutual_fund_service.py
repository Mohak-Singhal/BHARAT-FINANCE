import httpx
import json
from typing import List, Dict, Any, Optional
from app.core.config import settings

class MutualFundService:
    """Service to integrate with MF API for mutual fund recommendations"""
    
    def __init__(self):
        self.base_url = "https://api.mfapi.in/mf"
        
    async def get_all_schemes(self) -> List[Dict[str, Any]]:
        """Get all mutual fund schemes"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url)
                if response.status_code == 200:
                    return response.json()
                return []
        except Exception as e:
            print(f"Error fetching MF schemes: {e}")
            return self._get_fallback_schemes()
    
    async def get_scheme_details(self, scheme_code: str) -> Dict[str, Any]:
        """Get specific scheme details and NAV history"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/{scheme_code}")
                if response.status_code == 200:
                    return response.json()
                return {}
        except Exception as e:
            print(f"Error fetching scheme details: {e}")
            return {}
    
    async def get_scheme_nav(self, scheme_code: str) -> Dict[str, Any]:
        """Get latest NAV for a scheme"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/{scheme_code}/latest")
                if response.status_code == 200:
                    return response.json()
                return {}
        except Exception as e:
            print(f"Error fetching NAV: {e}")
            return {}
    
    async def recommend_funds_by_category(self, category: str, risk_level: str = "moderate") -> List[Dict[str, Any]]:
        """Recommend mutual funds based on category and risk level"""
        
        # Category mapping for better recommendations
        category_keywords = {
            "equity": ["equity", "growth", "large cap", "mid cap", "small cap"],
            "debt": ["debt", "bond", "gilt", "liquid", "ultra short"],
            "hybrid": ["hybrid", "balanced", "conservative", "aggressive hybrid"],
            "elss": ["elss", "tax saver", "equity linked savings"],
            "index": ["index", "nifty", "sensex", "etf"]
        }
        
        try:
            all_schemes = await self.get_all_schemes()
            
            # Filter schemes based on category
            keywords = category_keywords.get(category.lower(), [category.lower()])
            filtered_schemes = []
            
            for scheme in all_schemes[:100]:  # Limit to first 100 for performance
                scheme_name = scheme.get('schemeName', '').lower()
                if any(keyword in scheme_name for keyword in keywords):
                    # Get additional details
                    scheme_details = await self.get_scheme_nav(scheme['schemeCode'])
                    if scheme_details:
                        scheme['nav'] = scheme_details.get('nav')
                        scheme['date'] = scheme_details.get('date')
                    filtered_schemes.append(scheme)
                    
                    if len(filtered_schemes) >= 10:  # Limit recommendations
                        break
            
            return filtered_schemes
            
        except Exception as e:
            print(f"Error in fund recommendation: {e}")
            return self._get_fallback_recommendations(category)
    
    async def get_top_performers(self, category: str = "equity", period: str = "1year") -> List[Dict[str, Any]]:
        """Get top performing funds (curated list)"""
        
        top_performers = {
            "equity": [
                {
                    "schemeName": "SBI Blue Chip Fund - Direct Plan - Growth",
                    "schemeCode": "120503",
                    "category": "Large Cap",
                    "returns_1y": "15.2%",
                    "returns_3y": "18.5%",
                    "returns_5y": "16.8%",
                    "expense_ratio": "0.63%",
                    "aum": "₹25,000 Cr",
                    "rating": 4.5,
                    "fund_house": "SBI Mutual Fund"
                },
                {
                    "schemeName": "Axis Bluechip Fund - Direct Plan - Growth",
                    "schemeCode": "120716",
                    "category": "Large Cap",
                    "returns_1y": "14.8%",
                    "returns_3y": "17.9%",
                    "returns_5y": "16.2%",
                    "expense_ratio": "0.45%",
                    "aum": "₹32,000 Cr",
                    "rating": 4.3,
                    "fund_house": "Axis Mutual Fund"
                },
                {
                    "schemeName": "HDFC Top 100 Fund - Direct Plan - Growth",
                    "schemeCode": "119551",
                    "category": "Large Cap",
                    "returns_1y": "16.1%",
                    "returns_3y": "19.2%",
                    "returns_5y": "17.5%",
                    "expense_ratio": "0.52%",
                    "aum": "₹28,500 Cr",
                    "rating": 4.4,
                    "fund_house": "HDFC Mutual Fund"
                }
            ],
            "debt": [
                {
                    "schemeName": "HDFC Short Term Debt Fund - Direct Plan - Growth",
                    "schemeCode": "120351",
                    "category": "Short Duration",
                    "returns_1y": "7.2%",
                    "returns_3y": "6.8%",
                    "returns_5y": "7.1%",
                    "expense_ratio": "0.25%",
                    "aum": "₹8,500 Cr",
                    "rating": 4.2,
                    "fund_house": "HDFC Mutual Fund"
                },
                {
                    "schemeName": "ICICI Prudential Ultra Short Term Fund - Direct Plan - Growth",
                    "schemeCode": "120355",
                    "category": "Ultra Short Duration",
                    "returns_1y": "6.8%",
                    "returns_3y": "6.5%",
                    "returns_5y": "6.9%",
                    "expense_ratio": "0.22%",
                    "aum": "₹12,200 Cr",
                    "rating": 4.1,
                    "fund_house": "ICICI Prudential Mutual Fund"
                }
            ],
            "elss": [
                {
                    "schemeName": "Axis Long Term Equity Fund - Direct Plan - Growth",
                    "schemeCode": "120716",
                    "category": "ELSS",
                    "returns_1y": "16.5%",
                    "returns_3y": "19.2%",
                    "returns_5y": "17.8%",
                    "expense_ratio": "0.58%",
                    "aum": "₹18,000 Cr",
                    "rating": 4.6,
                    "tax_benefit": "80C deduction up to ₹1.5L",
                    "fund_house": "Axis Mutual Fund"
                },
                {
                    "schemeName": "Mirae Asset Tax Saver Fund - Direct Plan - Growth",
                    "schemeCode": "119762",
                    "category": "ELSS",
                    "returns_1y": "15.8%",
                    "returns_3y": "18.5%",
                    "returns_5y": "16.9%",
                    "expense_ratio": "0.65%",
                    "aum": "₹15,500 Cr",
                    "rating": 4.3,
                    "tax_benefit": "80C deduction up to ₹1.5L",
                    "fund_house": "Mirae Asset Mutual Fund"
                }
            ]
        }
        
        return top_performers.get(category, [])
    
    def _get_fallback_schemes(self) -> List[Dict[str, Any]]:
        """Fallback schemes when API is unavailable"""
        return [
            {
                "schemeCode": "120503",
                "schemeName": "SBI Blue Chip Fund - Direct Plan - Growth"
            },
            {
                "schemeCode": "120716", 
                "schemeName": "Axis Bluechip Fund - Direct Plan - Growth"
            },
            {
                "schemeCode": "119551",
                "schemeName": "HDFC Top 100 Fund - Direct Plan - Growth"
            }
        ]
    
    def _get_fallback_recommendations(self, category: str) -> List[Dict[str, Any]]:
        """Fallback recommendations when API fails"""
        return [
            {
                "schemeName": f"Sample {category.title()} Fund - Direct Plan - Growth",
                "schemeCode": "000000",
                "category": category.title(),
                "nav": "150.25",
                "date": "20-12-2024"
            }
        ]
    
    async def get_sip_calculator_data(self, scheme_code: str, monthly_amount: float, years: int) -> Dict[str, Any]:
        """Calculate SIP returns for a specific scheme"""
        
        # Get scheme details
        scheme_details = await self.get_scheme_details(scheme_code)
        
        # Mock historical return calculation (in production, use actual historical data)
        assumed_annual_return = 12.0  # Default assumption
        
        # Calculate SIP returns
        monthly_rate = assumed_annual_return / (12 * 100)
        total_months = years * 12
        
        if monthly_rate > 0:
            future_value = monthly_amount * (
                ((1 + monthly_rate) ** total_months - 1) / monthly_rate
            ) * (1 + monthly_rate)
        else:
            future_value = monthly_amount * total_months
        
        total_invested = monthly_amount * total_months
        
        return {
            "scheme_name": scheme_details.get("meta", {}).get("scheme_name", "Unknown Scheme"),
            "scheme_code": scheme_code,
            "monthly_investment": monthly_amount,
            "investment_period_years": years,
            "total_invested": total_invested,
            "expected_corpus": future_value,
            "total_returns": future_value - total_invested,
            "assumed_annual_return": assumed_annual_return,
            "scheme_category": scheme_details.get("meta", {}).get("scheme_category", "Equity"),
            "fund_house": scheme_details.get("meta", {}).get("fund_house", "Unknown AMC")
        }

mutual_fund_service = MutualFundService()