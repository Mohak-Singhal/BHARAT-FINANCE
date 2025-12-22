from fastapi import APIRouter, HTTPException
from app.models.ai_coach import ChatRequest, ChatResponse, FinancialAnalysisRequest, FinancialAnalysisResult, BudgetRecommendation
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai_coach(request: ChatRequest):
    """
    Chat with AI Financial Coach
    
    Get personalized financial advice, budget tips, and investment guidance
    """
    try:
        # Generate AI response
        ai_response = await gemini_service.generate_content(
            request.message, 
            request.user_context
        )
        
        # Generate suggestions based on common financial topics
        suggestions = []
        message_lower = request.message.lower()
        
        if any(word in message_lower for word in ['budget', 'expense', 'spending']):
            suggestions = [
                "Try the 50-30-20 budgeting rule",
                "Track expenses using apps like Money Manager",
                "Set up automatic savings transfers"
            ]
        elif any(word in message_lower for word in ['invest', 'mutual fund', 'sip']):
            suggestions = [
                "Start with large-cap equity funds for stability",
                "Consider ELSS funds for tax savings",
                "Increase SIP amount by 10% annually"
            ]
        elif any(word in message_lower for word in ['insurance', 'cover', 'protection']):
            suggestions = [
                "Buy term life insurance early",
                "Get health insurance with family floater",
                "Consider critical illness coverage"
            ]
        else:
            suggestions = [
                "Ask about investment options",
                "Get budget recommendations",
                "Learn about tax-saving investments"
            ]
        
        # Generate warnings if needed
        warnings = []
        if any(word in message_lower for word in ['loan', 'debt', 'emi']):
            warnings.append("High debt can impact your financial health. Consider debt consolidation.")
        
        if any(word in message_lower for word in ['stock', 'share', 'trading']):
            warnings.append("Stock trading involves high risk. Never invest borrowed money.")
        
        # Follow-up questions
        follow_up_questions = [
            "What's your current monthly income and expenses?",
            "Do you have an emergency fund?",
            "What are your financial goals for the next 5 years?"
        ]
        
        return ChatResponse(
            response=ai_response,
            suggestions=suggestions,
            warnings=warnings,
            follow_up_questions=follow_up_questions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/analyze", response_model=FinancialAnalysisResult)
async def analyze_financial_profile(request: FinancialAnalysisRequest):
    """
    Comprehensive financial analysis and recommendations
    
    Analyze user's financial profile and provide personalized recommendations
    """
    try:
        # Calculate financial health score
        savings_rate = (request.monthly_income - request.monthly_expenses) / request.monthly_income * 100
        
        # Base score calculation
        health_score = 0
        if savings_rate >= 20:
            health_score += 30
        elif savings_rate >= 10:
            health_score += 20
        elif savings_rate > 0:
            health_score += 10
        
        # Emergency fund score
        emergency_fund_months = request.current_savings / request.monthly_expenses if request.monthly_expenses > 0 else 0
        if emergency_fund_months >= 6:
            health_score += 25
        elif emergency_fund_months >= 3:
            health_score += 15
        elif emergency_fund_months >= 1:
            health_score += 10
        
        # Investment score
        investment_ratio = request.current_investments / (request.monthly_income * 12) if request.monthly_income > 0 else 0
        if investment_ratio >= 0.2:
            health_score += 25
        elif investment_ratio >= 0.1:
            health_score += 15
        elif investment_ratio > 0:
            health_score += 10
        
        # Age-based score
        if request.age <= 30:
            health_score += 20  # Young age advantage
        elif request.age <= 45:
            health_score += 15
        else:
            health_score += 10
        
        health_score = min(health_score, 100)
        
        # Budget recommendations using 50-30-20 rule (adapted for India)
        budget_recommendations = []
        
        # Needs (50-60% for India due to higher essential costs)
        needs_recommended = request.monthly_income * 0.55
        needs_current = request.monthly_expenses * 0.7  # Assuming 70% goes to needs
        
        budget_recommendations.append(BudgetRecommendation(
            category="Essential Expenses (Rent, Food, Utilities)",
            current_allocation=needs_current,
            recommended_allocation=needs_recommended,
            difference=needs_recommended - needs_current,
            explanation="Keep essential expenses under 55% of income for better savings"
        ))
        
        # Wants (20-25%)
        wants_recommended = request.monthly_income * 0.25
        wants_current = request.monthly_expenses * 0.3
        
        budget_recommendations.append(BudgetRecommendation(
            category="Discretionary Spending (Entertainment, Dining)",
            current_allocation=wants_current,
            recommended_allocation=wants_recommended,
            difference=wants_recommended - wants_current,
            explanation="Limit discretionary spending to 25% for better financial health"
        ))
        
        # Savings (20-25%)
        savings_recommended = request.monthly_income * 0.2
        savings_current = request.monthly_income - request.monthly_expenses
        
        budget_recommendations.append(BudgetRecommendation(
            category="Savings & Investments",
            current_allocation=savings_current,
            recommended_allocation=savings_recommended,
            difference=savings_recommended - savings_current,
            explanation="Aim to save at least 20% of your income"
        ))
        
        # Generate AI explanation
        user_data = {
            'income': request.monthly_income,
            'expenses': request.monthly_expenses,
            'age': request.age,
            'risk_level': request.risk_level.value,
            'savings_rate': savings_rate,
            'health_score': health_score
        }
        
        ai_explanation = await gemini_service.provide_financial_advice(user_data)
        
        # Savings suggestions
        savings_suggestions = [
            f"Set up automatic transfer of ₹{savings_recommended:,.0f} to savings account",
            "Use the envelope method for expense tracking",
            "Review and cancel unused subscriptions",
            "Cook at home more often to reduce food expenses"
        ]
        
        # Investment recommendations based on age and risk
        investment_recommendations = []
        if request.age <= 30:
            if request.risk_level.value == "aggressive":
                investment_recommendations = [
                    "Invest 70% in equity mutual funds (large-cap + mid-cap)",
                    "Consider small-cap funds for higher growth",
                    "Start SIP in ELSS funds for tax savings"
                ]
            else:
                investment_recommendations = [
                    "Start with large-cap equity funds",
                    "Invest in balanced/hybrid funds",
                    "Consider PPF for tax-free returns"
                ]
        elif request.age <= 45:
            investment_recommendations = [
                "Balance between equity (60%) and debt (40%)",
                "Increase focus on retirement planning",
                "Consider NPS for additional tax benefits"
            ]
        else:
            investment_recommendations = [
                "Shift to conservative investments (debt funds, FDs)",
                "Focus on capital preservation",
                "Ensure adequate health insurance coverage"
            ]
        
        # Insurance needs
        insurance_needs = [
            f"Life insurance: ₹{request.monthly_income * 120:,.0f} (10x annual income)",
            f"Health insurance: ₹{max(500000, request.monthly_income * 6):,.0f}",
            "Consider critical illness and disability coverage"
        ]
        
        # Warnings
        warnings = []
        if savings_rate < 10:
            warnings.append("Low savings rate! Try to reduce expenses or increase income.")
        if emergency_fund_months < 3:
            warnings.append("Build emergency fund of 6 months expenses before investing.")
        if request.current_investments == 0 and request.age > 25:
            warnings.append("Start investing immediately to benefit from compounding.")
        
        # Action plan
        action_plan = [
            "Create a monthly budget and track expenses",
            "Build emergency fund of 6 months expenses",
            "Start SIP in equity mutual funds",
            "Get adequate life and health insurance",
            "Review and optimize tax-saving investments"
        ]
        
        return FinancialAnalysisResult(
            financial_health_score=health_score,
            budget_recommendations=budget_recommendations,
            savings_suggestions=savings_suggestions,
            investment_recommendations=investment_recommendations,
            insurance_needs=insurance_needs,
            warnings=warnings,
            ai_explanation=ai_explanation,
            action_plan=action_plan
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@router.get("/financial-tips")
async def get_daily_financial_tips():
    """Get daily financial tips and insights"""
    tips = [
        {
            "category": "Budgeting",
            "tip": "Use the 50-30-20 rule: 50% needs, 30% wants, 20% savings",
            "explanation": "This helps maintain a balanced approach to spending and saving"
        },
        {
            "category": "Investment",
            "tip": "Start SIP early, even with small amounts",
            "explanation": "Time in market beats timing the market due to compounding"
        },
        {
            "category": "Insurance",
            "tip": "Buy term life insurance when young",
            "explanation": "Premiums are lower when you're young and healthy"
        },
        {
            "category": "Tax Saving",
            "tip": "Invest in ELSS funds for tax benefits",
            "explanation": "ELSS offers tax deduction under 80C with potential for higher returns"
        },
        {
            "category": "Emergency Fund",
            "tip": "Keep 6 months of expenses in liquid funds",
            "explanation": "Emergency fund provides financial security during unexpected situations"
        }
    ]
    
    return {"daily_tips": tips}