from fastapi import APIRouter, HTTPException
from app.models.mandi import MandiPriceRequest, MandiPriceResult, MandiPrice, BestMarketRequest, BestMarketResult, MarketRecommendation
from app.services.gemini_service import gemini_service
from datetime import datetime
import random

router = APIRouter()

# Mock data - In production, integrate with government APIs
MOCK_MANDI_DATA = {
    "wheat": [
        {"mandi": "Azadpur Mandi", "district": "Delhi", "state": "Delhi", "price": 2200, "variety": "Sharbati"},
        {"mandi": "Karnal Mandi", "district": "Karnal", "state": "Haryana", "price": 2350, "variety": "HD-2967"},
        {"mandi": "Meerut Mandi", "district": "Meerut", "state": "Uttar Pradesh", "price": 2180, "variety": "PBW-343"},
    ],
    "rice": [
        {"mandi": "Karnal Mandi", "district": "Karnal", "state": "Haryana", "price": 3200, "variety": "Basmati"},
        {"mandi": "Amritsar Mandi", "district": "Amritsar", "state": "Punjab", "price": 3400, "variety": "Pusa-1121"},
        {"mandi": "Rohtak Mandi", "district": "Rohtak", "state": "Haryana", "price": 3100, "variety": "PR-126"},
    ],
    "onion": [
        {"mandi": "Lasalgaon Mandi", "district": "Nashik", "state": "Maharashtra", "price": 1800, "variety": "Red"},
        {"mandi": "Pimpalgaon Mandi", "district": "Nashik", "state": "Maharashtra", "price": 1750, "variety": "Red"},
        {"mandi": "Bangalore Mandi", "district": "Bangalore", "state": "Karnataka", "price": 2000, "variety": "Red"},
    ]
}

@router.post("/prices", response_model=MandiPriceResult)
async def get_mandi_prices(request: MandiPriceRequest):
    """
    Get current mandi prices for a crop
    
    Returns prices from various mandis with AI-powered insights
    """
    try:
        crop_lower = request.crop.lower()
        
        # Get mock data (in production, fetch from government API)
        crop_data = MOCK_MANDI_DATA.get(crop_lower, [])
        
        if not crop_data:
            # Generate some mock data for unknown crops
            crop_data = [
                {"mandi": "Sample Mandi 1", "district": "District 1", "state": "State 1", "price": 2000, "variety": "Common"},
                {"mandi": "Sample Mandi 2", "district": "District 2", "state": "State 2", "price": 2100, "variety": "Common"},
            ]
        
        # Convert to MandiPrice objects
        prices = []
        total_price = 0
        
        for data in crop_data:
            # Add some variation to prices
            modal_price = data["price"]
            min_price = modal_price * 0.95
            max_price = modal_price * 1.05
            
            prices.append(MandiPrice(
                mandi_name=data["mandi"],
                district=data["district"],
                state=data["state"],
                crop=request.crop,
                variety=data["variety"],
                min_price=min_price,
                max_price=max_price,
                modal_price=modal_price,
                date=datetime.now().strftime("%Y-%m-%d")
            ))
            
            total_price += modal_price
        
        average_price = total_price / len(prices) if prices else 0
        
        # Determine price trend (mock)
        price_trend = random.choice(["Rising", "Stable", "Falling"])
        
        # Generate AI explanation
        mandi_data = {
            'crop': request.crop,
            'average_price': average_price,
            'num_mandis': len(prices),
            'trend': price_trend
        }
        
        ai_explanation = await gemini_service.generate_content(
            f"Explain mandi prices for {request.crop}: Average price ₹{average_price:,.0f} per quintal, "
            f"Trend: {price_trend}. Provide insights for farmers.",
            mandi_data
        )
        
        return MandiPriceResult(
            crop=request.crop,
            prices=prices,
            average_price=average_price,
            price_trend=price_trend,
            ai_explanation=ai_explanation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mandi price fetch error: {str(e)}")

@router.post("/best-market", response_model=BestMarketResult)
async def find_best_market(request: BestMarketRequest):
    """
    Find the most profitable mandi to sell crops
    
    Considers price, distance, and transport costs to maximize profit
    """
    try:
        crop_lower = request.crop.lower()
        crop_data = MOCK_MANDI_DATA.get(crop_lower, [])
        
        if not crop_data:
            raise HTTPException(status_code=404, detail=f"No mandi data available for {request.crop}")
        
        recommendations = []
        
        for data in crop_data:
            # Calculate distance (mock - in production, use actual location data)
            distance_km = random.uniform(20, request.max_distance_km)
            
            if distance_km > request.max_distance_km:
                continue
            
            price_per_quintal = data["price"]
            transport_cost = distance_km * request.transport_cost_per_km
            
            gross_revenue = price_per_quintal * request.quantity_quintals
            net_revenue = gross_revenue - transport_cost
            profit_margin = (net_revenue / gross_revenue) * 100 if gross_revenue > 0 else 0
            
            recommendations.append(MarketRecommendation(
                mandi_name=data["mandi"],
                district=data["district"],
                state=data["state"],
                price_per_quintal=price_per_quintal,
                distance_km=distance_km,
                transport_cost=transport_cost,
                gross_revenue=gross_revenue,
                net_revenue=net_revenue,
                profit_margin=profit_margin
            ))
        
        # Sort by net revenue (highest first)
        recommendations.sort(key=lambda x: x.net_revenue, reverse=True)
        
        if not recommendations:
            raise HTTPException(status_code=404, detail="No suitable markets found within distance limit")
        
        best_market = recommendations[0]
        
        # Generate AI explanation
        market_data = {
            'crop': request.crop,
            'quantity': request.quantity_quintals,
            'best_mandi': best_market.mandi_name,
            'price': best_market.price_per_quintal,
            'net_revenue': best_market.net_revenue,
            'distance': best_market.distance_km
        }
        
        ai_explanation = await gemini_service.generate_content(
            f"Explain best market choice for {request.crop}: {best_market.mandi_name} at "
            f"₹{best_market.price_per_quintal:,.0f}/quintal, {best_market.distance_km:.1f} km away, "
            f"Net revenue: ₹{best_market.net_revenue:,.0f}",
            market_data
        )
        
        tips = [
            "Check mandi prices daily for best rates",
            "Consider selling in batches to average out price fluctuations",
            "Negotiate transport costs for bulk quantities",
            "Verify quality standards before transport",
            "Keep MSP (Minimum Support Price) as reference"
        ]
        
        return BestMarketResult(
            crop=request.crop,
            quantity=request.quantity_quintals,
            recommendations=recommendations[:5],  # Top 5 recommendations
            best_market=best_market,
            ai_explanation=ai_explanation,
            tips=tips
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market analysis error: {str(e)}")

@router.get("/msp-rates")
async def get_msp_rates():
    """Get current Minimum Support Prices (MSP) for major crops"""
    return {
        "year": "2023-24",
        "msp_rates": [
            {"crop": "Paddy (Common)", "msp": 2183, "unit": "per quintal"},
            {"crop": "Paddy (Grade A)", "msp": 2203, "unit": "per quintal"},
            {"crop": "Wheat", "msp": 2275, "unit": "per quintal"},
            {"crop": "Jowar (Hybrid)", "msp": 3180, "unit": "per quintal"},
            {"crop": "Bajra", "msp": 2500, "unit": "per quintal"},
            {"crop": "Maize", "msp": 2090, "unit": "per quintal"},
            {"crop": "Tur (Arhar)", "msp": 7000, "unit": "per quintal"},
            {"crop": "Moong", "msp": 8558, "unit": "per quintal"},
            {"crop": "Urad", "msp": 6950, "unit": "per quintal"},
            {"crop": "Cotton (Medium Staple)", "msp": 6620, "unit": "per quintal"},
            {"crop": "Groundnut", "msp": 6377, "unit": "per quintal"},
            {"crop": "Soyabean (Yellow)", "msp": 4600, "unit": "per quintal"}
        ],
        "note": "MSP is the minimum price at which government purchases crops from farmers"
    }

@router.get("/crops")
async def get_supported_crops():
    """Get list of crops with available mandi data"""
    return {
        "crops": [
            {"name": "Wheat", "season": "Rabi", "msp_available": True},
            {"name": "Rice", "season": "Kharif", "msp_available": True},
            {"name": "Onion", "season": "Year-round", "msp_available": False},
            {"name": "Potato", "season": "Rabi", "msp_available": False},
            {"name": "Tomato", "season": "Year-round", "msp_available": False},
            {"name": "Cotton", "season": "Kharif", "msp_available": True},
            {"name": "Sugarcane", "season": "Year-round", "msp_available": True}
        ]
    }