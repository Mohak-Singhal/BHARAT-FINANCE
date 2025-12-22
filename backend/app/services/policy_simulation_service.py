import httpx
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json

class PolicySimulationService:
    """Service for simulating economic impact of government policies"""
    
    def __init__(self):
        self.api_setu_base = "https://directory.apisetu.gov.in"
        
    async def simulate_tax_impact(self, policy_change: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate impact of tax policy changes"""
        
        policy_type = policy_change.get("type", "income_tax")
        change_percentage = policy_change.get("change_percentage", 0)
        income_bracket = policy_change.get("income_bracket", "middle")
        
        # Sample income brackets for simulation
        income_brackets = {
            "low": {"min": 0, "max": 500000, "current_rate": 5},
            "middle": {"min": 500000, "max": 1000000, "current_rate": 20},
            "high": {"min": 1000000, "max": float('inf'), "current_rate": 30}
        }
        
        bracket_info = income_brackets.get(income_bracket, income_brackets["middle"])
        current_rate = bracket_info["current_rate"]
        new_rate = current_rate + change_percentage
        
        # Calculate impact for different income levels
        sample_incomes = [300000, 600000, 800000, 1200000, 2000000]
        impact_analysis = []
        
        for income in sample_incomes:
            if bracket_info["min"] <= income <= bracket_info["max"]:
                current_tax = income * (current_rate / 100)
                new_tax = income * (new_rate / 100)
                savings = current_tax - new_tax
                
                impact_analysis.append({
                    "income": income,
                    "current_tax": current_tax,
                    "new_tax": new_tax,
                    "annual_savings": savings,
                    "monthly_savings": savings / 12,
                    "percentage_change": (savings / current_tax) * 100 if current_tax > 0 else 0
                })
        
        return {
            "policy_type": policy_type,
            "change_description": f"Tax rate change of {change_percentage}% for {income_bracket} income bracket",
            "current_rate": f"{current_rate}%",
            "new_rate": f"{new_rate}%",
            "impact_analysis": impact_analysis,
            "overall_impact": {
                "average_savings": sum(item["annual_savings"] for item in impact_analysis) / len(impact_analysis),
                "affected_population": f"{income_bracket.title()} income earners",
                "economic_effect": "Positive" if change_percentage < 0 else "Negative"
            },
            "recommendations": self._get_tax_recommendations(change_percentage, income_bracket)
        }
    
    async def simulate_subsidy_impact(self, subsidy_info: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate impact of subsidy changes"""
        
        subsidy_type = subsidy_info.get("type", "fuel")
        amount_change = subsidy_info.get("amount_change", 0)  # in rupees
        sector = subsidy_info.get("sector", "transportation")
        
        # Subsidy impact calculations
        subsidy_impacts = {
            "fuel": {
                "direct_impact": amount_change,
                "indirect_impacts": {
                    "transportation_cost": amount_change * 1.2,
                    "food_prices": amount_change * 0.3,
                    "electricity_cost": amount_change * 0.15
                },
                "affected_sectors": ["Transportation", "Agriculture", "Manufacturing"]
            },
            "fertilizer": {
                "direct_impact": amount_change,
                "indirect_impacts": {
                    "crop_production_cost": amount_change * 0.8,
                    "food_prices": amount_change * 0.5,
                    "farmer_income": -amount_change * 0.6
                },
                "affected_sectors": ["Agriculture", "Food Processing", "Rural Economy"]
            },
            "electricity": {
                "direct_impact": amount_change,
                "indirect_impacts": {
                    "manufacturing_cost": amount_change * 0.4,
                    "household_expenses": amount_change * 1.0,
                    "business_operations": amount_change * 0.6
                },
                "affected_sectors": ["Manufacturing", "Services", "Households"]
            }
        }
        
        impact_data = subsidy_impacts.get(subsidy_type, subsidy_impacts["fuel"])
        
        # Calculate household impact
        household_impact = self._calculate_household_impact(subsidy_type, amount_change)
        
        # Calculate business impact
        business_impact = self._calculate_business_impact(subsidy_type, amount_change)
        
        return {
            "subsidy_type": subsidy_type,
            "change_amount": amount_change,
            "change_description": f"Subsidy change of ₹{amount_change} per unit for {subsidy_type}",
            "direct_impact": impact_data["direct_impact"],
            "indirect_impacts": impact_data["indirect_impacts"],
            "affected_sectors": impact_data["affected_sectors"],
            "household_impact": household_impact,
            "business_impact": business_impact,
            "timeline": {
                "immediate": "0-1 months",
                "short_term": "1-6 months", 
                "long_term": "6+ months"
            },
            "recommendations": self._get_subsidy_recommendations(subsidy_type, amount_change)
        }
    
    async def simulate_import_duty_impact(self, duty_info: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate impact of import duty changes"""
        
        product_category = duty_info.get("category", "electronics")
        duty_change = duty_info.get("duty_change_percentage", 0)
        current_duty = duty_info.get("current_duty_percentage", 10)
        
        new_duty = current_duty + duty_change
        
        # Product categories and their impact multipliers
        category_impacts = {
            "electronics": {
                "price_impact_multiplier": 0.8,
                "demand_elasticity": -0.6,
                "domestic_production_boost": 0.4
            },
            "automobiles": {
                "price_impact_multiplier": 0.9,
                "demand_elasticity": -0.8,
                "domestic_production_boost": 0.6
            },
            "textiles": {
                "price_impact_multiplier": 0.7,
                "demand_elasticity": -0.4,
                "domestic_production_boost": 0.3
            },
            "machinery": {
                "price_impact_multiplier": 0.85,
                "demand_elasticity": -0.3,
                "domestic_production_boost": 0.2
            }
        }
        
        category_data = category_impacts.get(product_category, category_impacts["electronics"])
        
        # Calculate price impact
        price_increase_percentage = duty_change * category_data["price_impact_multiplier"]
        
        # Calculate demand impact
        demand_change_percentage = price_increase_percentage * category_data["demand_elasticity"]
        
        # Calculate domestic production impact
        domestic_boost_percentage = duty_change * category_data["domestic_production_boost"]
        
        return {
            "product_category": product_category,
            "current_duty": f"{current_duty}%",
            "new_duty": f"{new_duty}%",
            "duty_change": f"{duty_change}%",
            "price_impact": {
                "price_increase_percentage": price_increase_percentage,
                "example_product_price_change": {
                    "₹10,000 product": f"₹{10000 * (1 + price_increase_percentage/100):.0f}",
                    "₹50,000 product": f"₹{50000 * (1 + price_increase_percentage/100):.0f}",
                    "₹100,000 product": f"₹{100000 * (1 + price_increase_percentage/100):.0f}"
                }
            },
            "market_impact": {
                "demand_change_percentage": demand_change_percentage,
                "domestic_production_boost_percentage": domestic_boost_percentage,
                "import_volume_change": demand_change_percentage * 0.7
            },
            "consumer_impact": self._calculate_consumer_impact(price_increase_percentage, product_category),
            "industry_impact": self._calculate_industry_impact(domestic_boost_percentage, product_category),
            "recommendations": self._get_import_duty_recommendations(duty_change, product_category)
        }
    
    async def get_policy_timeline(self, policy_type: str) -> Dict[str, Any]:
        """Get timeline of recent policy changes"""
        
        # Mock policy timeline data (in production, fetch from government APIs)
        policy_timelines = {
            "tax": [
                {
                    "date": "2024-02-01",
                    "policy": "Income Tax Slab Revision",
                    "description": "New tax regime made default with higher standard deduction",
                    "impact": "Positive for middle-income taxpayers"
                },
                {
                    "date": "2024-07-01", 
                    "policy": "GST Rate Changes",
                    "description": "Reduced GST on essential items, increased on luxury goods",
                    "impact": "Mixed impact across sectors"
                }
            ],
            "subsidy": [
                {
                    "date": "2024-01-15",
                    "policy": "Fertilizer Subsidy Increase",
                    "description": "₹2000 per bag additional subsidy for farmers",
                    "impact": "Reduced input costs for agriculture"
                },
                {
                    "date": "2024-06-01",
                    "policy": "LPG Subsidy Adjustment",
                    "description": "Targeted subsidy for BPL families",
                    "impact": "Focused relief for low-income households"
                }
            ],
            "import_duty": [
                {
                    "date": "2024-03-01",
                    "policy": "Electronics Import Duty Hike",
                    "description": "Increased duty on smartphones and laptops by 5%",
                    "impact": "Boost to domestic manufacturing"
                }
            ]
        }
        
        return {
            "policy_type": policy_type,
            "recent_changes": policy_timelines.get(policy_type, []),
            "upcoming_changes": [
                {
                    "expected_date": "2025-02-01",
                    "policy": f"Upcoming {policy_type} policy review",
                    "description": "Annual policy review and adjustments"
                }
            ]
        }
    
    def _calculate_household_impact(self, subsidy_type: str, amount_change: float) -> Dict[str, Any]:
        """Calculate impact on household expenses"""
        
        monthly_consumption = {
            "fuel": {"low_income": 2000, "middle_income": 4000, "high_income": 8000},
            "electricity": {"low_income": 1500, "middle_income": 3000, "high_income": 6000},
            "fertilizer": {"rural": 500, "urban": 0}  # Indirect impact through food prices
        }
        
        consumption_data = monthly_consumption.get(subsidy_type, monthly_consumption["fuel"])
        
        impact = {}
        for category, monthly_spend in consumption_data.items():
            impact[category] = {
                "monthly_savings": (amount_change / 100) * monthly_spend,
                "annual_savings": (amount_change / 100) * monthly_spend * 12,
                "percentage_of_income": f"{((amount_change / 100) * monthly_spend * 12) / (monthly_spend * 20):.1f}%"
            }
        
        return impact
    
    def _calculate_business_impact(self, subsidy_type: str, amount_change: float) -> Dict[str, Any]:
        """Calculate impact on business operations"""
        
        business_impacts = {
            "fuel": {
                "transportation_companies": {"cost_change_percentage": amount_change * 0.8},
                "manufacturing": {"cost_change_percentage": amount_change * 0.3},
                "agriculture": {"cost_change_percentage": amount_change * 0.4}
            },
            "electricity": {
                "manufacturing": {"cost_change_percentage": amount_change * 0.6},
                "services": {"cost_change_percentage": amount_change * 0.2},
                "retail": {"cost_change_percentage": amount_change * 0.3}
            }
        }
        
        return business_impacts.get(subsidy_type, {})
    
    def _calculate_consumer_impact(self, price_increase: float, category: str) -> Dict[str, Any]:
        """Calculate consumer impact of price changes"""
        
        return {
            "price_increase_percentage": price_increase,
            "affordability_impact": "High" if price_increase > 10 else "Moderate" if price_increase > 5 else "Low",
            "substitution_likelihood": "High" if price_increase > 15 else "Moderate",
            "purchase_delay_probability": f"{min(price_increase * 2, 50):.0f}%"
        }
    
    def _calculate_industry_impact(self, production_boost: float, category: str) -> Dict[str, Any]:
        """Calculate industry impact of policy changes"""
        
        return {
            "domestic_production_boost": f"{production_boost:.1f}%",
            "employment_impact": f"{production_boost * 0.3:.1f}% increase in jobs",
            "investment_attraction": "High" if production_boost > 20 else "Moderate",
            "competitiveness_improvement": f"{production_boost * 0.5:.1f}%"
        }
    
    def _get_tax_recommendations(self, change_percentage: float, bracket: str) -> List[str]:
        """Get recommendations based on tax changes"""
        
        if change_percentage < 0:  # Tax reduction
            return [
                "Consider increasing investments in tax-saving instruments",
                "Review and optimize your tax planning strategy",
                "Explore additional income sources to maximize benefits",
                "Consider upgrading lifestyle within new tax savings"
            ]
        else:  # Tax increase
            return [
                "Maximize deductions under Section 80C, 80D",
                "Consider switching to new tax regime if beneficial",
                "Plan major purchases before tax implementation",
                "Explore tax-efficient investment options"
            ]
    
    def _get_subsidy_recommendations(self, subsidy_type: str, amount_change: float) -> List[str]:
        """Get recommendations based on subsidy changes"""
        
        if amount_change > 0:  # Subsidy increase
            return [
                f"Take advantage of reduced {subsidy_type} costs",
                "Consider increasing consumption/usage efficiently",
                "Plan long-term investments in related areas",
                "Budget the savings for other financial goals"
            ]
        else:  # Subsidy reduction
            return [
                f"Budget for increased {subsidy_type} expenses",
                "Look for alternative/efficient options",
                "Consider bulk purchases before price increases",
                "Adjust monthly budget to accommodate changes"
            ]
    
    def _get_import_duty_recommendations(self, duty_change: float, category: str) -> List[str]:
        """Get recommendations based on import duty changes"""
        
        if duty_change > 0:  # Duty increase
            return [
                f"Consider purchasing {category} items before price increases",
                "Explore domestic alternatives for better value",
                "Budget for higher prices in future purchases",
                "Look for bulk purchase opportunities"
            ]
        else:  # Duty reduction
            return [
                f"Good time to purchase imported {category} items",
                "Compare prices between domestic and imported options",
                "Consider upgrading to better quality imports",
                "Plan major purchases to maximize savings"
            ]

policy_simulation_service = PolicySimulationService()