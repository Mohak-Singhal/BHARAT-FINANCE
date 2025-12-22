from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class TaxSlabRequest(BaseModel):
    annual_income: float = Field(..., gt=0, description="Annual income in INR")
    age: int = Field(..., ge=18, le=100, description="Age for senior citizen benefits")
    deductions_80c: Optional[float] = Field(0, description="80C deductions (max 1.5L)")
    deductions_80d: Optional[float] = Field(0, description="80D health insurance deductions")
    other_deductions: Optional[float] = Field(0, description="Other deductions")

class TaxSlabResult(BaseModel):
    gross_income: float
    total_deductions: float
    taxable_income: float
    income_tax: float
    cess: float
    total_tax: float
    net_income: float
    effective_tax_rate: float
    tax_breakdown: List[Dict[str, float]]
    ai_explanation: str
    tax_saving_suggestions: List[str]

class GSTImpactRequest(BaseModel):
    monthly_expenses: float = Field(..., gt=0)
    expense_categories: Dict[str, float] = Field(..., description="Category-wise expenses")
    gst_rate_change: Dict[str, float] = Field(..., description="GST rate changes by category")

class GSTImpactResult(BaseModel):
    current_gst_burden: float
    new_gst_burden: float
    monthly_impact: float
    annual_impact: float
    category_wise_impact: Dict[str, float]
    ai_explanation: str

class SubsidyImpactRequest(BaseModel):
    monthly_fuel_consumption: float = Field(..., gt=0, description="Fuel consumption in liters")
    fuel_type: str = Field(..., description="petrol or diesel")
    cooking_gas_cylinders: int = Field(..., ge=0, description="LPG cylinders per month")
    subsidy_change: Dict[str, float] = Field(..., description="Subsidy changes")

class SubsidyImpactResult(BaseModel):
    current_subsidy_benefit: float
    new_subsidy_benefit: float
    monthly_impact: float
    annual_impact: float
    fuel_impact: float
    lpg_impact: float
    ai_explanation: str