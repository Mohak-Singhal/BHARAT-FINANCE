from fastapi import APIRouter, HTTPException
from app.models.policy import TaxSlabRequest, TaxSlabResult, GSTImpactRequest, GSTImpactResult, SubsidyImpactRequest, SubsidyImpactResult
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/simulate-tax", response_model=TaxSlabResult)
async def simulate_tax_impact(request: TaxSlabRequest):
    """
    Simulate income tax calculation based on current tax slabs
    
    Calculate tax liability, effective tax rate, and provide tax-saving suggestions
    """
    try:
        # Calculate total deductions
        total_deductions = min(request.deductions_80c, 150000) + request.deductions_80d + request.other_deductions
        taxable_income = max(0, request.annual_income - total_deductions)
        
        # Tax calculation based on new tax regime (2023-24)
        tax_slabs = [
            (300000, 0),      # Up to 3L - 0%
            (600000, 0.05),   # 3L to 6L - 5%
            (900000, 0.10),   # 6L to 9L - 10%
            (1200000, 0.15),  # 9L to 12L - 15%
            (1500000, 0.20),  # 12L to 15L - 20%
            (float('inf'), 0.30)  # Above 15L - 30%
        ]
        
        income_tax = 0
        tax_breakdown = []
        remaining_income = taxable_income
        
        for i, (slab_limit, rate) in enumerate(tax_slabs):
            if remaining_income <= 0:
                break
                
            if i == 0:
                taxable_in_slab = min(remaining_income, slab_limit)
                prev_limit = 0
            else:
                prev_limit = tax_slabs[i-1][0]
                taxable_in_slab = min(remaining_income, slab_limit - prev_limit)
            
            tax_in_slab = taxable_in_slab * rate
            income_tax += tax_in_slab
            
            if taxable_in_slab > 0:
                tax_breakdown.append({
                    "slab": f"₹{prev_limit:,.0f} - ₹{min(slab_limit, prev_limit + taxable_in_slab):,.0f}",
                    "rate": f"{rate*100:.0f}%",
                    "taxable_amount": taxable_in_slab,
                    "tax": tax_in_slab
                })
            
            remaining_income -= taxable_in_slab
        
        # Add cess (4% on income tax)
        cess = income_tax * 0.04
        total_tax = income_tax + cess
        net_income = request.annual_income - total_tax
        effective_tax_rate = (total_tax / request.annual_income) * 100 if request.annual_income > 0 else 0
        
        # Generate AI explanation
        tax_data = {
            'annual_income': request.annual_income,
            'taxable_income': taxable_income,
            'total_tax': total_tax,
            'effective_rate': effective_tax_rate,
            'deductions': total_deductions
        }
        
        ai_explanation = await gemini_service.generate_content(
            f"Explain tax calculation for income ₹{request.annual_income:,.0f}, "
            f"taxable income ₹{taxable_income:,.0f}, total tax ₹{total_tax:,.0f}",
            tax_data
        )
        
        # Tax saving suggestions
        tax_saving_suggestions = []
        if request.deductions_80c < 150000:
            remaining_80c = 150000 - request.deductions_80c
            tax_saving_suggestions.append(f"Invest ₹{remaining_80c:,.0f} more in 80C to save ₹{remaining_80c * 0.2:,.0f} tax")
        
        if request.deductions_80d < 25000:
            tax_saving_suggestions.append("Consider health insurance for 80D deductions")
        
        tax_saving_suggestions.extend([
            "Invest in NPS for additional 80CCD(1B) deduction of ₹50,000",
            "Consider HRA exemption if paying rent",
            "Claim LTA for travel expenses"
        ])
        
        return TaxSlabResult(
            gross_income=request.annual_income,
            total_deductions=total_deductions,
            taxable_income=taxable_income,
            income_tax=income_tax,
            cess=cess,
            total_tax=total_tax,
            net_income=net_income,
            effective_tax_rate=effective_tax_rate,
            tax_breakdown=tax_breakdown,
            ai_explanation=ai_explanation,
            tax_saving_suggestions=tax_saving_suggestions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tax calculation error: {str(e)}")

@router.post("/simulate-gst", response_model=GSTImpactResult)
async def simulate_gst_impact(request: GSTImpactRequest):
    """
    Simulate GST impact on monthly expenses
    
    Calculate how GST rate changes affect your monthly budget
    """
    try:
        current_gst_burden = 0
        new_gst_burden = 0
        category_wise_impact = {}
        
        # Current GST rates (approximate)
        current_gst_rates = {
            "food": 0.05,
            "clothing": 0.12,
            "electronics": 0.18,
            "fuel": 0.28,
            "services": 0.18,
            "medicines": 0.05,
            "education": 0.0
        }
        
        for category, expense in request.expense_categories.items():
            current_rate = current_gst_rates.get(category, 0.18)
            new_rate = request.gst_rate_change.get(category, current_rate)
            
            current_gst = expense * current_rate / (1 + current_rate)
            new_gst = expense * new_rate / (1 + new_rate)
            
            current_gst_burden += current_gst
            new_gst_burden += new_gst
            category_wise_impact[category] = new_gst - current_gst
        
        monthly_impact = new_gst_burden - current_gst_burden
        annual_impact = monthly_impact * 12
        
        # Generate AI explanation
        gst_data = {
            'monthly_expenses': request.monthly_expenses,
            'current_gst': current_gst_burden,
            'new_gst': new_gst_burden,
            'monthly_impact': monthly_impact,
            'annual_impact': annual_impact
        }
        
        ai_explanation = await gemini_service.generate_content(
            f"Explain GST impact: Current GST burden ₹{current_gst_burden:,.0f}, "
            f"New GST burden ₹{new_gst_burden:,.0f}, Monthly impact ₹{monthly_impact:,.0f}",
            gst_data
        )
        
        return GSTImpactResult(
            current_gst_burden=current_gst_burden,
            new_gst_burden=new_gst_burden,
            monthly_impact=monthly_impact,
            annual_impact=annual_impact,
            category_wise_impact=category_wise_impact,
            ai_explanation=ai_explanation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GST calculation error: {str(e)}")

@router.post("/simulate-subsidy", response_model=SubsidyImpactResult)
async def simulate_subsidy_impact(request: SubsidyImpactRequest):
    """
    Simulate impact of fuel and LPG subsidy changes
    
    Calculate how subsidy changes affect your monthly expenses
    """
    try:
        # Current subsidy rates (approximate)
        current_fuel_subsidy = 10.0 if request.fuel_type == "petrol" else 15.0  # per liter
        current_lpg_subsidy = 200.0  # per cylinder
        
        # Calculate current benefits
        current_fuel_benefit = request.monthly_fuel_consumption * current_fuel_subsidy
        current_lpg_benefit = request.cooking_gas_cylinders * current_lpg_subsidy
        current_subsidy_benefit = current_fuel_benefit + current_lpg_benefit
        
        # Calculate new benefits
        new_fuel_subsidy = request.subsidy_change.get("fuel", current_fuel_subsidy)
        new_lpg_subsidy = request.subsidy_change.get("lpg", current_lpg_subsidy)
        
        new_fuel_benefit = request.monthly_fuel_consumption * new_fuel_subsidy
        new_lpg_benefit = request.cooking_gas_cylinders * new_lpg_subsidy
        new_subsidy_benefit = new_fuel_benefit + new_lpg_benefit
        
        monthly_impact = new_subsidy_benefit - current_subsidy_benefit
        annual_impact = monthly_impact * 12
        fuel_impact = new_fuel_benefit - current_fuel_benefit
        lpg_impact = new_lpg_benefit - current_lpg_benefit
        
        # Generate AI explanation
        subsidy_data = {
            'fuel_consumption': request.monthly_fuel_consumption,
            'lpg_cylinders': request.cooking_gas_cylinders,
            'current_benefit': current_subsidy_benefit,
            'new_benefit': new_subsidy_benefit,
            'monthly_impact': monthly_impact
        }
        
        ai_explanation = await gemini_service.generate_content(
            f"Explain subsidy impact: Current benefit ₹{current_subsidy_benefit:,.0f}, "
            f"New benefit ₹{new_subsidy_benefit:,.0f}, Monthly impact ₹{monthly_impact:,.0f}",
            subsidy_data
        )
        
        return SubsidyImpactResult(
            current_subsidy_benefit=current_subsidy_benefit,
            new_subsidy_benefit=new_subsidy_benefit,
            monthly_impact=monthly_impact,
            annual_impact=annual_impact,
            fuel_impact=fuel_impact,
            lpg_impact=lpg_impact,
            ai_explanation=ai_explanation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Subsidy calculation error: {str(e)}")

@router.get("/tax-slabs")
async def get_current_tax_slabs():
    """Get current income tax slabs and rates"""
    return {
        "tax_year": "2023-24",
        "new_tax_regime": [
            {"slab": "Up to ₹3,00,000", "rate": "0%"},
            {"slab": "₹3,00,001 to ₹6,00,000", "rate": "5%"},
            {"slab": "₹6,00,001 to ₹9,00,000", "rate": "10%"},
            {"slab": "₹9,00,001 to ₹12,00,000", "rate": "15%"},
            {"slab": "₹12,00,001 to ₹15,00,000", "rate": "20%"},
            {"slab": "Above ₹15,00,000", "rate": "30%"}
        ],
        "cess": "4% on income tax",
        "standard_deduction": "₹50,000",
        "80c_limit": "₹1,50,000",
        "80d_limit": "₹25,000 (₹50,000 for senior citizens)"
    }