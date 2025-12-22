from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    YOUTUBE_API_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./bharat_finance.db"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8000"
    
    # Gemini API settings
    GEMINI_API_URL: str = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
    
    # Financial constants
    DEFAULT_INFLATION_RATE: float = 6.0
    DEFAULT_TAX_RATE: float = 30.0
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"

settings = Settings()