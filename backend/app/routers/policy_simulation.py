from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from app.services.policy_simulation_service import policy_simulation_service

router = APIRouter()

class TaxPolicyRequest(BaseModel):
    type: str = "income_tax"  # income_tax, gst, corporate_tax
    change_percentage: float  # Percentage change in tax rate
    income_bracket: str = "middle"  # low, middle, high
    description: Optional[str] = None

class SubsidyPolicyRequest(BaseModel):
    type: str = "fuel"  # fuel, fertilizer, electricity, food
    amount_change: float  # Change in subsidy amount (rupees)
    sector: str = "transportation"
    description: Optional[str] = None

class ImportDutyRequest(BaseModel):
    category: str = "electronics"  # electronics, automobiles, textiles, machinery
    duty_change_percentage: float  # Change in import duty percentage
    current_duty_percentage: float = 10
    description: Optional[str] = None

@router.post("/simulate/tax-impact")
async def simulate_tax_policy_impact(request: TaxPolicyRequest):
    """
    Simulate the economic impact of tax policy changes
    
    Analyze how changes in tax rates affect different income groups,
    consumer spending, and overall economic behavior.
    """
    try:
        policy_change = {
            "type": request.type,
            "change_percentage": request.change_percentage,
            "income_bracket": request.income_bracket,
            "description": request.description
        }
        
        impact_analysis = await policy_simulation_service.simulate_tax_impact(policy_change)
        
        return {
            "simulation_type": "tax_policy",
            "request": request.dict(),
            "impact_analysis": impact_analysis,
            "simulation_date": "2024-12-20",
            "disclaimer": "This is a simulation based on economic models and historical data. Actual impacts may vary."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tax simulation error: {str(e)}")

@router.post("/simulate/subsidy-impact")
async def simulate_subsidy_policy_impact(request: SubsidyPolicyRequest):
    """
    Simulate the economic impact of subsidy policy changes
    
    Analyze how changes in subsidies affect consumer costs,
    business operations, and market dynamics.
    """
    try:
        subsidy_info = {
            "type": request.type,
            "amount_change": request.amount_change,
            "sector": request.sector,
            "description": request.description
        }
        
        impact_analysis = await policy_simulation_service.simulate_subsidy_impact(subsidy_info)
        
        return {
            "simulation_type": "subsidy_policy",
            "request": request.dict(),
            "impact_analysis": impact_analysis,
            "simulation_date": "2024-12-20",
            "disclaimer": "This is a simulation based on economic models and historical data. Actual impacts may vary."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Subsidy simulation error: {str(e)}")

@router.post("/simulate/import-duty-impact")
async def simulate_import_duty_impact(request: ImportDutyRequest):
    """
    Simulate the economic impact of import duty changes
    
    Analyze how changes in import duties affect product prices,
    consumer demand, and domestic industry competitiveness.
    """
    try:
        duty_info = {
            "category": request.category,
            "duty_change_percentage": request.duty_change_percentage,
            "current_duty_percentage": request.current_duty_percentage,
            "description": request.description
        }
        
        impact_analysis = await policy_simulation_service.simulate_import_duty_impact(duty_info)
        
        return {
            "simulation_type": "import_duty",
            "request": request.dict(),
            "impact_analysis": impact_analysis,
            "simulation_date": "2024-12-20",
            "disclaimer": "This is a simulation based on economic models and historical data. Actual impacts may vary."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import duty simulation error: {str(e)}")

@router.get("/policy-timeline/{policy_type}")
async def get_policy_timeline(policy_type: str):
    """
    Get timeline of recent and upcoming policy changes
    
    Track historical policy changes and their impacts over time.
    """
    try:
        if policy_type not in ["tax", "subsidy", "import_duty", "all"]:
            raise HTTPException(status_code=400, detail="Invalid policy type")
        
        timeline = await policy_simulation_service.get_policy_timeline(policy_type)
        
        return {
            "policy_type": policy_type,
            "timeline": timeline,
            "last_updated": "2024-12-20"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timeline fetch error: {str(e)}")

@router.get("/policy-categories")
async def get_policy_categories():
    """Get available policy categories for simulation"""
    return {
        "categories": {
            "tax_policies": {
                "types": ["income_tax", "gst", "corporate_tax", "capital_gains"],
                "description": "Direct and indirect tax policy changes",
                "impact_areas": ["Individual Income", "Business Operations", "Consumer Prices"]
            },
            "subsidy_policies": {
                "types": ["fuel", "fertilizer", "electricity", "food", "lpg"],
                "description": "Government subsidy programs and changes",
                "impact_areas": ["Household Expenses", "Agricultural Costs", "Business Operations"]
            },
            "trade_policies": {
                "types": ["import_duty", "export_incentives", "trade_agreements"],
                "description": "International trade and duty policies",
                "impact_areas": ["Product Prices", "Domestic Industry", "Consumer Choice"]
            },
            "monetary_policies": {
                "types": ["interest_rates", "inflation_targets", "currency_policies"],
                "description": "Central bank and monetary policy changes",
                "impact_areas": ["Loan Rates", "Investment Returns", "Currency Value"]
            }
        }
    }

@router.get("/economic-indicators")
async def get_economic_indicators():
    """Get current economic indicators for policy context"""
    return {
        "indicators": {
            "inflation_rate": {
                "current": "5.2%",
                "target": "4-6%",
                "trend": "stable",
                "last_updated": "2024-12-15"
            },
            "gdp_growth": {
                "current": "6.8%",
                "previous_quarter": "6.5%",
                "trend": "positive",
                "last_updated": "2024-12-01"
            },
            "unemployment_rate": {
                "current": "3.2%",
                "previous_month": "3.4%",
                "trend": "improving",
                "last_updated": "2024-11-30"
            },
            "repo_rate": {
                "current": "6.5%",
                "previous": "6.5%",
                "trend": "stable",
                "last_updated": "2024-12-06"
            },
            "fiscal_deficit": {
                "current": "5.8% of GDP",
                "target": "5.9% of GDP",
                "trend": "within_target",
                "last_updated": "2024-11-30"
            }
        },
        "market_sentiment": {
            "overall": "positive",
            "consumer_confidence": "high",
            "business_confidence": "moderate",
            "investment_climate": "favorable"
        }
    }

@router.post("/compare-policies")
async def compare_policy_scenarios(scenarios: List[Dict[str, Any]]):
    """
    Compare multiple policy scenarios side by side
    
    Analyze and compare the impact of different policy options.
    """
    try:
        if len(scenarios) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 scenarios allowed for comparison")
        
        comparison_results = []
        
        for i, scenario in enumerate(scenarios):
            scenario_type = scenario.get("type")
            
            if scenario_type == "tax":
                result = await policy_simulation_service.simulate_tax_impact(scenario)
            elif scenario_type == "subsidy":
                result = await policy_simulation_service.simulate_subsidy_impact(scenario)
            elif scenario_type == "import_duty":
                result = await policy_simulation_service.simulate_import_duty_impact(scenario)
            else:
                raise HTTPException(status_code=400, detail=f"Invalid scenario type: {scenario_type}")
            
            comparison_results.append({
                "scenario_id": i + 1,
                "scenario_name": scenario.get("name", f"Scenario {i + 1}"),
                "scenario_type": scenario_type,
                "results": result
            })
        
        # Generate comparison summary
        comparison_summary = {
            "total_scenarios": len(scenarios),
            "best_scenario": "Based on overall economic impact",
            "key_differences": "Varies by policy type and magnitude",
            "recommendation": "Choose based on specific economic goals"
        }
        
        return {
            "comparison_type": "policy_scenarios",
            "scenarios": comparison_results,
            "summary": comparison_summary,
            "comparison_date": "2024-12-20"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Policy comparison error: {str(e)}")

@router.get("/policy-impact-calculator")
async def get_policy_impact_calculator_info():
    """Get information about the policy impact calculator"""
    return {
        "calculator_info": {
            "name": "Government Policy Impact Calculator",
            "description": "Interactive tool to simulate and visualize economic impacts of policy changes",
            "features": [
                "Tax policy impact simulation",
                "Subsidy change analysis", 
                "Import duty effect calculation",
                "Multi-scenario comparison",
                "Real-time economic indicators",
                "Personalized impact assessment"
            ],
            "use_cases": [
                "Citizens understanding policy impacts on personal finances",
                "Students learning about economic policy effects",
                "Small business owners planning for policy changes",
                "Researchers analyzing policy effectiveness",
                "Policymakers evaluating proposal impacts"
            ],
            "data_sources": [
                "Government economic databases",
                "Historical policy impact data",
                "Economic research models",
                "Real-time market indicators"
            ]
        },
        "supported_policies": {
            "tax_policies": ["Income Tax", "GST", "Corporate Tax", "Capital Gains Tax"],
            "subsidies": ["Fuel Subsidy", "Fertilizer Subsidy", "Food Subsidy", "LPG Subsidy"],
            "trade_policies": ["Import Duties", "Export Incentives", "Trade Agreements"],
            "monetary_policies": ["Interest Rates", "Inflation Targets", "Currency Policies"]
        }
    }