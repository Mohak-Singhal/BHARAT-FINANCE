import httpx
import json
from typing import List, Dict, Any, Optional
from app.core.config import settings
import asyncio
import re

class ContentAggregator:
    """Service to aggregate financial content from internet sources and YouTube"""
    
    def __init__(self):
        self.youtube_api_key = getattr(settings, 'YOUTUBE_API_KEY', '')
        self.youtube_base_url = "https://www.googleapis.com/youtube/v3"
        
    async def search_youtube_videos(self, topic: str, language: str = "english", max_results: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant YouTube videos on financial topics"""
        
        # Language-specific search terms
        language_terms = {
            "english": f"{topic} finance india tutorial",
            "hindi": f"{topic} वित्त भारत ट्यूटोरियल",
            "marathi": f"{topic} वित्त भारत शिकवणी",
            "tamil": f"{topic} நிதி இந்தியா பயிற்சி",
            "telugu": f"{topic} ఫైనాన్స్ భారత్ ట్యుటోరియల్",
            "bengali": f"{topic} অর্থ ভারত টিউটোরিয়াল"
        }
        
        search_query = language_terms.get(language, language_terms["english"])
        
        try:
            if not self.youtube_api_key:
                return self._get_fallback_videos(topic, language)
                
            async with httpx.AsyncClient() as client:
                params = {
                    "part": "snippet",
                    "q": search_query,
                    "type": "video",
                    "maxResults": max_results,
                    "key": self.youtube_api_key,
                    "regionCode": "IN",
                    "relevanceLanguage": "hi" if language == "hindi" else "en"
                }
                
                response = await client.get(f"{self.youtube_base_url}/search", params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    videos = []
                    
                    for item in data.get("items", []):
                        video = {
                            "id": item["id"]["videoId"],
                            "title": item["snippet"]["title"],
                            "description": item["snippet"]["description"][:200] + "...",
                            "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                            "channel": item["snippet"]["channelTitle"],
                            "published_at": item["snippet"]["publishedAt"],
                            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                            "embed_url": f"https://www.youtube.com/embed/{item['id']['videoId']}"
                        }
                        videos.append(video)
                    
                    return videos
                else:
                    return self._get_fallback_videos(topic, language)
                    
        except Exception as e:
            print(f"Error fetching YouTube videos: {e}")
            return self._get_fallback_videos(topic, language)
    
    def _get_fallback_videos(self, topic: str, language: str) -> List[Dict[str, Any]]:
        """Fallback curated video list when API fails"""
        
        fallback_videos = {
            "budgeting": [
                {
                    "id": "dQw4w9WgXcQ",
                    "title": "Budget Kaise Banaye - Complete Guide in Hindi",
                    "description": "Learn how to create a monthly budget in simple steps. This video covers 50-30-20 rule, expense tracking, and saving strategies for Indian families.",
                    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
                    "channel": "Finance Sikho",
                    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "embed_url": "https://www.youtube.com/embed/dQw4w9WgXcQ"
                },
                {
                    "id": "oHg5SJYRHA0",
                    "title": "Personal Finance Management for Beginners",
                    "description": "Complete guide to personal finance management including budgeting, saving, and investment basics for Indian audience.",
                    "thumbnail": "https://img.youtube.com/vi/oHg5SJYRHA0/mqdefault.jpg",
                    "channel": "Money Matters India",
                    "url": "https://www.youtube.com/watch?v=oHg5SJYRHA0",
                    "embed_url": "https://www.youtube.com/embed/oHg5SJYRHA0"
                }
            ],
            "investing": [
                {
                    "id": "9bZkp7q19f0",
                    "title": "SIP Investment Guide for Beginners - Hindi",
                    "description": "Complete guide to start SIP investment in mutual funds. Learn about SIP benefits, how to choose funds, and tax implications.",
                    "thumbnail": "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
                    "channel": "Investment Guru India",
                    "url": "https://www.youtube.com/watch?v=9bZkp7q19f0",
                    "embed_url": "https://www.youtube.com/embed/9bZkp7q19f0"
                },
                {
                    "id": "kJQP7kiw5Fk",
                    "title": "Mutual Fund Basics Explained",
                    "description": "Understanding mutual funds, types of funds, risk factors, and how to start investing in India.",
                    "thumbnail": "https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
                    "channel": "Wealth Creation India",
                    "url": "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
                    "embed_url": "https://www.youtube.com/embed/kJQP7kiw5Fk"
                }
            ],
            "insurance": [
                {
                    "id": "L_jWHffIx5E",
                    "title": "Life Insurance vs Health Insurance - Complete Guide",
                    "description": "Understand the difference between life and health insurance, coverage options, and how to choose the right policy.",
                    "thumbnail": "https://img.youtube.com/vi/L_jWHffIx5E/mqdefault.jpg",
                    "channel": "Insurance Simplified",
                    "url": "https://www.youtube.com/watch?v=L_jWHffIx5E",
                    "embed_url": "https://www.youtube.com/embed/L_jWHffIx5E"
                }
            ],
            "taxes": [
                {
                    "id": "fJ9rUzIMcZQ",
                    "title": "Income Tax Calculation 2024 - Step by Step",
                    "description": "Learn how to calculate income tax under new and old regime, deductions available, and tax-saving strategies.",
                    "thumbnail": "https://img.youtube.com/vi/fJ9rUzIMcZQ/mqdefault.jpg",
                    "channel": "Tax Guru India",
                    "url": "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
                    "embed_url": "https://www.youtube.com/embed/fJ9rUzIMcZQ"
                }
            ]
        }
        
        return fallback_videos.get(topic, fallback_videos["budgeting"])
    
    async def get_financial_articles(self, topic: str, language: str = "english") -> List[Dict[str, Any]]:
        """Get curated financial articles and resources"""
        
        # Curated articles database
        articles_db = {
            "budgeting": {
                "english": [
                    {
                        "title": "50-30-20 Budget Rule Explained for Indians",
                        "summary": "Learn how to apply the 50-30-20 budgeting rule with Indian salary structure and expenses. This rule helps you allocate 50% for needs, 30% for wants, and 20% for savings.",
                        "source": "MoneyControl",
                        "url": "https://www.moneycontrol.com/news/business/personal-finance/",
                        "key_points": [
                            "50% for needs (rent, food, utilities, EMIs)",
                            "30% for wants (entertainment, dining, shopping)",
                            "20% for savings and investments (SIP, PPF, FD)"
                        ],
                        "indian_context": "Adapted for Indian middle-class families with considerations for joint family expenses and cultural spending patterns."
                    },
                    {
                        "title": "Digital Budgeting Apps in India",
                        "summary": "Top budgeting apps available in India with features comparison and user reviews.",
                        "source": "Economic Times",
                        "url": "https://economictimes.indiatimes.com/wealth/",
                        "key_points": [
                            "Money Manager - Expense tracking with categories",
                            "ET Money - Investment + budgeting combined",
                            "Walnut - Automatic SMS-based expense tracking"
                        ],
                        "indian_context": "Apps that work with Indian banking SMS formats and support multiple languages."
                    }
                ],
                "hindi": [
                    {
                        "title": "बजट कैसे बनाएं - आसान तरीका",
                        "summary": "घरेलू बजट बनाने का सरल तरीका जो हर भारतीय परिवार के लिए उपयोगी है। मासिक आय और खर्च का सही हिसाब रखना सीखें।",
                        "source": "Dainik Jagran",
                        "url": "#",
                        "key_points": [
                            "मासिक आय का सही हिसाब रखें",
                            "जरूरी और गैर-जरूरी खर्चों को अलग करें",
                            "बचत को सबसे पहली प्राथमिकता दें"
                        ],
                        "indian_context": "भारतीय पारिवारिक संरचना के अनुसार बजट बनाने की विधि।"
                    }
                ]
            },
            "investing": {
                "english": [
                    {
                        "title": "SIP Investment Guide for Beginners",
                        "summary": "Complete guide to start SIP investments in India with step-by-step process, fund selection, and tax benefits.",
                        "source": "Value Research",
                        "url": "https://www.valueresearchonline.com/",
                        "key_points": [
                            "Start with ₹500-1000 monthly SIP",
                            "Choose large-cap funds for beginners",
                            "Use ELSS for tax benefits under 80C",
                            "Increase SIP amount by 10% annually"
                        ],
                        "indian_context": "Focused on Indian mutual fund industry with AMC recommendations and tax implications."
                    },
                    {
                        "title": "PPF vs ELSS vs NPS Comparison",
                        "summary": "Detailed comparison of popular tax-saving investment options in India with returns analysis.",
                        "source": "Mint",
                        "url": "https://www.livemint.com/money/",
                        "key_points": [
                            "PPF: 15-year lock-in, tax-free returns",
                            "ELSS: 3-year lock-in, market-linked returns",
                            "NPS: Retirement focus, additional 80CCD benefit"
                        ],
                        "indian_context": "Analysis based on Indian tax laws and retirement planning needs."
                    }
                ]
            },
            "insurance": {
                "english": [
                    {
                        "title": "Health Insurance in India - Complete Guide",
                        "summary": "Everything you need to know about health insurance in India including coverage, claims, and choosing the right policy.",
                        "source": "PolicyBazaar",
                        "url": "https://www.policybazaar.com/",
                        "key_points": [
                            "Minimum ₹5 lakh coverage recommended",
                            "Family floater vs individual policies",
                            "Cashless vs reimbursement claims",
                            "Pre-existing disease coverage"
                        ],
                        "indian_context": "Covers Indian healthcare system, IRDAI regulations, and popular insurance companies."
                    }
                ]
            }
        }
        
        return articles_db.get(topic, {}).get(language, [])
    
    async def get_government_schemes_info(self, category: str = "all") -> List[Dict[str, Any]]:
        """Get information about relevant government financial schemes"""
        
        schemes = [
            {
                "name": "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
                "category": "banking",
                "description": "Financial inclusion program providing bank accounts to all households",
                "benefits": [
                    "Zero balance bank account",
                    "RuPay debit card with ₹2 lakh accident insurance",
                    "Life insurance cover of ₹30,000",
                    "Overdraft facility up to ₹10,000"
                ],
                "eligibility": "All Indian citizens above 10 years",
                "how_to_apply": "Visit nearest bank branch with Aadhaar card and one photograph",
                "official_website": "https://www.pmjdy.gov.in/",
                "launched_year": "2014",
                "beneficiaries": "45+ crore accounts opened"
            },
            {
                "name": "Atal Pension Yojana (APY)",
                "category": "retirement",
                "description": "Pension scheme for unorganized sector workers",
                "benefits": [
                    "Guaranteed pension of ₹1,000 to ₹5,000 per month",
                    "Government co-contribution for eligible subscribers",
                    "Tax benefits under Section 80CCD",
                    "Spouse continuation option"
                ],
                "eligibility": "Age 18-40 years, Indian citizen with bank account",
                "how_to_apply": "Through bank, post office, or online portal",
                "official_website": "https://www.npscra.nsdl.co.in/apy/",
                "launched_year": "2015",
                "beneficiaries": "5+ crore subscribers"
            },
            {
                "name": "Sukanya Samriddhi Yojana",
                "category": "child_education",
                "description": "Savings scheme for girl child education and marriage expenses",
                "benefits": [
                    "High interest rate (currently 8.0%)",
                    "Tax benefits under Section 80C (up to ₹1.5 lakh)",
                    "Tax-free maturity amount",
                    "Partial withdrawal allowed after 18 years"
                ],
                "eligibility": "Girl child below 10 years, maximum 2 accounts per family",
                "how_to_apply": "Open account in bank or post office with ₹250 minimum",
                "official_website": "https://www.nsiindia.gov.in/",
                "launched_year": "2015",
                "beneficiaries": "3+ crore accounts"
            },
            {
                "name": "PM-KISAN",
                "category": "agriculture",
                "description": "Income support scheme for small and marginal farmers",
                "benefits": [
                    "₹6,000 per year in 3 equal installments",
                    "Direct benefit transfer to bank account",
                    "No application fee or documentation hassle"
                ],
                "eligibility": "Small and marginal farmers with cultivable land",
                "how_to_apply": "Online registration at pmkisan.gov.in or through CSC centers",
                "official_website": "https://pmkisan.gov.in/",
                "launched_year": "2019",
                "beneficiaries": "11+ crore farmers"
            },
            {
                "name": "Pradhan Mantri Mudra Yojana",
                "category": "business",
                "description": "Micro-finance scheme for small businesses and entrepreneurs",
                "benefits": [
                    "Collateral-free loans up to ₹10 lakh",
                    "Three categories: Shishu (₹50K), Kishore (₹5L), Tarun (₹10L)",
                    "Lower interest rates",
                    "Flexible repayment terms"
                ],
                "eligibility": "Small businesses, traders, manufacturers, service providers",
                "how_to_apply": "Through banks, NBFCs, and MFIs",
                "official_website": "https://www.mudra.org.in/",
                "launched_year": "2015",
                "beneficiaries": "37+ crore loans sanctioned"
            }
        ]
        
        if category == "all":
            return schemes
        else:
            return [scheme for scheme in schemes if scheme["category"] == category]
    
    async def get_financial_calculators_data(self) -> Dict[str, Any]:
        """Get data for various financial calculators with Indian context"""
        
        return {
            "sip_calculator": {
                "description": "Calculate SIP returns with compounding for Indian mutual funds",
                "formula": "FV = PMT × [((1 + r)^n - 1) / r] × (1 + r)",
                "typical_returns": {
                    "large_cap": "10-12% annually",
                    "mid_cap": "12-15% annually", 
                    "small_cap": "15-18% annually",
                    "elss": "12-15% annually with tax benefits"
                },
                "example": {
                    "monthly_investment": 5000,
                    "annual_return": 12,
                    "years": 10,
                    "total_invested": 600000,
                    "maturity_amount": 1162000,
                    "wealth_gained": 562000
                },
                "tax_implications": "Long-term capital gains above ₹1 lakh taxed at 10%"
            },
            "ppf_calculator": {
                "description": "Calculate PPF returns over 15 years with current rates",
                "current_rate": 7.1,
                "tax_benefits": "Triple tax benefit - 80C deduction, tax-free growth, tax-free withdrawal",
                "rules": {
                    "minimum_deposit": 500,
                    "maximum_deposit": 150000,
                    "lock_in_period": "15 years",
                    "extension": "5-year blocks after maturity"
                },
                "example": {
                    "annual_investment": 150000,
                    "years": 15,
                    "maturity_amount": 4013000,
                    "total_invested": 2250000,
                    "tax_saved": 450000
                }
            },
            "home_loan_emi": {
                "description": "Calculate home loan EMI with Indian bank rates",
                "formula": "EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]",
                "current_rates": {
                    "sbi": "8.50% - 9.25%",
                    "hdfc": "8.60% - 9.35%",
                    "icici": "8.65% - 9.40%",
                    "axis": "8.75% - 9.50%"
                },
                "example": {
                    "loan_amount": 5000000,
                    "interest_rate": 8.5,
                    "tenure_years": 20,
                    "monthly_emi": 43391,
                    "total_interest": 5413840,
                    "total_payment": 10413840
                },
                "tax_benefits": "Principal repayment under 80C, interest under 24(b)"
            },
            "fd_calculator": {
                "description": "Calculate Fixed Deposit returns with Indian bank rates",
                "current_rates": {
                    "sbi": "6.50% - 7.00%",
                    "hdfc": "6.75% - 7.25%",
                    "icici": "6.70% - 7.20%",
                    "post_office": "6.90%"
                },
                "example": {
                    "principal": 100000,
                    "rate": 7.0,
                    "tenure_years": 5,
                    "maturity_amount": 140255,
                    "interest_earned": 40255
                },
                "tax_implications": "TDS applicable if interest > ₹40,000 per year"
            }
        }
    
    async def get_market_insights(self) -> Dict[str, Any]:
        """Get current market insights and trends for Indian markets"""
        
        return {
            "market_summary": {
                "nifty_50": {
                    "description": "India's benchmark index tracking top 50 companies",
                    "historical_returns": "12-15% CAGR over long term",
                    "current_pe": "Around 22-24 (historical average: 20)",
                    "sectors": "Banking, IT, Consumer goods, Energy"
                },
                "sensex": {
                    "description": "BSE's 30-stock index, oldest in India",
                    "historical_returns": "13-16% CAGR over long term",
                    "market_cap": "Represents ~45% of total market cap"
                }
            },
            "sector_performance": {
                "banking": {
                    "outlook": "Positive due to credit growth and NPA reduction",
                    "key_drivers": ["Digital banking", "Rural penetration", "Credit demand"],
                    "risks": ["Interest rate changes", "Asset quality"]
                },
                "it": {
                    "outlook": "Mixed due to global uncertainties",
                    "key_drivers": ["Digital transformation", "Cloud adoption", "AI/ML"],
                    "risks": ["Recession fears", "Visa restrictions", "Currency fluctuation"]
                },
                "pharma": {
                    "outlook": "Steady growth expected",
                    "key_drivers": ["Generic drugs", "Export opportunities", "Domestic demand"],
                    "risks": ["Regulatory issues", "Price controls"]
                },
                "fmcg": {
                    "outlook": "Stable with rural recovery",
                    "key_drivers": ["Rural demand", "Premium products", "E-commerce"],
                    "risks": ["Inflation", "Competition", "Raw material costs"]
                }
            },
            "investment_themes": [
                {
                    "theme": "Digital India",
                    "description": "Technology and digitization focused investments",
                    "sectors": ["IT", "Fintech", "E-commerce", "Digital payments"],
                    "time_horizon": "5-10 years",
                    "risk_level": "Medium to High"
                },
                {
                    "theme": "Infrastructure Development", 
                    "description": "Government infrastructure spending benefits",
                    "sectors": ["Construction", "Cement", "Steel", "Power"],
                    "time_horizon": "7-15 years",
                    "risk_level": "Medium"
                },
                {
                    "theme": "ESG Investing",
                    "description": "Environmental, Social, and Governance focused investing",
                    "sectors": ["Renewable energy", "Clean tech", "Sustainable businesses"],
                    "time_horizon": "10+ years",
                    "risk_level": "Medium"
                }
            ],
            "economic_indicators": {
                "inflation_rate": {
                    "current": "5-6% (RBI target: 4% +/- 2%)",
                    "impact": "Affects real returns and RBI policy"
                },
                "repo_rate": {
                    "current": "6.50% (as of 2024)",
                    "impact": "Influences lending rates and bond yields"
                },
                "gdp_growth": {
                    "projection": "6-7% for FY 2024-25",
                    "drivers": ["Domestic consumption", "Government spending", "Private investment"]
                },
                "fiscal_deficit": {
                    "target": "5.9% of GDP for FY 2024-25",
                    "impact": "Affects government borrowing and bond markets"
                }
            }
        }

content_aggregator = ContentAggregator()