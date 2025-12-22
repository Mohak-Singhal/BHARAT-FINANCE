import httpx
import json
from typing import Dict, Any
from app.core.config import settings

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.api_url = settings.GEMINI_API_URL
        
    async def generate_content(self, prompt: str, context: Dict[str, Any] = None) -> str:
        """Generate content using Gemini API"""
        if not self.api_key:
            return "Gemini API key not configured. Please add GEMINI_API_KEY to your environment."
        
        headers = {
            "Content-Type": "application/json",
        }
        
        # Enhanced prompt with Indian financial context
        enhanced_prompt = f"""
        You are a financial advisor specializing in Indian markets and regulations.
        Always provide:
        - Simple explanations in bullet points
        - Local Indian examples (INR, Indian banks, schemes)
        - Avoid jargon, use simple language
        - Include relevant disclaimers
        - Focus on practical, actionable advice
        
        Context: {json.dumps(context) if context else 'None'}
        
        User Query: {prompt}
        
        Please provide a helpful, educational response suitable for Indian users.
        """
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": enhanced_prompt
                }]
            }]
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}?key={self.api_key}",
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if "candidates" in result and len(result["candidates"]) > 0:
                        return result["candidates"][0]["content"]["parts"][0]["text"]
                    else:
                        return "Sorry, I couldn't generate a response. Please try again."
                else:
                    return f"API Error: {response.status_code}. Please check your API key and try again."
                    
        except Exception as e:
            return f"Error connecting to Gemini API: {str(e)}"
    
    async def explain_investment_result(self, investment_data: Dict[str, Any]) -> str:
        """Generate explanation for investment simulation results"""
        prompt = f"""
        Explain this investment simulation result in simple terms:
        
        Investment Type: {investment_data.get('investment_type')}
        Monthly Investment: ₹{investment_data.get('monthly_amount', 0):,.0f}
        Investment Period: {investment_data.get('period_years', 0)} years
        Expected Returns: {investment_data.get('return_rate', 0)}% per year
        Total Invested: ₹{investment_data.get('total_invested', 0):,.0f}
        Final Corpus: ₹{investment_data.get('final_corpus', 0):,.0f}
        
        Please explain:
        1. How the money grows over time
        2. Impact of compounding
        3. Inflation considerations
        4. Practical tips for this investment type
        """
        
        return await self.generate_content(prompt, investment_data)
    
    async def provide_financial_advice(self, user_data: Dict[str, Any]) -> str:
        """Provide personalized financial advice"""
        prompt = f"""
        Provide financial advice for this user profile:
        
        Monthly Income: ₹{user_data.get('income', 0):,.0f}
        Monthly Expenses: ₹{user_data.get('expenses', 0):,.0f}
        Age: {user_data.get('age', 0)} years
        Risk Level: {user_data.get('risk_level', 'moderate')}
        
        Please provide:
        1. Budget recommendations (50-30-20 rule adapted for India)
        2. Emergency fund guidance
        3. Investment suggestions based on age and risk
        4. Insurance recommendations
        5. Tax-saving tips
        """
        
        return await self.generate_content(prompt, user_data)

gemini_service = GeminiService()