// Deterministic offline guidance used by chat routes whenever the AI service is unavailable.

export function offlineGuidance(message: string): string {
  const lower = message.toLowerCase()
  if (/(budget|expense|spend|expenditure)/.test(lower)) {
    return 'A simple budget can transform your finances. Start with the 50-30-20 rule: 50% of income for needs (rent, food, utilities, transport), 30% for wants, and at least 20% for savings. Track every expense for one month, then set limits per category. Automate your savings by moving 20% to a separate account on salary day. Review your budget every month and adjust for festivals and seasonal expenses.'
  }
  if (/(emergency)/.test(lower)) {
    return 'Build an emergency fund of 6 months of essential expenses before investing anywhere else. If your family spends 25,000 rupees a month, keep 1.5 lakh rupees ready in a separate savings account or liquid fund. Never put emergency money in equity - it can fall exactly when you need it. Refill the fund after every withdrawal.'
  }
  if (/(insurance|health insurance|life insurance|term)/.test(lower)) {
    return 'Insurance comes before investment. Every family should have at least 5 lakh rupees of health cover, and working adults need a term life plan of 10-15 times their annual income. Term plans are cheap: a 30-year-old can get 1 crore cover for about 12,000 rupees a year. Also consider PMJJBY at 436 rupees a year and PMSBY at 20 rupees a year for basic government-backed cover.'
  }
  if (/(sip|mutual fund|invest|investing)/.test(lower)) {
    return 'Start investing with a monthly SIP of even 1,000 rupees in a diversified equity mutual fund. For tax savings, use ELSS (3-year lock-in) or PPF (tax-free 7.1%). Build an emergency fund first, then invest for goals 5 or more years away. Never chase hot tips or guaranteed returns - anything above 12% a year is usually risky or a scam.'
  }
  if (/(tax|itr|80c|80d|deduction|regime)/.test(lower)) {
    return 'Maximize your deductions: 1.5 lakh rupees under Section 80C via PPF, ELSS, EPF or tax-saving FD. An extra 50,000 rupees in NPS under 80CCD-1B. Health insurance premiums up to 25,000 rupees for yourself and 25,000 for parents under 80D. Compare the old and new regimes every year and file your ITR before the deadline.'
  }
  if (/(loan|emi|debt|credit card)/.test(lower)) {
    return 'Pay off high-interest debt first - credit cards charge 36-48% a year. Use the avalanche method: clear the highest interest loan first while paying minimums on the rest. Keep your housing EMI under 30-40% of income. Only borrow for assets that grow in value, not for lifestyle. Once debt is cleared, redirect those payments to savings and investments.'
  }
  if (/(retire|retirement|pension|nps|ppf)/.test(lower)) {
    return 'For retirement, aim for a corpus of about 25 times your annual expenses. Use a mix of EPF, PPF (tax-free 7.1%), NPS (extra 50,000 rupee deduction) and equity mutual funds. Start early - a 25-year-old saving 5,000 rupees a month at 10% builds 1.9 crore by 60. Include inflation in your target and review your plan every 5 years.'
  }
  if (/(gold|sovereign gold)/.test(lower)) {
    return 'Prefer Sovereign Gold Bonds over jewellery for investing - they pay 2.5% extra interest per year, are tax-free at maturity, and have no making charges. Keep gold at 5-10% of your portfolio. Jewellery has 10-25% making charges, so it is better as consumption than investment.'
  }
  if (/(house|home|property|real estate)/.test(lower)) {
    return 'Buy a home to live in, but invest in financial assets for growth. Keep your EMI under 30-40% of income. Under the old tax regime, claim up to 2 lakh rupees home loan interest plus principal under 80C. Check RERA registration, builder track record and title documents before buying. Property is illiquid - expect 6-18 months to sell.'
  }
  if (/(saving|save|fd|rd)/.test(lower)) {
    return 'For safe short-term savings use Fixed Deposits (6-7%), Recurring Deposits, or Post Office schemes. For long-term tax-free growth use PPF at 7.1% and Sukanya Samriddhi at 8.2% for a girl child. Always build 6 months of emergency fund first, then save for specific goals in separate accounts.'
  }
  return 'Here is practical guidance from your finance coach: first build an emergency fund of 6 months of expenses, then buy health and term insurance, and only then invest in equity mutual funds via SIP for goals 5+ years away. Keep debt under control, maximise tax-saving options like PPF and ELSS, and review your plan every 3 months. For a detailed answer on this topic, please ask again when the AI service is available.'
}