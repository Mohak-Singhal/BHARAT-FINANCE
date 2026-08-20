import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface QuizQuestion {
  question: string
  options: string[]
  correct: string
}

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  channel: string
  url: string
  embed_url: string
}

interface Article {
  title: string
  summary: string
  source: string
  url: string
  key_points: string[]
  indian_context: string
}

interface GovernmentScheme {
  name: string
  category: string
  description: string
  benefits: string[]
  eligibility: string
  how_to_apply: string
  official_website?: string
  launched_year?: string
  beneficiaries?: string
}

interface TopicDefinition {
  title: string
  content: string[]
  key_points: string[]
  examples: string[]
  quiz: QuizQuestion[]
  schemes: string[]
}

// Real, embeddable educational YouTube videos (reused across lessons).
const VIDEO_POOL: Video[] = [
  {
    id: 'v684N5MLajA',
    title: 'Personal Finance Basics Explained',
    description: 'Simple introduction to managing your money, saving and investing.',
    thumbnail: 'https://i.ytimg.com/vi/v684N5MLajA/mqdefault.jpg',
    channel: 'Upasana Kou | Personal Finance TV',
    url: 'https://www.youtube.com/watch?v=v684N5MLajA',
    embed_url: 'https://www.youtube.com/embed/v684N5MLajA',
  },
  {
    id: 'YSux7rtMo9k',
    title: 'Investing for Beginners in India',
    description: 'Step-by-step guide to start investing in India with small amounts.',
    thumbnail: 'https://i.ytimg.com/vi/YSux7rtMo9k/mqdefault.jpg',
    channel: 'INDmoney',
    url: 'https://www.youtube.com/watch?v=YSux7rtMo9k',
    embed_url: 'https://www.youtube.com/embed/YSux7rtMo9k',
  },
  {
    id: '6sq2o1atWLY',
    title: 'Mutual Funds and SIP Explained',
    description: 'How mutual funds and SIPs work - the complete beginner guide.',
    thumbnail: 'https://i.ytimg.com/vi/6sq2o1atWLY/mqdefault.jpg',
    channel: 'Zerodha Varsity',
    url: 'https://www.youtube.com/watch?v=6sq2o1atWLY',
    embed_url: 'https://www.youtube.com/embed/6sq2o1atWLY',
  },
  {
    id: 'T7JHfLGm_GY',
    title: 'Money Management Tips',
    description: 'Practical money management and budgeting advice for young India.',
    thumbnail: 'https://i.ytimg.com/vi/T7JHfLGm_GY/mqdefault.jpg',
    channel: 'warikoo',
    url: 'https://www.youtube.com/watch?v=T7JHfLGm_GY',
    embed_url: 'https://www.youtube.com/embed/T7JHfLGm_GY',
  },
  {
    id: 'BKTN4C0m6MY',
    title: 'Stock Market Basics for Beginners',
    description: 'Understand how the stock market works in simple terms.',
    thumbnail: 'https://i.ytimg.com/vi/BKTN4C0m6MY/mqdefault.jpg',
    channel: 'Ranveer Allahbadia',
    url: 'https://www.youtube.com/watch?v=BKTN4C0m6MY',
    embed_url: 'https://www.youtube.com/embed/BKTN4C0m6MY',
  },
  {
    id: 'gv20filGA7o',
    title: 'Tax Saving Investments Explained',
    description: 'All tax-saving options under 80C and beyond, explained simply.',
    thumbnail: 'https://i.ytimg.com/vi/gv20filGA7o/mqdefault.jpg',
    channel: 'Neeraj Joshi',
    url: 'https://www.youtube.com/watch?v=gv20filGA7o',
    embed_url: 'https://www.youtube.com/embed/gv20filGA7o',
  },
  {
    id: '3UF0ymVdYLA',
    title: 'Insurance Planning Guide',
    description: 'Why insurance first - term life and health insurance explained.',
    thumbnail: 'https://i.ytimg.com/vi/3UF0ymVdYLA/mqdefault.jpg',
    channel: 'Pranjal Kamra',
    url: 'https://www.youtube.com/watch?v=3UF0ymVdYLA',
    embed_url: 'https://www.youtube.com/embed/3UF0ymVdYLA',
  },
  {
    id: 'pado678nYbg',
    title: 'Retirement Planning in India',
    description: 'How to build your retirement corpus with PPF, NPS and more.',
    thumbnail: 'https://i.ytimg.com/vi/pado678nYbg/mqdefault.jpg',
    channel: 'Vaani Wealth',
    url: 'https://www.youtube.com/watch?v=pado678nYbg',
    embed_url: 'https://www.youtube.com/embed/pado678nYbg',
  },
]

interface SchemeDefinition {
  name: string
  category: string
  description: string
  benefits: string[]
  eligibility: string
  how_to_apply: string
  official_website: string
  launched_year: string
  beneficiaries: string
}

const SCHEMES: Record<string, SchemeDefinition> = {
  pmjdy: {
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    category: 'banking',
    description: 'Financial inclusion program providing a bank account to every Indian household.',
    benefits: ['Zero-balance savings account', 'RuPay debit card', '₹2 lakh accident insurance', 'Overdraft facility up to ₹10,000'],
    eligibility: 'All Indian citizens above 10 years of age',
    how_to_apply: 'Visit your nearest bank branch or business correspondent with Aadhaar and a passport-size photo',
    official_website: 'https://www.pmjdy.gov.in/',
    launched_year: '2014',
    beneficiaries: 'Over 50 crore accounts',
  },
  pmsby: {
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    category: 'insurance',
    description: 'Accident insurance cover of ₹2 lakh for just ₹20 per year.',
    benefits: ['₹2 lakh accidental death cover', '₹2 lakh permanent disability cover', 'Just ₹20 per year premium'],
    eligibility: 'Bank account holders aged 18-70',
    how_to_apply: 'Opt-in through your bank account or any bank branch',
    official_website: 'https://www.pmsby.gov.in/',
    launched_year: '2015',
    beneficiaries: 'Over 34 crore enrolments',
  },
  pmjjby: {
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    category: 'insurance',
    description: 'Life insurance cover of ₹2 lakh for just ₹436 per year.',
    benefits: ['₹2 lakh life cover', 'Premium ₹436 per year', 'Covers death from any cause'],
    eligibility: 'Bank account holders aged 18-50',
    how_to_apply: 'Opt-in through your bank, auto-debited yearly',
    official_website: 'https://www.pmjjy.gov.in/',
    launched_year: '2015',
    beneficiaries: 'Over 7 crore enrolments',
  },
  apy: {
    name: 'Atal Pension Yojana (APY)',
    category: 'retirement',
    description: 'Guaranteed pension of ₹1,000-₹5,000 per month after 60 for informal workers.',
    benefits: ['Guaranteed monthly pension', 'Government co-contribution up to ₹1,000/year (5 years)', 'Death benefit to spouse'],
    eligibility: 'Aged 18-40, bank account holder, not an income taxpayer',
    how_to_apply: 'Enrol at any bank or post office with Aadhaar and bank passbook',
    official_website: 'https://www.apy.gov.in/',
    launched_year: '2015',
    beneficiaries: 'Over 7 crore subscribers',
  },
  pmkisan: {
    name: 'PM Kisan Samman Nidhi',
    category: 'agriculture',
    description: '₹6,000 per year income support to all landholding farmer families.',
    benefits: ['₹6,000 per year in 3 instalments', 'Direct transfer to bank account'],
    eligibility: 'Landholding farmer families with cultivable land',
    how_to_apply: 'Register on the PM-Kisan portal or through local agriculture office',
    official_website: 'https://pmkisan.gov.in/',
    launched_year: '2019',
    beneficiaries: 'Over 11 crore farmers',
  },
  pmfby: {
    name: 'PM Fasal Bima Yojana (PMFBY)',
    category: 'agriculture',
    description: 'Crop insurance at very low premium for farmers against crop loss.',
    benefits: ['Comprehensive crop cover', 'Premium as low as 2% (Kharif) / 1.5% (Rabi) of sum insured', 'Covers natural calamities and pests'],
    eligibility: 'All farmers growing notified crops',
    how_to_apply: 'Through banks, insurance companies, or CSC centres during enrolment season',
    official_website: 'https://pmfby.gov.in/',
    launched_year: '2016',
    beneficiaries: 'Over 50 crore farmer applications',
  },
  sss: {
    name: 'Sukanya Samriddhi Yojana (SSY)',
    category: 'savings',
    description: 'High-interest savings scheme for girl child education and marriage.',
    benefits: ['8.2% p.a. interest (tax-free)', '₹1.5 lakh tax deduction under 80C', 'Account for girl child below 10 years'],
    eligibility: 'Girl child below 10 years, deposits till age 15, maturity at 21',
    how_to_apply: 'Open at any post office or authorised bank branch',
    official_website: 'https://www.indiapost.gov.in/',
    launched_year: '2015',
    beneficiaries: 'Over 4 crore accounts',
  },
  pmegp: {
    name: 'PM Employment Generation Programme (PMEGP)',
    category: 'business',
    description: 'Subsidy support up to ₹50 lakh for new micro-enterprises.',
    benefits: ['Margin money subsidy up to 35%', 'Loans up to ₹50 lakh', 'Employment generation'],
    eligibility: 'Individuals and groups above 18, new businesses only',
    how_to_apply: 'Apply online at the PMEGP portal or through District Industries Centre',
    official_website: 'https://www.kviconline.gov.in/',
    launched_year: '2008',
    beneficiaries: 'Lakhs of new enterprises',
  },
  sby: {
    name: 'Stand-Up India Scheme',
    category: 'business',
    description: 'Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.',
    benefits: ['Loans ₹10L - ₹1 Cr', 'Margin money subsidy up to 10%', 'Composite loan for greenfield enterprise'],
    eligibility: 'SC/ST entrepreneurs and women above 18',
    how_to_apply: 'Apply at any scheduled commercial bank branch',
    official_website: 'https://www.standupmitra.in/',
    launched_year: '2016',
    beneficiaries: 'Lakhs of entrepreneurs',
  },
  pmay: {
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    category: 'housing',
    description: 'Subsidy on home loans for affordable housing for urban and rural poor.',
    benefits: ['Interest subsidy up to ₹2.67 lakh', 'Credit-linked subsidy scheme', 'Housing for all by 2024-25'],
    eligibility: 'Economically weaker sections, LIG and MIG groups',
    how_to_apply: 'Apply online at the PMAY portal or through banks and CSC centres',
    official_website: 'https://pmaymis.gov.in/',
    launched_year: '2015',
    beneficiaries: 'Over 1.5 crore houses sanctioned',
  },
}

// Article templates attached to every lesson.
function buildArticles(title: string, sources: Array<[string, string]>): Article[] {
  return sources.map(([source, url], index) => ({
    title: `${title} - Complete Guide`,
    summary: `Comprehensive guide covering all aspects of ${title.toLowerCase()} with Indian context, examples and practical steps.`,
    source,
    url,
    key_points: [
      `Understand ${title.toLowerCase()} fundamentals`,
      'Indian regulatory framework and options',
      'Practical implementation steps',
      'Common mistakes to avoid',
    ],
    indian_context: 'Specifically designed for Indian users with local examples, schemes and regulations.',
  }))
}

const TOPIC_CONTENT: Record<string, TopicDefinition> = {
  budgeting: {
    title: 'Budgeting Basics',
    content: [
      'A budget is simply a plan for your money - it tells every rupee where to go instead of wondering where it went. For most Indian households earning ₹15,000-₹50,000 per month, a simple budget is the single most powerful financial tool.',
      'Start with the 50-30-20 rule: spend 50% of income on needs (rent, food, utilities, transport), 30% on wants (entertainment, dining out, shopping), and save at least 20%. If your income is low, aim for even a 10% savings rate to begin - the habit matters more than the amount.',
      'Track every expense for one month using a notebook or a free app. You will often discover that small daily spends - chai, snacks, mobile recharges - add up to surprising amounts. Once you see the pattern, set monthly limits per category.',
      'Review your budget every month and adjust for festivals, school fees and seasonal expenses. Automate your savings: on salary day, move 20% to a separate savings account immediately. What you do not see, you do not miss.',
    ],
    key_points: [
      '50-30-20 rule: needs, wants, savings',
      'Track expenses for 30 days first',
      'Automate savings on salary day',
      'Review budget monthly',
      'Small spends add up - watch them',
    ],
    examples: [
      'Ramesh earns ₹25,000/month. His budget: ₹12,500 needs, ₹7,500 wants, ₹5,000 savings (20%). After 1 year he has ₹60,000 saved plus interest.',
      'Priya found she spent ₹3,500/month on snacks and delivery. Cutting it to ₹1,500 freed ₹24,000 per year - enough for an emergency fund start.',
    ],
    quiz: [
      {
        question: 'What is the recommended minimum savings rate under the 50-30-20 rule?',
        options: ['A) 5%', 'B) 10%', 'C) 20%', 'D) 40%'],
        correct: 'C',
      },
    ],
    schemes: ['pmjdy', 'ssy'],
  },
  saving: {
    title: 'Saving & Savings Schemes',
    content: [
      'Saving is income minus spending - the money you keep for future needs. In India, you have excellent government-backed options: Bank Recurring Deposits (5.5-7%), Fixed Deposits (6-7%), and Post Office schemes like PPF (7.1% tax-free) and Sukanya Samriddhi (8.2% for a girl child).',
      'The golden rule: build an emergency fund of 6 months of expenses FIRST, in a liquid savings account or liquid mutual fund. Only then think about investments. For a family spending ₹20,000/month, that means saving ₹1.2 lakh before investing elsewhere.',
      'For short-term goals (1-3 years), prefer RDs, FDs and Post Office time deposits - safe, predictable and easy to understand. Avoid equity for money you may need soon.',
      'Save for specific goals with separate accounts or "envelopes" - house deposit, school fees, festival expenses. Naming your savings gives you the motivation to protect them.',
    ],
    key_points: [
      'Emergency fund of 6 months first',
      'RD/FD/PPF for safe, simple saving',
      'Sukanya Samriddhi 8.2% for girl child',
      'Short-term goals need safe instruments',
      'Separate savings per goal',
    ],
    examples: [
      'A ₹5,000/month RD at 6.5% grows to about ₹62,300 in one year - low risk, guaranteed.',
      'PPF with ₹1,500/month for 15 years grows to over ₹4.9 lakh (tax-free) at 7.1%.',
    ],
    quiz: [
      {
        question: 'How many months of expenses should your emergency fund cover?',
        options: ['A) 1 month', 'B) 3 months', 'C) 6 months', 'D) 12 months'],
        correct: 'C',
      },
    ],
    schemes: ['ssy', 'pmjdy'],
  },
  banking: {
    title: 'Banking & Accounts',
    content: [
      'A bank account is the doorway to the entire financial system - salary, savings, UPI, loans and insurance all start here. Under PMJDY, every Indian can open a zero-balance account with a free RuPay debit card.',
      'Choose the right account: a regular savings account if you need branches, or a digital-only account for lower minimum balances. Always compare charges - some banks charge ₹25-₹100 per month if minimum balance drops.',
      'Enable UPI (Unified Payments Interface) for instant free transfers using just a mobile number and UPI PIN. It works 24x7 and is safer than carrying cash - but NEVER share your UPI PIN or OTP with anyone.',
      'Keep your KYC updated (Aadhaar, PAN, address proof). Nominate someone for your account so your family can access funds easily in an emergency. Check your bank statement every month for unknown charges or transactions.',
    ],
    key_points: [
      'Zero-balance PMJDY accounts available',
      'Compare minimum balance charges',
      'UPI is free and instant - keep PIN secret',
      'Never share OTPs with anyone',
      'Keep KYC and nomination updated',
    ],
    examples: [
      'Sita sends ₹500 to her brother using UPI in 5 seconds - no queue, no charge, no minimum amount.',
      'Raju caught an unwanted ₹99/month SMS charge by reviewing his statement - he cancelled it and saved ₹1,188/year.',
    ],
    quiz: [
      {
        question: 'What should you NEVER share with anyone?',
        options: ['A) Your account number', 'B) Your UPI PIN and OTP', 'C) Your IFSC code', 'D) Your branch address'],
        correct: 'B',
      },
    ],
    schemes: ['pmjdy'],
  },
  'digital payments': {
    title: 'Digital Payments & Safety',
    content: [
      'India leads the world in digital payments - UPI processes over 12 billion transactions every month. You can pay, receive and transfer money instantly with just a smartphone, or even a simple feature phone via USSD (*99#).',
      'Start with UPI apps (GPay, PhonePe, Paytm, BHIM). Link your bank account, create a UPI PIN, and use QR codes at any shop. Transactions are free and protected by your PIN.',
      'Safety rules: Never share your UPI PIN, OTP or card CVV. Beware of "customer care" calls asking for OTPs. Check the UPI ID before confirming payment. Use the official app for any transaction - do not click links sent via SMS or WhatsApp.',
      'If you lose your phone, immediately block the SIM, change your UPI PIN and inform your bank. Register on the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call 1930 if you are cheated - fast reporting can help freeze stolen money.',
    ],
    key_points: [
      'UPI is free, instant, 24x7',
      'Never share PIN, OTP or CVV',
      'Beware fake customer care calls',
      'Report fraud at 1930 or cybercrime.gov.in',
      'Block SIM and change PIN if phone lost',
    ],
    examples: [
      'Mohan sells vegetables at a weekly haat - a UPI QR code increased his daily sales by 40% because customers without cash could still buy.',
      'Lakshmi received a call from "bank staff" asking for OTP. She refused and reported it - protecting ₹45,000 in her account.',
    ],
    quiz: [
      {
        question: 'A "bank employee" asks for your OTP to "reverse a wrong credit". What do you do?',
        options: ['A) Share the OTP immediately', 'B) Refuse - banks never ask for OTPs', 'C) Share it after verifying', 'D) Read it out slowly'],
        correct: 'B',
      },
    ],
    schemes: ['pmjdy'],
  },
  'mutual funds': {
    title: 'Mutual Funds',
    content: [
      'A mutual fund pools money from thousands of investors and invests it in stocks, bonds or other assets, managed by a professional fund manager. For ₹500-₹1,000 a month, you get access to a professionally managed, diversified portfolio.',
      'Fund categories: Equity funds (high growth, high risk), Debt funds (stable, low risk), Hybrid funds (balanced), and ELSS (equity with tax benefit under 80C). Choose based on your goal and time horizon - equity for 5+ years, debt for shorter periods.',
      'Use the Direct Plan (lower expense ratio, higher returns) and invest through a good platform or the AMC website. Check the expense ratio - a 1% difference compounds into lakhs over 20 years.',
      'Mutual funds are NOT fixed deposits - values go up and down daily. Stay invested for at least 3-5 years and ignore short-term noise. Review once a year; avoid churning funds based on recent performance.',
    ],
    key_points: [
      'Start with as little as ₹500/month',
      'Equity = long term, Debt = short term',
      'Prefer Direct plans (lower fees)',
      'Ignore short-term ups and downs',
      'Review funds once a year',
    ],
    examples: [
      'A ₹2,000/month SIP in an equity fund returning 12% grows to about ₹4.9 lakh in 10 years (invested: ₹2.4 lakh).',
      'Switching from a Regular plan (1.5% fee) to Direct plan (0.6% fee) on a ₹10 lakh portfolio saves about ₹9,000 every year.',
    ],
    quiz: [
      {
        question: 'Which fund is best for money you need in 2 years?',
        options: ['A) Equity fund', 'B) Small cap fund', 'C) Debt fund', 'D) International fund'],
        correct: 'C',
      },
    ],
    schemes: [],
  },
  sip: {
    title: 'SIP - Systematic Investment Plan',
    content: [
      'A SIP is a simple way to invest a fixed amount in a mutual fund every month - like a "savings RD for equity". It builds discipline, averages your purchase price (rupee cost averaging), and uses the power of compounding.',
      'Start small: ₹500-₹1,000/month is enough. Choose the date just after salary day so you invest before spending. Increase the amount by 10% every year (step-up SIP) to keep pace with salary growth.',
      'SIPs work best over 5-7+ years. Markets go up and down, but SIPs buy more units when prices fall - automatically. Do not stop your SIP in a falling market; that is exactly when you are getting units cheaply.',
      'For tax-saving, use ELSS SIPs - they offer 80C deduction with only a 3-year lock-in. You can start, pause or stop SIPs anytime without penalty.',
    ],
    key_points: [
      'Fixed monthly investing - automation',
      'Rupee cost averaging works in your favour',
      'Best for 5-7+ year goals',
      'Never stop SIP in a falling market',
      'ELSS SIPs give tax benefits',
    ],
    examples: [
      '₹1,000/month SIP at 12% CAGR for 15 years = about ₹5 lakh (invested only ₹1.8 lakh).',
      'During a market dip, the same ₹1,000 buys more units - your average cost drops automatically.',
    ],
    quiz: [
      {
        question: 'When markets fall, a SIP investor should:',
        options: ['A) Stop the SIP', 'B) Withdraw money', 'C) Continue or increase the SIP', 'D) Switch to gold'],
        correct: 'C',
      },
    ],
    schemes: [],
  },
  ppf: {
    title: 'PPF - Public Provident Fund',
    content: [
      'PPF is the most popular long-term tax-free saving scheme in India. Open an account with just ₹500 at any post office or bank, deposit up to ₹1.5 lakh per year, and earn 7.1% interest that is completely tax-free.',
      'The account matures in 15 years, with extension possible in blocks of 5 years. Partial withdrawals are allowed from year 7, and loans from year 3 to 6 - useful for emergencies.',
      'PPF deposits qualify for deduction under Section 80C (up to ₹1.5 lakh). Interest earned and maturity amount are both fully tax-free - this makes PPF a cornerstone of retirement planning.',
      'Limit: 7.1% return is modest, so use PPF for the "safe" part of your portfolio (40-60%) and equity for growth. One PPF account per person - opening multiple accounts invites penalties.',
    ],
    key_points: [
      'Start with just ₹500, max ₹1.5L/year',
      '7.1% interest, completely tax-free',
      '15-year maturity, extendable',
      '80C deduction on deposits',
      'Best for safe, long-term savings',
    ],
    examples: [
      '₹1.5 lakh/year in PPF for 15 years at 7.1% grows to about ₹39 lakh (deposited: ₹22.5 lakh), all tax-free.',
      'A salaried person saving ₹12,500/month in PPF meets the full 80C limit of ₹1.5 lakh.',
    ],
    quiz: [
      {
        question: 'What is the maximum annual deposit in PPF?',
        options: ['A) ₹50,000', 'B) ₹1 lakh', 'C) ₹1.5 lakh', 'D) ₹2 lakh'],
        correct: 'C',
      },
    ],
    schemes: ['ssy'],
  },
  nps: {
    title: 'NPS - National Pension System',
    content: [
      'NPS is a government pension scheme that builds a retirement corpus with market-linked returns. You invest during your working life and can withdraw 60% tax-free at 60, with 40% used to buy an annuity for monthly pension.',
      'You can invest as little as ₹500 per month or ₹1,000 per year. Government employees get mandatory NPS; everyone else can open an account online (eNPS) or through a bank. The government co-contributes ₹50,000 for new subscribers aged 18-25 under the NPS Vatsalya/PM SHREY initiatives.',
      'Tax benefits: contributions up to ₹1.5 lakh under 80C, plus an EXTRA ₹50,000 under 80CCD(1B) - an additional deduction available only through NPS.',
      'NPS offers three fund options: Equity (E), Corporate Bonds (C) and Government Securities (G). Young investors can put 50-75% in equity and reduce it as they age. Charges are among the lowest in the industry.',
    ],
    key_points: [
      'Builds retirement corpus with pension',
      'Extra ₹50,000 tax deduction (80CCD-1B)',
      'Start from ₹500/month',
      'Choose E/C/G allocation by age',
      '60% tax-free withdrawal at 60',
    ],
    examples: [
      'A 25-year-old investing ₹5,000/month in NPS at 9% return builds a corpus of about ₹1.7 crore by age 60.',
      '₹50,000 in NPS under 80CCD(1B) saves up to ₹15,450 in tax at the 30% slab.',
    ],
    quiz: [
      {
        question: 'How much EXTRA tax deduction does NPS give beyond 80C?',
        options: ['A) ₹25,000', 'B) ₹50,000', 'C) ₹75,000', 'D) ₹1 lakh'],
        correct: 'B',
      },
    ],
    schemes: ['apy'],
  },
  elss: {
    title: 'ELSS - Equity Linked Savings Scheme',
    content: [
      'ELSS is a special equity mutual fund with a 3-year lock-in that offers tax deduction under Section 80C up to ₹1.5 lakh. It is the only tax-saving instrument whose returns are market-linked, historically giving 12-15% over the long term.',
      'Compared to PPF (7.1%) and FD (6-7%) under 80C, ELSS has the potential for the highest returns, but with market risk. With a 3-year lock-in and a 5-7 year recommended horizon, it suits younger taxpayers.',
      'You can invest via lump sum or SIP. ELSS SIPs are popular - a monthly ELSS SIP builds the 80C benefit gradually while averaging market risk.',
      'Do not invest in ELSS just for tax saving if you need the money soon or cannot tolerate volatility. Diversify 80C across ELSS, PPF and life insurance premium.',
    ],
    key_points: [
      'Only 80C option with market-linked returns',
      '3-year lock-in, 5-7 year ideal horizon',
      '12-15% historical long-term returns',
      'Works via SIP or lump sum',
      'Combine with PPF for balance',
    ],
    examples: [
      '₹12,500/month ELSS SIP for 10 years at 13% = about ₹29 lakh, plus full ₹1.5L 80C deduction every year.',
      'Saving ₹30,000 tax on ₹1.5 lakh at 20% slab - effectively the government funds part of your investment.',
    ],
    quiz: [
      {
        question: 'What is the lock-in period for ELSS funds?',
        options: ['A) 1 year', 'B) 2 years', 'C) 3 years', 'D) 5 years'],
        correct: 'C',
      },
    ],
    schemes: [],
  },
  'fixed deposits': {
    title: 'Fixed Deposits & RDs',
    content: [
      'Fixed Deposits (FD) are the most trusted savings instrument in India - you deposit a lump sum for a fixed period (7 days to 10 years) and earn guaranteed interest of 6-7.5% depending on the bank. Senior citizens get 0.25-0.5% more.',
      'Recurring Deposits (RD) work for monthly savers: deposit a fixed amount every month for 6 months to 10 years and earn FD-like interest. Perfect for building a corpus without a lump sum.',
      'FD safety: deposits up to ₹5 lakh per bank are insured by DICGC. For extra safety, split large amounts across banks. Corporate FDs offer higher rates but carry default risk - stick to AAA-rated companies if you use them.',
      'Tax: interest on FD is taxable as per your slab, and TDS is deducted if interest exceeds ₹40,000 (₹50,000 for senior citizens). If your income is below taxable limits, submit Form 15G/15H to avoid TDS.',
    ],
    key_points: [
      'FD: guaranteed 6-7.5% returns',
      'RD: monthly saving with FD returns',
      '₹5 lakh insurance per bank (DICGC)',
      'Senior citizens get higher rates',
      'Interest is taxable; use Form 15G/15H if eligible',
    ],
    examples: [
      '₹1 lakh FD at 7% for 3 years grows to ₹1.22 lakh - fully predictable.',
      'A ₹5,000/month RD at 6.5% for 5 years builds ₹3.5 lakh - automatic and safe.',
    ],
    quiz: [
      {
        question: 'How much deposit is insured per bank under DICGC?',
        options: ['A) ₹1 lakh', 'B) ₹3 lakh', 'C) ₹5 lakh', 'D) ₹10 lakh'],
        correct: 'C',
      },
    ],
    schemes: [],
  },
  insurance: {
    title: 'Insurance Planning',
    content: [
      'Insurance comes BEFORE investment. One hospital bill or untimely death can wipe out years of savings - insurance protects your family against these shocks. As a rule, secure health and life cover before starting equity investments.',
      'Health insurance: every family should have at least ₹5 lakh cover. Premiums for a family of four start around ₹15,000-₹25,000/year. Buy early - premiums rise with age and pre-existing conditions may be excluded.',
      'Life insurance: a term plan of 10-15x your annual income is the cheapest and best. A 30-year-old can get ₹1 crore term cover for just ₹10,000-₹15,000/year. Avoid endowment and ULIP policies sold aggressively - they mix investment with insurance and give poor returns.',
      'Government schemes make insurance affordable: PMJJBY (₹2 lakh life cover @ ₹436/year) and PMSBY (₹2 lakh accident cover @ ₹20/year). Add these immediately if you have none.',
    ],
    key_points: [
      'Insurance before investment - always',
      'Health cover ₹5L+ per family first',
      'Term life = 10-15x annual income',
      'PMJJBY ₹436/yr and PMSBY ₹20/yr are steals',
      'Avoid endowment/ULIP "investment" policies',
    ],
    examples: [
      'Ravi, 30, earns ₹6 lakh/year. A ₹60 lakh term plan costs ~₹9,000/year - his family is protected for under 1.5% of income.',
      'A surgery costing ₹8 lakh left a family with ₹6 lakh bills because they had no health insurance - a ₹18,000/year premium would have covered it.',
    ],
    quiz: [
      {
        question: 'What should you buy FIRST before investing?',
        options: ['A) Gold', 'B) Health and term insurance', 'C) Shares', 'D) Second property'],
        correct: 'B',
      },
    ],
    schemes: ['pmjjby', 'pmsby'],
  },
  'life insurance': {
    title: 'Life Insurance',
    content: [
      'Life insurance ensures your family is financially secure if you are no longer there. The correct way to buy it: a pure Term Plan that pays a fixed sum (sum assured) to your nominee on death. No bonuses, no maturity payouts - just protection at the lowest cost.',
      'How much cover? 10-15 times your annual income, or enough to replace your income and clear debts. Add education goals: for a child, include future fees in the cover.',
      'Term plan costs: a 30-year-old healthy male gets ₹1 crore cover for about ₹1,000-₹1,300/month for 30 years. Premiums are locked at purchase - buy while young and healthy.',
      'Beware: money-back, endowment and ULIP policies combine insurance with savings but deliver 4-6% returns. A simple formula - buy term insurance, invest the difference in PPF/index funds - almost always wins. You can also buy the affordable PMJJBY for basic cover.',
    ],
    key_points: [
      'Term plan: pure protection, lowest cost',
      'Cover = 10-15x annual income',
      'Buy early - lock low premiums',
      'Avoid endowment/ULIP hybrids',
      'PMJJBY gives ₹2L cover @ ₹436/year',
    ],
    examples: [
      'Term ₹1 crore at 30 = ~₹12,000/year. Endowment policy with same premium gives only ~₹30 lakh cover and lower returns - term wins.',
      'A teacher with ₹4 lakh income bought ₹50 lakh term cover for ₹7,500/year - 1.9% of income for total family security.',
    ],
    quiz: [
      {
        question: 'The ideal life cover is:',
        options: ['A) 2x annual income', 'B) 10-15x annual income', 'C) ₹5 lakh flat', 'D) Whatever the agent suggests'],
        correct: 'B',
      },
    ],
    schemes: ['pmjjby'],
  },
  'health insurance': {
    title: 'Health Insurance',
    content: [
      'Health insurance covers hospitalisation expenses - one surgery in a private hospital costs ₹3-10 lakh today. A good health plan ensures you never choose between health and savings.',
      'Minimum cover: ₹5 lakh per family (₹10 lakh for metro cities). A family floater plan covering husband, wife and kids in one policy is cost-effective - premiums around ₹18,000-₹30,000/year for ₹5-10 lakh cover.',
      'Buy early (20s-30s): premiums rise with age, and waiting periods for pre-existing diseases reduce. Look for: cashless network hospitals, no room rent capping (or at least ₹10,000/day), ambulance cover, and day-care procedure cover.',
      'Under Section 80D you can deduct premiums: up to ₹25,000 for self and family (₹50,000 if anyone is a senior citizen) plus ₹25,000 for parents. That is a direct tax saving on top of the protection.',
      'Government options: PMJAY (Ayushman Bharat) gives ₹5 lakh free cover to low-income families - check if you qualify, and keep a PMSBY accident policy as basic cover.',
    ],
    key_points: [
      'Cover ₹5L+ per family as a must',
      'Buy in your 20s-30s for lower premiums',
      'Prefer cashless network hospitals',
      '80D deduction: ₹25K self + ₹25K parents',
      'Check PMJAY/Ayushman eligibility',
    ],
    examples: [
      'A ₹8 lakh heart surgery was fully covered by a ₹18,000/year family policy - no savings were touched.',
      'By buying at 28 instead of 40, Sunil pays ₹16,000/year instead of ₹32,000 for the same ₹10 lakh cover.',
    ],
    quiz: [
      {
        question: 'What is the minimum recommended health cover for a family?',
        options: ['A) ₹1 lakh', 'B) ₹2 lakh', 'C) ₹5 lakh', 'D) ₹50 lakh'],
        correct: 'C',
      },
    ],
    schemes: ['pmsby', 'pmjjby'],
  },
  'motor insurance': {
    title: 'Motor Insurance',
    content: [
      'Third-party motor insurance is mandatory by law in India. It covers damage you cause to others - but NOT your own vehicle. For complete protection, add "comprehensive" cover that also covers your car/two-wheeler against accidents, theft and natural calamities.',
      'Two-wheelers: third-party costs about ₹700-₹1,700/year; comprehensive adds ₹1,500-₹3,000. Cars: comprehensive cover for a ₹8 lakh car costs roughly ₹8,000-₹12,000/year including own-damage premium.',
      'Add-ons worth considering: zero-depreciation (pays full claim without depreciation), engine protection, roadside assistance, and return-to-invoice (for new cars). These cost ₹500-₹2,000 extra but prevent nasty surprises.',
      'Never drive without insurance - penalties are steep (₹2,000-₹5,000), and more importantly, an uninsured accident can destroy your finances. Renew before expiry; a lapsed policy loses no-claim bonus (up to 50% discount).',
    ],
    key_points: [
      'Third-party cover is legally mandatory',
      'Comprehensive covers your own vehicle too',
      'Zero-depreciation add-on is worth it',
      'No-claim bonus: up to 50% discount',
      'Never drive uninsured',
    ],
    examples: [
      'An uninsured bike owner crashed into a car - a ₹60,000 third-party claim came out of his pocket plus a ₹2,000 fine.',
      'Renewing a car policy before expiry with 5 years no-claim bonus cut the premium from ₹10,000 to ₹5,000.',
    ],
    quiz: [
      {
        question: 'What insurance is legally mandatory for all vehicles?',
        options: ['A) Comprehensive', 'B) Third-party', 'C) Zero-depreciation', 'D) Engine protection'],
        correct: 'B',
      },
    ],
    schemes: [],
  },
  'crop insurance': {
    title: 'Crop Insurance (PMFBY)',
    content: [
      'Farming faces floods, drought, pests and price crashes - crop insurance protects farmer income against these losses. PM Fasal Bima Yojana (PMFBY) is the main government scheme covering all food crops, oilseeds and annual commercial crops.',
      'Premium is low: 2% of sum insured for Kharif, 1.5% for Rabi, and 5% for commercial crops - the rest is subsidised by the government. Your insured amount is based on the value of the crop you declare at sowing.',
      'Enrol before the notified deadline (usually within 1-2 weeks of sowing) through banks, insurance companies, or Common Service Centres (CSC). You need land records and bank account details.',
      'When a calamity hits, the local revenue department conducts crop-cutting experiments (CCE). Compensation is directly credited to your account within 2-3 months. Keep all documents and check your claim status on the PMFBY portal.',
    ],
    key_points: [
      'PMFBY: 2% premium (Kharif), 1.5% (Rabi)',
      'Covers natural calamities and pests',
      'Enrol within 1-2 weeks of sowing',
      'Claims via crop-cutting experiments',
      'Direct benefit transfer to bank account',
    ],
    examples: [
      'A farmer with ₹1 lakh insured wheat crop pays just ₹1,500 premium. When hail destroyed 60% of the crop, he received ₹60,000 compensation.',
      'Failing to enrol on time left another farmer with zero support after floods - the deadline is strictly enforced.',
    ],
    quiz: [
      {
        question: 'What is the PMFBY premium rate for Kharif crops?',
        options: ['A) 1%', 'B) 2%', 'C) 5%', 'D) 10%'],
        correct: 'B',
      },
    ],
    schemes: ['pmfby', 'pmkisan'],
  },
  'tax planning': {
    title: 'Tax Planning',
    content: [
      'Smart tax planning legally reduces your tax bill and increases savings. Indian taxpayers must file ITR even with zero tax if income crosses ₹2.5 lakh (₹3 lakh under new regime) - filing is mandatory above ₹2.5 lakh for most.',
      'Use Section 80C fully: invest ₹1.5 lakh in PPF, ELSS, EPF, life insurance premium or 5-year tax-saving FD. This saves up to ₹46,800 in tax at the 30% slab (plus 4% cess).',
      'Additional deductions: ₹50,000 in NPS (80CCD-1B), health insurance premium up to ₹25,000 for self + ₹25,000 for parents (80D), ₹2,400/year for preventive health checkups.',
      'Compare old vs new regime every year: the new regime (FY 2024-25) offers lower rates and a ₹75,000 standard deduction but removes most deductions. Use the calculator - the right choice differs by income and deductions. File your ITR on time to avoid ₹1,000-₹10,000 penalties.',
    ],
    key_points: [
      'Fill 80C fully: PPF, ELSS, EPF, insurance',
      'NPS adds ₹50,000 more (80CCD-1B)',
      'Health premium: 80D up to ₹50,000',
      'Compare old vs new regime yearly',
      'File ITR before the deadline',
    ],
    examples: [
      'A person earning ₹12 lakh with full 80C + ₹50k NPS + ₹25k insurance saves about ₹62,000 in tax under the old regime.',
      'Using the new regime with no deductions at ₹12 lakh income - the calculator shows new regime wins. Regime choice is personal.',
    ],
    quiz: [
      {
        question: 'The maximum combined 80C + 80CCD(1B) deduction is:',
        options: ['A) ₹1.5 lakh', 'B) ₹2 lakh', 'C) ₹2.5 lakh', 'D) ₹3 lakh'],
        correct: 'B',
      },
    ],
    schemes: [],
  },
  'emergency fund': {
    title: 'Emergency Fund',
    content: [
      'An emergency fund is cash kept aside for job loss, medical needs, home repairs or unexpected expenses. It is the difference between a crisis and a disaster. Build it BEFORE any other investment.',
      'Target: 6 months of essential expenses. If your family spends ₹25,000/month, keep ₹1.5 lakh ready. Start small - even ₹50,000 or 2 months of expenses - then top it up monthly.',
      'Where to keep it: a separate savings account (instant access) or a liquid mutual fund (slightly higher returns, 1-2 day withdrawal). Never put emergency money in equity - it can be down exactly when you need it.',
      'Rules: use it ONLY for genuine emergencies; refill it after every withdrawal; keep it in a different bank from your daily account so you are not tempted. Once funded, forget it and invest the rest.',
    ],
    key_points: [
      '6 months of expenses as target',
      'Keep it liquid - savings/liquid fund',
      'Never invest emergency money in equity',
      'Refill after every withdrawal',
      'Separate bank, away from daily account',
    ],
    examples: [
      'When Deepak lost his job, his 7-month emergency fund covered 6 months of expenses while he found a new role - no debt, no stress.',
      'Without an emergency fund, Anita used a credit card for a sudden surgery and paid 36% interest for 2 years.',
    ],
    quiz: [
      {
        question: 'Where should you NEVER keep your emergency fund?',
        options: ['A) Savings account', 'B) Liquid fund', 'C) Equity mutual funds', 'D) Recurring deposit'],
        correct: 'C',
      },
    ],
    schemes: [],
  },
  'retirement planning': {
    title: 'Retirement Planning',
    content: [
      'Retirement planning answers one question: how much money will replace your salary after 60? A simple formula: you need a corpus of about 25 times your annual expenses at retirement, invested to generate income.',
      'The classic Indian toolkit: EPF (if salaried), PPF (tax-free 7.1%), NPS (extra deduction + pension), senior citizen savings scheme (after 60), and equity mutual funds for growth during working years.',
      'Start early - a 25-year-old saving ₹5,000/month at 10% accumulates ₹1.9 crore by 60. Starting at 35, the same plan yields only ₹66 lakh. Every year of delay roughly doubles the required monthly saving.',
      'Aim to replace 60-70% of pre-retirement income. Include inflation: what costs ₹30,000/month today will cost about ₹1.1 lakh/month in 25 years at 5.5% inflation. Review your plan every 5 years and with every major life event.',
    ],
    key_points: [
      'Corpus ≈ 25x annual expenses',
      'Start at 25, not 35 - compounding',
      'EPF + PPF + NPS + equity combo',
      'Include inflation in your target',
      'Senior Citizens Scheme after 60',
    ],
    examples: [
      '₹10,000/month at 11% for 30 years = ₹2.4 crore corpus - more than 90% comes from compounding.',
      'A 55-year-old switches equity to PPF and Senior Citizens Savings Scheme for stable 7-8.2% income.',
    ],
    quiz: [
      {
        question: 'A good retirement corpus is about ___ times your annual expenses.',
        options: ['A) 5x', 'B) 10x', 'C) 25x', 'D) 100x'],
        correct: 'C',
      },
    ],
    schemes: ['apy', 'nps'],
  },
  'stock market': {
    title: 'Stock Market Basics',
    content: [
      'The stock market lets you buy small parts of companies (shares). When the company grows, your shares become worth more; some companies also pay dividends. NSE and BSE are India\'s two exchanges, with NIFTY 50 and SENSEX as their benchmark indices.',
      'Start the RIGHT way: do not pick "hot tips" - buy the whole market through index funds (NIFTY 50/SENSEX) or a diversified mutual fund SIP. Historical returns of Indian equity are around 12% over long periods, with big ups and downs in between.',
      'Rules for beginners: invest only money you will not need for 5+ years; diversify across 10-20 stocks at most if buying directly; never borrow to invest; avoid options and futures; ignore WhatsApp tips and "double money" schemes - they are scams.',
      'Open a demat account with a registered broker (Zerodha, Groww, Upstox etc.). KYC with PAN, Aadhaar and bank account takes a few days. Start with a small amount and add monthly via SIP or systematic investing.',
    ],
    key_points: [
      'Equity returns ~12% over long term',
      'Index funds beat most stock pickers',
      '5+ year horizon for equity money',
      'Never trade with borrowed money',
      'Ignore tips - avoid scams',
    ],
    examples: [
      '₹10,000 invested in NIFTY 50 in 2015 grew to ~₹32,000 by 2025 despite crashes in between.',
      'A "triple your money in 3 months" scheme wiped out an investor - SEBI-registered products never promise this.',
    ],
    quiz: [
      {
        question: 'The safest beginner approach to equity is:',
        options: ['A) Hot stock tips', 'B) Index funds / mutual fund SIP', 'C) Options trading', 'D) Penny stocks'],
        correct: 'B',
      },
    ],
    schemes: [],
  },
  'gold investment': {
    title: 'Gold Investment',
    content: [
      'Gold is a part of every Indian family\'s wealth - but HOW you buy it matters. Physical gold (jewellery, coins) has making charges of 10-25% and storage/purity risks. Digital options are cleaner: Sovereign Gold Bonds (SGB), Gold ETFs, and Gold Mutual Funds.',
      'Sovereign Gold Bonds are the best: you buy digital gold with 2.5% guaranteed extra interest per year, tax-free maturity (exempt from capital gains), and no making charges. SGBs are issued by RBI in tranches and listed on exchanges.',
      'Gold ETFs and gold funds track gold prices with expense ratios under 1% and can be bought anytime in any amount. They are taxed as capital gains, unlike SGBs.',
      'Rule of thumb: keep gold at 5-10% of your portfolio. It protects against inflation and currency weakness but does not pay income - so do not over-invest. Avoid jewellery as "investment" - it is consumption with an exit cost.',
    ],
    key_points: [
      'SGB: 2.5% extra interest, tax-free maturity',
      'Gold ETFs: low cost, any amount',
      'Jewellery has 10-25% making charges',
      'Keep gold at 5-10% of portfolio',
      'Digital gold beats physical for investing',
    ],
    examples: [
      'A ₹50,000 SGB bought at issue earns 2.5% interest + gold price gains, maturing tax-free after 8 years.',
      'Buying a ₹1 lakh gold chain with 15% making charge means you start with ₹85,000 of gold - you lose 15% immediately.',
    ],
    quiz: [
      {
        question: 'Which gold investment gives extra 2.5% interest?',
        options: ['A) Jewellery', 'B) Gold ETF', 'C) Sovereign Gold Bond', 'D) Gold coin'],
        correct: 'C',
      },
    ],
    schemes: [],
  },
  'real estate': {
    title: 'Real Estate & Property',
    content: [
      'A home is a need, not just an investment. For most families, the right sequence is: emergency fund → insurance → retirement savings → then property. Buying a house with a loan is fine, but the EMI should stay under 30-40% of monthly income.',
      'Home loan tax benefits: under the old regime, interest deduction up to ₹2 lakh/year (80EEA for first-time buyers adds ₹1.5 lakh), and principal repayment counts in 80C. Under the new regime, these deductions are not available - another reason to compare regimes.',
      'Before buying: check RERA registration of the project (mandatory in most states), builder track record, title clearances, and the area\'s long-term development plans. For resale, verify the encumbrance certificate and all original documents.',
      'Liquidity warning: property cannot be sold quickly - expect 6-18 months. Prices may stagnate for years. If your goal is financial growth, equities and REITs historically beat real estate with far better liquidity. Buy a home to LIVE in, invest in financial assets for growth.',
    ],
    key_points: [
      'Home = need; invest for growth elsewhere',
      'EMI under 30-40% of income',
      'Check RERA, builder, title documents',
      'Old regime: ₹2L interest + 80C principal',
      'Property is illiquid - 6-18 months to sell',
    ],
    examples: [
      'Paying ₹8 lakh/year in home loan interest saves ₹2.4 lakh tax (30% slab) under the old regime.',
      'Two identical ₹50 lakh flats: one sold in 12 months, the other held 10 years flat - liquidity matters.',
    ],
    quiz: [
      {
        question: 'The maximum annual home loan interest deduction (old regime) is:',
        options: ['A) ₹1 lakh', 'B) ₹1.5 lakh', 'C) ₹2 lakh', 'D) ₹3 lakh'],
        correct: 'C',
      },
    ],
    schemes: ['pmay'],
  },
  investing: {
    title: 'Investment Fundamentals',
    content: [
      'Investing means putting money to work so it grows over time - beating inflation (currently 5-6% in India). Savings keep money safe; investing grows it. The rule of 72: divide 72 by your return to see how fast your money doubles (72/12 = 6 years at 12%).',
      'The three pillars: SAFETY (PPF, FD), GROWTH (equity funds, stocks) and INFLATION PROTECTION (equity, gold, real estate). A sensible Indian portfolio: 50% equity, 30% debt, 10% gold, 10% cash - adjusted for age and risk appetite.',
      'Compounding is the eighth wonder: ₹10,000/month at 12% for 30 years = ₹3.5 crore, of which only ₹36 lakh was invested. The longer you stay, the more exponential the growth.',
      'Begin with a "goals-first" approach: emergency fund → insurance → short-term goals (FD/RD) → long-term goals (SIP equity) → retirement (PPF/NPS). Never invest in products you do not understand; if it sounds too good to be true, it is.',
    ],
    key_points: [
      'Investing beats inflation; saving only preserves',
      'Balance safety, growth and protection',
      'Compounding needs time - start early',
      'Goals-first: emergency → insurance → invest',
      'Understand before you invest',
    ],
    examples: [
      '₹5,000/month at 8% for 20 years = ₹29.6 lakh; at 12% = ₹49.5 lakh. A 4% difference nearly doubles the outcome.',
      'Following the "chai-cup" habit: ₹25/day (₹750/month) at 12% for 30 years = ₹26 lakh. Small amounts, big futures.',
    ],
    quiz: [
      {
        question: 'Rule of 72: at 12% returns, money doubles in roughly:',
        options: ['A) 3 years', 'B) 6 years', 'C) 9 years', 'D) 12 years'],
        correct: 'B',
      },
    ],
    schemes: [],
  },
  taxes: {
    title: 'Tax Planning',
    content: [
      'Smart tax planning legally reduces your tax bill and increases savings. Indian taxpayers must file ITR even with zero tax if income crosses ₹2.5 lakh (₹3 lakh under new regime) - filing is mandatory above ₹2.5 lakh for most.',
      'Use Section 80C fully: invest ₹1.5 lakh in PPF, ELSS, EPF, life insurance premium or 5-year tax-saving FD. This saves up to ₹46,800 in tax at the 30% slab (plus 4% cess).',
      'Additional deductions: ₹50,000 in NPS (80CCD-1B), health insurance premium up to ₹25,000 for self + ₹25,000 for parents (80D), ₹2,400/year for preventive health checkups.',
      'Compare old vs new regime every year: the new regime (FY 2024-25) offers lower rates and a ₹75,000 standard deduction but removes most deductions. Use the calculator - the right choice differs by income and deductions. File your ITR on time to avoid ₹1,000-₹10,000 penalties.',
    ],
    key_points: [
      'Fill 80C fully: PPF, ELSS, EPF, insurance',
      'NPS adds ₹50,000 more (80CCD-1B)',
      'Health premium: 80D up to ₹50,000',
      'Compare old vs new regime yearly',
      'File ITR before the deadline',
    ],
    examples: [
      'A person earning ₹12 lakh with full 80C + ₹50k NPS + ₹25k insurance saves about ₹62,000 in tax under the old regime.',
      'Using the new regime with no deductions at ₹12 lakh income - the calculator shows new regime wins. Regime choice is personal.',
    ],
    quiz: [
      {
        question: 'The maximum combined 80C + 80CCD(1B) deduction is:',
        options: ['A) ₹1.5 lakh', 'B) ₹2 lakh', 'C) ₹2.5 lakh', 'D) ₹3 lakh'],
        correct: 'B',
      },
    ],
    schemes: [],
  },
  'emergency-fund': {
    title: 'Emergency Fund',
    content: [
      'An emergency fund is cash kept aside for job loss, medical needs, home repairs or unexpected expenses. It is the difference between a crisis and a disaster. Build it BEFORE any other investment.',
      'Target: 6 months of essential expenses. If your family spends ₹25,000/month, keep ₹1.5 lakh ready. Start small - even ₹50,000 or 2 months of expenses - then top it up monthly.',
      'Where to keep it: a separate savings account (instant access) or a liquid mutual fund (slightly higher returns, 1-2 day withdrawal). Never put emergency money in equity - it can be down exactly when you need it.',
      'Rules: use it ONLY for genuine emergencies; refill it after every withdrawal; keep it in a different bank from your daily account so you are not tempted. Once funded, forget it and invest the rest.',
    ],
    key_points: [
      '6 months of expenses as target',
      'Keep it liquid - savings/liquid fund',
      'Never invest emergency money in equity',
      'Refill after every withdrawal',
      'Separate bank, away from daily account',
    ],
    examples: [
      'When Deepak lost his job, his 7-month emergency fund covered 6 months of expenses while he found a new role - no debt, no stress.',
      'Without an emergency fund, Anita used a credit card for a sudden surgery and paid 36% interest for 2 years.',
    ],
    quiz: [
      {
        question: 'Where should you NEVER keep your emergency fund?',
        options: ['A) Savings account', 'B) Liquid fund', 'C) Equity mutual funds', 'D) Recurring deposit'],
        correct: 'C',
      },
    ],
    schemes: [],
  },
}

const ARTICLE_SOURCES: Array<[string, string]> = [
  ['MoneyControl', 'https://www.moneycontrol.com/news/business/personal-finance/'],
  ['Economic Times', 'https://economictimes.indiatimes.com/wealth/invest'],
  ['Business Standard', 'https://www.business-standard.com/markets'],
  ['Mint', 'https://www.livemint.com/money'],
]

function normalizeTopic(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

function buildGenericLesson(topic: string): TopicDefinition {
  return {
    title: topic.charAt(0).toUpperCase() + topic.slice(1),
    content: [
      `This comprehensive lesson covers everything you need to know about ${topic} in the Indian context. You will learn the fundamental concepts, practical implementation strategies, and real-world examples from Indian markets.`,
      `## Getting Started
Understanding ${topic} is crucial for your financial well-being. Begin with the basics, then move to practical steps you can implement with any income level. The key is to start small, stay consistent, and review your progress regularly.`,
      `## Key Principles
1. Start with a clear goal and realistic timeline.
2. Keep your approach simple - avoid products you do not understand.
3. Review your progress every quarter and adjust as your life changes.
4. Use government schemes and benefits available to you as an Indian citizen.`,
    ],
    key_points: [
      `Master the fundamentals of ${topic}`,
      'Apply concepts in real-world scenarios',
      'Avoid common mistakes and pitfalls',
      'Leverage government schemes and benefits',
      'Create an action plan for implementation',
    ],
    examples: [
      `Practical ${topic} example for Indian families`,
      'Step-by-step implementation guide',
      'Real success stories and case studies',
    ],
    quiz: [
      {
        question: `What is the most important first step in ${topic}?`,
        options: ['A) High returns', 'B) Understanding basics', 'C) Quick profits', 'D) Following trends'],
        correct: 'B',
      },
    ],
    schemes: ['pmjdy'],
  }
}

export async function GET(request: NextRequest, { params }: { params: { topic: string } }) {
  const rawTopic = params?.topic || 'budgeting'
  const language = request.nextUrl.searchParams.get('language') || 'english'

  const normalized = normalizeTopic(rawTopic)
  const definition = TOPIC_CONTENT[normalized] || buildGenericLesson(rawTopic)

  const videos = VIDEO_POOL.slice(0, 3).map((video) => ({
    ...video,
    title: `${definition.title}: ${video.title}`,
  }))

  const articles = buildArticles(definition.title, ARTICLE_SOURCES.slice(0, 2))
  const government_schemes = definition.schemes.map((key) => SCHEMES[key]).filter(Boolean)

  const lesson = {
    topic: definition.title,
    language,
    content: definition.content.join('\n\n'),
    key_points: definition.key_points,
    examples: definition.examples,
    quiz_questions: definition.quiz,
    videos,
    articles,
    government_schemes,
  }

  return NextResponse.json({
    topic: definition.title,
    language,
    lesson,
    market_insights: {
      relevance: `This topic is currently relevant for Indian financial planning in ${new Date().getFullYear()}.`,
    },
  })
}