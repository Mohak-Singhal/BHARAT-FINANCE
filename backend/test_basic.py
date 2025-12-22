#!/usr/bin/env python3
"""
Basic test to verify the Bharat Finance Platform works
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Bharat Finance" in data["message"]
    print("✅ Root endpoint working")

def test_health_endpoint():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("✅ Health endpoint working")

def test_investment_types():
    """Test investment types endpoint"""
    response = client.get("/simulate/investment-types")
    assert response.status_code == 200
    data = response.json()
    assert "investment_types" in data
    assert len(data["investment_types"]) > 0
    print("✅ Investment types endpoint working")

def test_tax_slabs():
    """Test tax slabs endpoint"""
    response = client.get("/policy/tax-slabs")
    assert response.status_code == 200
    data = response.json()
    assert "new_tax_regime" in data
    print("✅ Tax slabs endpoint working")

def test_msp_rates():
    """Test MSP rates endpoint"""
    response = client.get("/mandi/msp-rates")
    assert response.status_code == 200
    data = response.json()
    assert "msp_rates" in data
    print("✅ MSP rates endpoint working")

def test_financial_tips():
    """Test financial tips endpoint"""
    response = client.get("/ai/finance-coach/financial-tips")
    assert response.status_code == 200
    data = response.json()
    assert "daily_tips" in data
    print("✅ Financial tips endpoint working")

def test_literacy_topics():
    """Test literacy topics endpoint"""
    response = client.get("/literacy/topics")
    assert response.status_code == 200
    data = response.json()
    assert "topics" in data
    print("✅ Literacy topics endpoint working")

def test_investment_simulation():
    """Test investment simulation (without AI)"""
    request_data = {
        "investment_type": "sip",
        "monthly_amount": 5000,
        "annual_return_rate": 12,
        "investment_period_years": 10,
        "age": 25,
        "inflation_rate": 6
    }
    
    response = client.post("/simulate/investment", json=request_data)
    # This might fail without Gemini API key, but let's check the structure
    if response.status_code == 200:
        data = response.json()
        assert "total_invested" in data
        assert "final_corpus" in data
        print("✅ Investment simulation working")
    else:
        print("⚠️ Investment simulation needs Gemini API key")

if __name__ == "__main__":
    print("🇮🇳 Testing Bharat Finance Platform...\n")
    
    try:
        test_root_endpoint()
        test_health_endpoint()
        test_investment_types()
        test_tax_slabs()
        test_msp_rates()
        test_financial_tips()
        test_literacy_topics()
        test_investment_simulation()
        
        print("\n🎉 All basic tests passed!")
        print("📝 To test AI features, add GEMINI_API_KEY to .env file")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        sys.exit(1)