# Bharat Finance & Policy Simulator

A social-impact platform for financial literacy, policy awareness, and AI-guided personal finance for India.

## Features

- **Investment & Retirement Simulator**: SIP, RD, FD, PPF, NPS calculations
- **AI Personal Finance Coach**: Gemini-powered conversational mentor
- **Tax & Policy Impact Simulator**: Real-world impact of government policies
- **Multilingual Financial Literacy**: Education in 6+ Indian languages
- **Rural Market Support**: Mandi prices and profit optimization

## Tech Stack

- **Backend**: FastAPI + Python
- **AI**: Gemini Next-16
- **Database**: SQLite (SQLModel)
- **Frontend**: Next.js + React (reference)
- **Deployment**: Free-tier friendly (Render/Fly.io)

## Quick Start

```bash
cd bharat-finance-platform
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Visit: http://localhost:8000/docs

## API Endpoints

- `/simulate/investment` - Investment calculations
- `/ai/finance-coach/chat` - AI financial guidance
- `/policy/simulate-tax` - Tax impact simulation
- `/mandi/prices` - Rural market data

## Environment Setup

Copy `.env.example` to `.env` and add your Gemini API key.