from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from app.routers import investment, ai_coach, policy, mandi, literacy, policy_simulation, budget
from app.core.config import settings
from app.core.database import create_db_and_tables

load_dotenv()

app = FastAPI(
    title="Bharat Finance & Policy Simulator",
    description="Social-impact platform for financial literacy and AI-guided personal finance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(investment.router, prefix="/simulate", tags=["Investment Simulator"])
app.include_router(ai_coach.router, prefix="/ai/finance-coach", tags=["AI Finance Coach"])
app.include_router(policy.router, prefix="/policy", tags=["Policy Simulator"])
app.include_router(policy_simulation.router, prefix="/policy-simulation", tags=["Policy Impact Simulator"])
app.include_router(budget.router, prefix="/budget", tags=["Budget Analyzer"])
app.include_router(mandi.router, prefix="/mandi", tags=["Rural Market Support"])
app.include_router(literacy.router, prefix="/literacy", tags=["Financial Literacy"])

@app.on_event("startup")
async def startup_event():
    create_db_and_tables()

@app.get("/")
async def root():
    return {
        "message": "Welcome to Bharat Finance & Policy Simulator",
        "version": "1.0.0",
        "docs": "/docs",
        "modules": [
            "Investment & Retirement Simulator",
            "AI Personal Finance Coach",
            "Tax & Policy Impact Simulator",
            "Multilingual Financial Literacy",
            "Rural Market Support System"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)