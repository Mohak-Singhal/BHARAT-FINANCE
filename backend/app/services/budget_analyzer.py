from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import json

class BudgetCategory(BaseModel):
    name: str
    current_amount: float
    recommended_amount: float
    percentage_of_income: float
    recommended_percentage: float
    status: str  # 'good', 'warning', 'critical'
    description: str
    tips: List[str]

class BudgetAnalysis(BaseModel):
    total_income: float
    total_expenses: float
    savings_rate: float
    recommended_savings_rate: float
    categories: List[BudgetCategory]
    overall_score: int
    recommendations: List[str]
    emergency_fund_months: float
    debt_to_income_ratio: float

class BudgetAnalyzer:
    """Professional budget analysis and recommendation service"""
    
    def __init__(self):
        self.ideal_percentages = {
            "essential_expenses": {"min": 50, "max": 55, "ideal": 52},
            "discretionary_spending": {"min": 20, "max": 25, "ideal": 22},
            "savings_investments": {"min": 20, "max": 30, "ideal": 25},
            "debt_payments": {"min": 0, "max": 10, "ideal": 5}
        }
    
    def analyze_budget(self, income: float, expenses: Dict[str, float]) -> BudgetAnalysis:
        """Analyze budget and provide professional recommendations"""
        
        # Calculate current percentages
        total_expenses = sum(expenses.values())
        savings_rate = ((income - total_expenses) / income) * 100 if income > 0 else 0
        
        # Categorize expenses
        essential_expenses = expenses.get('rent', 0) + expenses.get('food', 0) + expenses.get('utilities', 0) + expenses.get('transportation', 0)
        discretionary_spending = expenses.get('entertainment', 0) + expenses.get('dining', 0) + expenses.get('shopping', 0)
        debt_payments = expenses.get('loan_payments', 0) + expenses.get('credit_card', 0)
        current_savings = expenses.get('savings', 0) + expenses.get('investments', 0)
        
        # Calculate percentages
        essential_pct = (essential_expenses / income) * 100 if income > 0 else 0
        discretionary_pct = (discretionary_spending / income) * 100 if income > 0 else 0
        debt_pct = (debt_payments / income) * 100 if income > 0 else 0
        savings_pct = (current_savings / income) * 100 if income > 0 else 0
        
        # Generate recommendations
        categories = []
        
        # Essential Expenses Analysis
        essential_status = self._get_status(essential_pct, self.ideal_percentages["essential_expenses"])
        essential_recommended = income * (self.ideal_percentages["essential_expenses"]["ideal"] / 100)
        
        categories.append(BudgetCategory(
            name="Essential Expenses (Rent, Food, Utilities, Transport)",
            current_amount=essential_expenses,
            recommended_amount=essential_recommended,
            percentage_of_income=essential_pct,
            recommended_percentage=self.ideal_percentages["essential_expenses"]["ideal"],
            status=essential_status,
            description="Keep essential expenses under 55% of income for better financial flexibility",
            tips=self._get_essential_tips(essential_status, essential_pct)
        ))
        
        # Discretionary Spending Analysis
        discretionary_status = self._get_status(discretionary_pct, self.ideal_percentages["discretionary_spending"])
        discretionary_recommended = income * (self.ideal_percentages["discretionary_spending"]["ideal"] / 100)
        
        categories.append(BudgetCategory(
            name="Discretionary Spending (Entertainment, Dining, Shopping)",
            current_amount=discretionary_spending,
            recommended_amount=discretionary_recommended,
            percentage_of_income=discretionary_pct,
            recommended_percentage=self.ideal_percentages["discretionary_spending"]["ideal"],
            status=discretionary_status,
            description="Limit discretionary spending to 25% for better financial health",
            tips=self._get_discretionary_tips(discretionary_status, discretionary_pct)
        ))
        
        # Savings & Investments Analysis
        savings_status = self._get_status(savings_pct, self.ideal_percentages["savings_investments"])
        savings_recommended = income * (self.ideal_percentages["savings_investments"]["ideal"] / 100)
        
        categories.append(BudgetCategory(
            name="Savings & Investments",
            current_amount=current_savings,
            recommended_amount=savings_recommended,
            percentage_of_income=savings_pct,
            recommended_percentage=self.ideal_percentages["savings_investments"]["ideal"],
            status=savings_status,
            description="Aim to save at least 20% of your income for long-term financial security",
            tips=self._get_savings_tips(savings_status, savings_pct)
        ))
        
        # Debt Payments Analysis (if applicable)
        if debt_payments > 0:
            debt_status = self._get_status(debt_pct, self.ideal_percentages["debt_payments"])
            debt_recommended = income * (self.ideal_percentages["debt_payments"]["ideal"] / 100)
            
            categories.append(BudgetCategory(
                name="Debt Payments",
                current_amount=debt_payments,
                recommended_amount=debt_recommended,
                percentage_of_income=debt_pct,
                recommended_percentage=self.ideal_percentages["debt_payments"]["ideal"],
                status=debt_status,
                description="Keep debt payments under 10% of income to maintain financial health",
                tips=self._get_debt_tips(debt_status, debt_pct)
            ))
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(categories)
        
        # Generate overall recommendations
        recommendations = self._generate_recommendations(categories, savings_rate, income)
        
        # Calculate emergency fund and debt ratios
        emergency_fund_months = (current_savings / essential_expenses) if essential_expenses > 0 else 0
        debt_to_income_ratio = (debt_payments / income) * 100 if income > 0 else 0
        
        return BudgetAnalysis(
            total_income=income,
            total_expenses=total_expenses,
            savings_rate=savings_rate,
            recommended_savings_rate=self.ideal_percentages["savings_investments"]["ideal"],
            categories=categories,
            overall_score=overall_score,
            recommendations=recommendations,
            emergency_fund_months=emergency_fund_months,
            debt_to_income_ratio=debt_to_income_ratio
        )
    
    def _get_status(self, current_pct: float, ideal_range: Dict[str, float]) -> str:
        """Determine status based on current percentage vs ideal range"""
        if current_pct <= ideal_range["max"] and current_pct >= ideal_range["min"]:
            return "good"
        elif current_pct > ideal_range["max"] and current_pct <= ideal_range["max"] + 10:
            return "warning"
        else:
            return "critical"
    
    def _get_essential_tips(self, status: str, current_pct: float) -> List[str]:
        """Get tips for essential expenses"""
        if status == "good":
            return [
                "Great job keeping essential expenses in check!",
                "Consider negotiating better rates for utilities and insurance",
                "Look for ways to optimize transportation costs"
            ]
        elif status == "warning":
            return [
                "Essential expenses are slightly high - look for cost-cutting opportunities",
                "Consider moving to a more affordable location if possible",
                "Review and optimize your grocery and utility bills",
                "Use public transportation or carpooling to reduce transport costs"
            ]
        else:
            return [
                "Essential expenses are too high - immediate action needed",
                "Consider downsizing housing or finding roommates",
                "Switch to a more affordable mobile and internet plan",
                "Cook at home more often to reduce food costs",
                "Review all subscriptions and cancel unnecessary ones"
            ]
    
    def _get_discretionary_tips(self, status: str, current_pct: float) -> List[str]:
        """Get tips for discretionary spending"""
        if status == "good":
            return [
                "Good balance on discretionary spending!",
                "Consider using cashback apps for entertainment purchases",
                "Set monthly limits for dining out and stick to them"
            ]
        elif status == "warning":
            return [
                "Discretionary spending is a bit high - time to cut back",
                "Try the 24-hour rule before making non-essential purchases",
                "Look for free or low-cost entertainment alternatives",
                "Set a weekly dining out budget and track it"
            ]
        else:
            return [
                "Discretionary spending is way too high - major cuts needed",
                "Implement a strict entertainment budget",
                "Cook at home instead of dining out",
                "Find free activities like hiking, reading, or community events",
                "Cancel non-essential subscriptions immediately"
            ]
    
    def _get_savings_tips(self, status: str, current_pct: float) -> List[str]:
        """Get tips for savings and investments"""
        if status == "good":
            return [
                "Excellent savings rate! Keep it up!",
                "Consider diversifying your investment portfolio",
                "Look into tax-saving investments like ELSS and PPF",
                "Automate your savings to maintain consistency"
            ]
        elif status == "warning":
            return [
                "Savings rate needs improvement - aim for at least 20%",
                "Start with automating 10% savings and gradually increase",
                "Consider starting a SIP in mutual funds",
                "Build an emergency fund of 6 months expenses first"
            ]
        else:
            return [
                "Critical: You need to start saving immediately",
                "Begin with saving just ₹1000 per month and increase gradually",
                "Open a separate savings account for emergency fund",
                "Consider taking a financial literacy course",
                "Review and cut unnecessary expenses to free up money for savings"
            ]
    
    def _get_debt_tips(self, status: str, current_pct: float) -> List[str]:
        """Get tips for debt management"""
        if status == "good":
            return [
                "Debt levels are manageable",
                "Consider paying extra towards high-interest debt",
                "Maintain good credit score by paying on time"
            ]
        elif status == "warning":
            return [
                "Debt payments are getting high - focus on reduction",
                "Pay more than minimum on credit cards",
                "Consider debt consolidation if beneficial",
                "Avoid taking on new debt"
            ]
        else:
            return [
                "Debt levels are critical - immediate action required",
                "Stop using credit cards for new purchases",
                "Consider debt counseling services",
                "Focus on paying off highest interest debt first",
                "Look into debt consolidation options"
            ]
    
    def _calculate_overall_score(self, categories: List[BudgetCategory]) -> int:
        """Calculate overall budget health score (0-100)"""
        total_score = 0
        weights = {"good": 100, "warning": 60, "critical": 20}
        
        for category in categories:
            total_score += weights[category.status]
        
        return total_score // len(categories) if categories else 0
    
    def _generate_recommendations(self, categories: List[BudgetCategory], savings_rate: float, income: float) -> List[str]:
        """Generate overall budget recommendations"""
        recommendations = []
        
        # Priority recommendations based on status
        critical_categories = [cat for cat in categories if cat.status == "critical"]
        warning_categories = [cat for cat in categories if cat.status == "warning"]
        
        if critical_categories:
            recommendations.append("🚨 Immediate Action Required: Address critical budget categories first")
            for cat in critical_categories:
                if "Essential" in cat.name:
                    recommendations.append("• Reduce housing and essential costs immediately")
                elif "Discretionary" in cat.name:
                    recommendations.append("• Cut all non-essential spending until budget is balanced")
                elif "Savings" in cat.name:
                    recommendations.append("• Start emergency savings even if it's just ₹500/month")
        
        if warning_categories:
            recommendations.append("⚠️ Attention Needed: Optimize these areas for better financial health")
        
        # Savings-specific recommendations
        if savings_rate < 10:
            recommendations.append("💰 Priority: Build emergency fund of 3-6 months expenses")
        elif savings_rate < 20:
            recommendations.append("📈 Goal: Increase savings rate to 20% for long-term wealth building")
        else:
            recommendations.append("🎯 Excellent: Consider advanced investment strategies for wealth growth")
        
        # Income-based recommendations
        if income < 50000:
            recommendations.append("💡 Focus on skill development to increase earning potential")
        elif income > 100000:
            recommendations.append("🏆 Consider tax-saving investments and wealth management strategies")
        
        return recommendations

budget_analyzer = BudgetAnalyzer()