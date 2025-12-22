from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class MandiPriceRequest(BaseModel):
    crop: str = Field(..., description="Crop name (e.g., wheat, rice, onion)")
    state: Optional[str] = Field(None, description="State name")
    district: Optional[str] = Field(None, description="District name")

class MandiPrice(BaseModel):
    mandi_name: str
    district: str
    state: str
    crop: str
    variety: str
    min_price: float
    max_price: float
    modal_price: float
    date: str
    distance_km: Optional[float] = None

class MandiPriceResult(BaseModel):
    crop: str
    prices: List[MandiPrice]
    average_price: float
    price_trend: str
    ai_explanation: str

class BestMarketRequest(BaseModel):
    crop: str
    quantity_quintals: float = Field(..., gt=0)
    current_location: str
    transport_cost_per_km: float = Field(50.0, description="Transport cost per km in INR")
    max_distance_km: float = Field(100.0, description="Maximum distance willing to travel")

class MarketRecommendation(BaseModel):
    mandi_name: str
    district: str
    state: str
    price_per_quintal: float
    distance_km: float
    transport_cost: float
    gross_revenue: float
    net_revenue: float
    profit_margin: float

class BestMarketResult(BaseModel):
    crop: str
    quantity: float
    recommendations: List[MarketRecommendation]
    best_market: MarketRecommendation
    ai_explanation: str
    tips: List[str]