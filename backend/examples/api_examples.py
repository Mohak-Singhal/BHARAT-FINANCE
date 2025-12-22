"""
API Usage Examples for Bharat Finance Platform
"""

import httpx
import asyncio
import json

BASE_URL = "http://localhost:8000"

async def test_investment_simulation():
    """Test investment simulation API"""
    print("🔢 Testing Investment Simulation...")
    
    async with httpx.AsyncClient() as client:
        # SIP simulation
        sip_request = {
            "investment_type": "sip",
            "monthly_amount": 5000,
            "annual_return_rate": 12,
            "investment_period_years": 10,
            "age": 25,
            "inflation_rate": 6
        }
        
        response = await client.post(f"{BASE_URL}/simulate/investment", json=sip_request)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SIP Result: ₹{result['final_corpus']:,.0f} corpus from ₹{result['total_invested']:,.0f} invested")
        else:
            print(f"❌ Error: {response.status_code}")

async def test_ai_coach():
    """Test AI financial coach"""
    print("🤖 Testing AI Financial Coach...")
    
    async with httpx.AsyncClient() as client:
        chat_request = {
            "message": "I'm 25 years old and earn ₹50,000 per month. How should I start investing?",
            "user_context": {
                "age": 25,
                "income": 50000,
                "risk_level": "moderate"
            }
        }
        
        response = await client.post(f"{BASE_URL}/ai/finance-coach/chat", json=chat_request)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ AI Response: {result['response'][:100]}...")
        else:
            print(f"❌ Error: {response.status_code}")

async def test_tax_simulation():
    """Test tax calculation"""
    print("💰 Testing Tax Simulation...")
    
    async with httpx.AsyncClient() as client:
        tax_request = {
            "annual_income": 800000,
            "age": 30,
            "deductions_80c": 150000,
            "deductions_80d": 25000,
            "other_deductions": 0
        }
        
        response = await client.post(f"{BASE_URL}/policy/simulate-tax", json=tax_request)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Tax Result: ₹{result['total_tax']:,.0f} tax on ₹{result['gross_income']:,.0f} income")
        else:
            print(f"❌ Error: {response.status_code}")

async def test_mandi_prices():
    """Test mandi price API"""
    print("🌾 Testing Mandi Prices...")
    
    async with httpx.AsyncClient() as client:
        mandi_request = {
            "crop": "wheat",
            "state": "haryana"
        }
        
        response = await client.post(f"{BASE_URL}/mandi/prices", json=mandi_request)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Mandi Result: Average price ₹{result['average_price']:,.0f} per quintal")
        else:
            print(f"❌ Error: {response.status_code}")

async def test_financial_literacy():
    """Test financial literacy API"""
    print("📚 Testing Financial Literacy...")
    
    async with httpx.AsyncClient() as client:
        lesson_request = {
            "topic": "budgeting",
            "language": "english",
            "difficulty": "beginner"
        }
        
        response = await client.post(f"{BASE_URL}/literacy/lesson", json=lesson_request)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Lesson Result: {len(result['content'])} characters of content generated")
        else:
            print(f"❌ Error: {response.status_code}")

async def main():
    """Run all tests"""
    print("🇮🇳 Bharat Finance Platform API Tests\n")
    
    try:
        await test_investment_simulation()
        await test_ai_coach()
        await test_tax_simulation()
        await test_mandi_prices()
        await test_financial_literacy()
        
        print("\n🎉 All tests completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())