from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from app.services.gemini_service import gemini_service
from app.services.content_aggregator import content_aggregator

router = APIRouter()

class LessonRequest(BaseModel):
    topic: str
    language: str = "english"
    difficulty: str = "beginner"  # beginner, intermediate, advanced
    include_videos: bool = True
    include_articles: bool = True

class LessonResponse(BaseModel):
    topic: str
    language: str
    content: str
    key_points: List[str]
    examples: List[str]
    quiz_questions: List[Dict[str, str]]
    videos: Optional[List[Dict[str, Any]]] = []
    articles: Optional[List[Dict[str, Any]]] = []
    government_schemes: Optional[List[Dict[str, Any]]] = []

class QuizRequest(BaseModel):
    topic: str
    language: str = "english"
    num_questions: int = 5

class QuizResponse(BaseModel):
    topic: str
    questions: List[Dict[str, Any]]

@router.post("/lesson", response_model=LessonResponse)
async def get_financial_lesson(request: LessonRequest):
    """
    Get a comprehensive financial literacy lesson with videos and articles
    
    Topics: budgeting, investing, insurance, taxes, banking, loans
    Languages: english, hindi, marathi, tamil, telugu, bengali
    """
    try:
        # Create language-specific prompt
        language_prompts = {
            "hindi": "कृपया हिंदी में समझाएं",
            "marathi": "कृपया मराठीत समजावून सांगा",
            "tamil": "தயவுசெய்து தமிழில் விளக்கவும்",
            "telugu": "దయచేసి తెలుగులో వివరించండి",
            "bengali": "অনুগ্রহ করে বাংলায় ব্যাখ্যা করুন",
            "english": "Please explain in English"
        }
        
        language_instruction = language_prompts.get(request.language.lower(), language_prompts["english"])
        
        prompt = f"""
        Create a comprehensive financial literacy lesson on "{request.topic}" for {request.difficulty} level.
        {language_instruction}
        
        Structure the lesson with:
        1. Simple explanation with real-life examples
        2. Key points (3-5 bullet points)
        3. Practical examples relevant to Indian context
        4. Common mistakes to avoid
        5. Government schemes related to this topic
        
        Keep language simple and use local examples (Indian banks, schemes, currency).
        Focus on practical implementation and actionable advice.
        """
        
        # Generate AI content
        lesson_content = await gemini_service.generate_content(prompt)
        
        # Generate key points based on topic
        key_points = []
        if "budget" in request.topic.lower():
            key_points = [
                "Follow the 50-30-20 rule for income allocation",
                "Track expenses using digital tools or apps",
                "Create separate funds for emergencies",
                "Review and adjust budget monthly",
                "Prioritize needs over wants"
            ]
        elif "invest" in request.topic.lower():
            key_points = [
                "Start investing early to benefit from compounding",
                "Diversify across asset classes and sectors",
                "Use SIP for regular investment discipline",
                "Understand risk vs return relationship",
                "Review portfolio annually"
            ]
        elif "insurance" in request.topic.lower():
            key_points = [
                "Life insurance should be 10-15x annual income",
                "Health insurance minimum ₹5 lakh coverage",
                "Buy insurance early for lower premiums",
                "Understand policy terms and exclusions",
                "Keep beneficiary details updated"
            ]
        elif "tax" in request.topic.lower():
            key_points = [
                "Understand new vs old tax regime benefits",
                "Maximize 80C deductions (₹1.5 lakh limit)",
                "Use ELSS for tax saving with growth potential",
                "Plan tax-saving investments early in financial year",
                "Keep all investment proofs and receipts"
            ]
        else:
            key_points = [
                f"Understanding {request.topic} basics and importance",
                "Practical application in daily financial life",
                "Common mistakes to avoid",
                "Government schemes and benefits available",
                "Next steps for implementation"
            ]
        
        # Generate practical examples
        examples = []
        if "budget" in request.topic.lower():
            examples = [
                "₹50,000 salary: ₹25,000 needs, ₹15,000 wants, ₹10,000 savings",
                "Use apps like Money Manager or ET Money for tracking",
                "Set up automatic savings transfer on salary day",
                "Create separate accounts for different goals"
            ]
        elif "invest" in request.topic.lower():
            examples = [
                "Start SIP with ₹1,000/month in large-cap fund",
                "Invest ₹1.5 lakh in ELSS for 80C tax benefit",
                "Diversify: 60% equity, 30% debt, 10% gold",
                "Increase SIP by 10% every year (step-up SIP)"
            ]
        elif "insurance" in request.topic.lower():
            examples = [
                "₹10 lakh income → ₹1-1.5 crore life insurance",
                "Family of 4 → ₹10 lakh health insurance floater",
                "Term insurance: ₹1 crore cover for ₹15,000 annual premium",
                "Buy health insurance before age 30 for lower premiums"
            ]
        else:
            examples = [
                f"Real-world {request.topic} scenario for Indian families",
                f"Step-by-step {request.topic} implementation guide",
                f"Common {request.topic} mistakes and how to avoid them"
            ]
        
        # Generate quiz questions
        quiz_questions = [
            {
                "question": f"What is the most important first step in {request.topic}?",
                "options": ["A) High returns", "B) Understanding basics", "C) Quick profits", "D) Following trends"],
                "correct": "B"
            },
            {
                "question": "When should you start financial planning?",
                "options": ["A) After 40", "B) As early as possible", "C) Only when rich", "D) During retirement"],
                "correct": "B"
            }
        ]
        
        # Fetch additional content
        videos = []
        articles = []
        government_schemes = []
        
        if request.include_videos:
            videos = await content_aggregator.search_youtube_videos(
                request.topic, request.language, max_results=3
            )
        
        if request.include_articles:
            articles = await content_aggregator.get_financial_articles(
                request.topic, request.language
            )
        
        # Get relevant government schemes
        scheme_categories = {
            "banking": "banking",
            "saving": "banking", 
            "invest": "retirement",
            "retirement": "retirement",
            "child": "child_education",
            "education": "child_education",
            "business": "business",
            "agriculture": "agriculture",
            "farming": "agriculture"
        }
        
        for keyword, category in scheme_categories.items():
            if keyword in request.topic.lower():
                government_schemes = await content_aggregator.get_government_schemes_info(category)
                break
        
        if not government_schemes:
            government_schemes = await content_aggregator.get_government_schemes_info("banking")
        
        return LessonResponse(
            topic=request.topic,
            language=request.language,
            content=lesson_content,
            key_points=key_points,
            examples=examples,
            quiz_questions=quiz_questions,
            videos=videos,
            articles=articles,
            government_schemes=government_schemes[:3]  # Limit to 3 most relevant schemes
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lesson generation error: {str(e)}")

@router.post("/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """
    Generate a financial literacy quiz
    
    Test knowledge on various financial topics
    """
    try:
        language_prompts = {
            "hindi": "हिंदी में प्रश्न बनाएं",
            "marathi": "मराठीत प्रश्न तयार करा",
            "tamil": "தமிழில் கேள்விகள் உருவாக்கவும்",
            "telugu": "తెలుగులో ప్రశ్నలు రూపొందించండి",
            "bengali": "বাংলায় প্রশ্ন তৈরি করুন",
            "english": "Create questions in English"
        }
        
        language_instruction = language_prompts.get(request.language.lower(), language_prompts["english"])
        
        prompt = f"""
        Create {request.num_questions} multiple choice questions about {request.topic}.
        {language_instruction}
        
        Each question should have:
        - Clear question text
        - 4 options (A, B, C, D)
        - Correct answer
        - Brief explanation
        
        Focus on practical knowledge relevant to Indian financial context.
        """
        
        quiz_content = await gemini_service.generate_content(prompt)
        
        # Generate sample questions (in production, parse AI response)
        sample_questions = [
            {
                "question": f"What is the recommended emergency fund size?",
                "options": ["A) 1 month expenses", "B) 3-6 months expenses", "C) 1 year expenses", "D) No need"],
                "correct": "B",
                "explanation": "Emergency fund should cover 3-6 months of expenses for financial security"
            },
            {
                "question": "Which investment has the highest long-term returns historically?",
                "options": ["A) Fixed Deposits", "B) Gold", "C) Equity Mutual Funds", "D) Real Estate"],
                "correct": "C",
                "explanation": "Equity mutual funds have provided highest long-term returns in India"
            }
        ]
        
        return QuizResponse(
            topic=request.topic,
            questions=sample_questions[:request.num_questions]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation error: {str(e)}")

@router.get("/topics")
async def get_available_topics():
    """Get list of available financial literacy topics"""
    return {
        "topics": [
            {
                "category": "Basic Finance",
                "topics": ["Budgeting", "Saving", "Banking", "Digital Payments"]
            },
            {
                "category": "Investments",
                "topics": ["Mutual Funds", "SIP", "PPF", "NPS", "ELSS", "Fixed Deposits"]
            },
            {
                "category": "Insurance",
                "topics": ["Life Insurance", "Health Insurance", "Motor Insurance", "Crop Insurance"]
            },
            {
                "category": "Taxes",
                "topics": ["Income Tax", "GST", "Tax Saving", "ITR Filing"]
            },
            {
                "category": "Loans",
                "topics": ["Home Loan", "Personal Loan", "Education Loan", "Credit Score"]
            },
            {
                "category": "Government Schemes",
                "topics": ["PM-KISAN", "Atal Pension Yojana", "Sukanya Samriddhi", "PMJDY"]
            }
        ]
    }

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    return {
        "languages": [
            {"code": "english", "name": "English", "native": "English"},
            {"code": "hindi", "name": "Hindi", "native": "हिंदी"},
            {"code": "marathi", "name": "Marathi", "native": "मराठी"},
            {"code": "tamil", "name": "Tamil", "native": "தமிழ்"},
            {"code": "telugu", "name": "Telugu", "native": "తెలుగు"},
            {"code": "bengali", "name": "Bengali", "native": "বাংলা"}
        ]
    }

@router.get("/videos/{topic}")
async def get_topic_videos(topic: str, language: str = "english", max_results: int = 5):
    """Get YouTube videos for a specific financial topic"""
    try:
        videos = await content_aggregator.search_youtube_videos(topic, language, max_results)
        return {"topic": topic, "language": language, "videos": videos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching videos: {str(e)}")

@router.get("/articles/{topic}")
async def get_topic_articles(topic: str, language: str = "english"):
    """Get curated articles for a specific financial topic"""
    try:
        articles = await content_aggregator.get_financial_articles(topic, language)
        return {"topic": topic, "language": language, "articles": articles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching articles: {str(e)}")

@router.get("/government-schemes")
async def get_government_schemes(category: str = "all"):
    """Get information about government financial schemes"""
    try:
        schemes = await content_aggregator.get_government_schemes_info(category)
        return {"category": category, "schemes": schemes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching schemes: {str(e)}")

@router.get("/calculators")
async def get_financial_calculators():
    """Get financial calculator data and examples"""
    try:
        calculators = await content_aggregator.get_financial_calculators_data()
        return {"calculators": calculators}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching calculator data: {str(e)}")

@router.get("/market-insights")
async def get_market_insights():
    """Get current market insights and investment themes"""
    try:
        insights = await content_aggregator.get_market_insights()
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market insights: {str(e)}")

@router.get("/comprehensive-guide/{topic}")
async def get_comprehensive_guide(topic: str, language: str = "english"):
    """Get a comprehensive guide including lessons, videos, articles, and schemes"""
    try:
        # Get lesson content
        lesson_request = LessonRequest(
            topic=topic,
            language=language,
            difficulty="beginner",
            include_videos=True,
            include_articles=True
        )
        lesson_response = await get_financial_lesson(lesson_request)
        
        # Convert response to dict
        lesson_dict = {
            "topic": lesson_response.topic,
            "language": lesson_response.language,
            "content": lesson_response.content,
            "key_points": lesson_response.key_points,
            "examples": lesson_response.examples,
            "quiz_questions": lesson_response.quiz_questions,
            "videos": lesson_response.videos or [],
            "articles": lesson_response.articles or [],
            "government_schemes": lesson_response.government_schemes or []
        }
        
        # Get additional market insights if relevant
        market_insights = None
        if topic.lower() in ["investing", "investment", "stocks", "mutual funds"]:
            try:
                market_insights = await content_aggregator.get_market_insights()
            except Exception:
                market_insights = None
        
        # Get calculator data if relevant
        calculator_data = None
        if topic.lower() in ["sip", "ppf", "loan", "emi", "fd"]:
            try:
                calculator_data = await content_aggregator.get_financial_calculators_data()
            except Exception:
                calculator_data = None
        
        return {
            "topic": topic,
            "language": language,
            "lesson": lesson_dict,
            "market_insights": market_insights,
            "calculator_data": calculator_data,
            "last_updated": "2024-12-20"
        }
        
    except Exception as e:
        # Return a basic response if there's an error
        return {
            "topic": topic,
            "language": language,
            "lesson": {
                "topic": topic,
                "language": language,
                "content": f"Learn about {topic} with practical examples and expert guidance.",
                "key_points": [f"Understanding {topic} basics", "Practical implementation", "Best practices"],
                "examples": [f"Real-world {topic} examples"],
                "quiz_questions": [],
                "videos": [],
                "articles": [],
                "government_schemes": []
            },
            "error": str(e)
        }

@router.get("/progress/{user_id}")
async def get_learning_progress(user_id: str):
    """Get user's learning progress (mock implementation)"""
    # In production, fetch from database
    return {
        "user_id": user_id,
        "total_lessons": 25,
        "completed_lessons": 12,
        "quiz_scores": {
            "budgeting": 85,
            "investing": 70,
            "insurance": 90
        },
        "certificates": ["Basic Finance", "Investment Fundamentals"],
        "next_recommended": "Tax Planning",
        "streak_days": 7,
        "videos_watched": 15,
        "articles_read": 8,
        "schemes_explored": 5
    }