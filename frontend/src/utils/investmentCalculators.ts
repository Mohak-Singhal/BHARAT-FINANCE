/**
 * Investment Calculator Utilities
 * Provides accurate financial calculations for various investment types
 */

export interface MonthlyBreakdown {
    month: number;
    invested_amount: number;
    current_value: number;
    returns: number;
}

export interface InvestmentResult {
    investment_type: string;
    monthly_amount: number;
    annual_return_rate: number;
    investment_period_years: number;
    total_invested: number;
    maturity_amount: number;
    total_returns: number;
    inflation_adjusted_value: number;
    monthly_breakdown: MonthlyBreakdown[];
}

interface CalculationParams {
    monthlyAmount: number;
    annualReturn: number;
    years: number;
    inflationRate?: number;
}

/**
 * Calculate SIP (Systematic Investment Plan) returns
 * Uses compound interest formula with monthly contributions
 */
export function calculateSIP(params: CalculationParams): InvestmentResult {
    const { monthlyAmount, annualReturn, years, inflationRate = 6 } = params;

    const monthlyRate = annualReturn / 12 / 100;
    const totalMonths = years * 12;
    const totalInvested = monthlyAmount * totalMonths;

    // Future Value of SIP: FV = P × [(1 + r)^n - 1] / r × (1 + r)
    const maturityAmount = monthlyAmount *
        (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));

    const totalReturns = maturityAmount - totalInvested;

    // Calculate inflation-adjusted value
    const inflationAdjustedValue = maturityAmount / Math.pow(1 + inflationRate / 100, years);

    // Generate monthly breakdown
    const monthlyBreakdown: MonthlyBreakdown[] = [];
    for (let month = 1; month <= totalMonths; month++) {
        const investedAmount = monthlyAmount * month;
        const currentValue = monthlyAmount *
            (((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate));
        const returns = currentValue - investedAmount;

        monthlyBreakdown.push({
            month,
            invested_amount: investedAmount,
            current_value: currentValue,
            returns
        });
    }

    return {
        investment_type: 'SIP',
        monthly_amount: monthlyAmount,
        annual_return_rate: annualReturn,
        investment_period_years: years,
        total_invested: totalInvested,
        maturity_amount: maturityAmount,
        total_returns: totalReturns,
        inflation_adjusted_value: inflationAdjustedValue,
        monthly_breakdown: monthlyBreakdown
    };
}

/**
 * Calculate PPF (Public Provident Fund) returns
 * Government savings scheme with annual compounding
 */
export function calculatePPF(params: CalculationParams): InvestmentResult {
    const { monthlyAmount, annualReturn, years, inflationRate = 6 } = params;

    const annualInvestment = monthlyAmount * 12;
    const totalInvested = annualInvestment * years;

    // PPF compounds annually
    let maturityAmount = 0;
    const rate = annualReturn / 100;

    // Each year's contribution grows for remaining years
    for (let year = 1; year <= years; year++) {
        const remainingYears = years - year + 1;
        maturityAmount += annualInvestment * Math.pow(1 + rate, remainingYears);
    }

    const totalReturns = maturityAmount - totalInvested;
    const inflationAdjustedValue = maturityAmount / Math.pow(1 + inflationRate / 100, years);

    // Generate monthly breakdown (showing annual contributions)
    const monthlyBreakdown: MonthlyBreakdown[] = [];
    let cumulativeInvested = 0;
    let cumulativeValue = 0;

    for (let month = 1; month <= years * 12; month++) {
        cumulativeInvested += monthlyAmount;

        // Calculate value at this point
        const yearsPassed = month / 12;
        let tempValue = 0;

        for (let y = 1; y <= Math.floor(yearsPassed); y++) {
            const yearsGrown = yearsPassed - y;
            tempValue += annualInvestment * Math.pow(1 + rate, yearsGrown);
        }

        // Add partial year contribution
        const partialYearMonths = month % 12;
        if (partialYearMonths > 0) {
            tempValue += (monthlyAmount * partialYearMonths);
        }

        cumulativeValue = tempValue;

        monthlyBreakdown.push({
            month,
            invested_amount: cumulativeInvested,
            current_value: cumulativeValue,
            returns: cumulativeValue - cumulativeInvested
        });
    }

    return {
        investment_type: 'PPF',
        monthly_amount: monthlyAmount,
        annual_return_rate: annualReturn,
        investment_period_years: years,
        total_invested: totalInvested,
        maturity_amount: maturityAmount,
        total_returns: totalReturns,
        inflation_adjusted_value: inflationAdjustedValue,
        monthly_breakdown: monthlyBreakdown
    };
}

/**
 * Calculate NPS (National Pension System) returns
 * Market-linked retirement savings scheme
 */
export function calculateNPS(params: CalculationParams): InvestmentResult {
    const { monthlyAmount, annualReturn, years, inflationRate = 6 } = params;

    // NPS works similar to SIP with monthly compounding
    const monthlyRate = annualReturn / 12 / 100;
    const totalMonths = years * 12;
    const totalInvested = monthlyAmount * totalMonths;

    // Future Value calculation
    const maturityAmount = monthlyAmount *
        (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));

    const totalReturns = maturityAmount - totalInvested;
    const inflationAdjustedValue = maturityAmount / Math.pow(1 + inflationRate / 100, years);

    // Generate monthly breakdown
    const monthlyBreakdown: MonthlyBreakdown[] = [];
    for (let month = 1; month <= totalMonths; month++) {
        const investedAmount = monthlyAmount * month;
        const currentValue = monthlyAmount *
            (((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate));
        const returns = currentValue - investedAmount;

        monthlyBreakdown.push({
            month,
            invested_amount: investedAmount,
            current_value: currentValue,
            returns
        });
    }

    return {
        investment_type: 'NPS',
        monthly_amount: monthlyAmount,
        annual_return_rate: annualReturn,
        investment_period_years: years,
        total_invested: totalInvested,
        maturity_amount: maturityAmount,
        total_returns: totalReturns,
        inflation_adjusted_value: inflationAdjustedValue,
        monthly_breakdown: monthlyBreakdown
    };
}

/**
 * Calculate Fixed Deposit returns
 * Bank FD with guaranteed returns and quarterly compounding
 */
export function calculateFD(params: CalculationParams): InvestmentResult {
    const { monthlyAmount, annualReturn, years, inflationRate = 6 } = params;

    // For FD, we'll calculate with quarterly compounding
    const quarterlyRate = annualReturn / 4 / 100;
    const totalQuarters = years * 4;
    const totalMonths = years * 12;
    const totalInvested = monthlyAmount * totalMonths;

    // Calculate FD with quarterly compounding
    // Converting monthly contributions to quarterly
    const quarterlyAmount = monthlyAmount * 3;

    // Future Value with quarterly compounding
    const maturityAmount = quarterlyAmount *
        (((Math.pow(1 + quarterlyRate, totalQuarters) - 1) / quarterlyRate) * (1 + quarterlyRate));

    const totalReturns = maturityAmount - totalInvested;
    const inflationAdjustedValue = maturityAmount / Math.pow(1 + inflationRate / 100, years);

    // Generate monthly breakdown
    const monthlyBreakdown: MonthlyBreakdown[] = [];
    for (let month = 1; month <= totalMonths; month++) {
        const investedAmount = monthlyAmount * month;
        const quarter = Math.floor(month / 3) + 1;
        const quarterlyInvested = quarterlyAmount * Math.floor(month / 3);

        let currentValue = 0;
        if (quarter > 0) {
            currentValue = quarterlyAmount *
                (((Math.pow(1 + quarterlyRate, Math.floor(month / 3)) - 1) / quarterlyRate) * (1 + quarterlyRate));
        }

        // Add partial quarter amount
        const monthsInCurrentQuarter = month % 3;
        if (monthsInCurrentQuarter > 0) {
            currentValue += monthlyAmount * monthsInCurrentQuarter;
        }

        const returns = currentValue - investedAmount;

        monthlyBreakdown.push({
            month,
            invested_amount: investedAmount,
            current_value: currentValue,
            returns
        });
    }

    return {
        investment_type: 'FD',
        monthly_amount: monthlyAmount,
        annual_return_rate: annualReturn,
        investment_period_years: years,
        total_invested: totalInvested,
        maturity_amount: maturityAmount,
        total_returns: totalReturns,
        inflation_adjusted_value: inflationAdjustedValue,
        monthly_breakdown: monthlyBreakdown
    };
}

/**
 * Main calculator function that routes to the appropriate calculator
 */
export function calculateInvestment(
    investmentType: string,
    params: CalculationParams
): InvestmentResult {
    switch (investmentType.toLowerCase()) {
        case 'sip':
            return calculateSIP(params);
        case 'ppf':
            return calculatePPF(params);
        case 'nps':
            return calculateNPS(params);
        case 'fd':
            return calculateFD(params);
        default:
            return calculateSIP(params); // Default to SIP
    }
}

/**
 * Calculate goal-based planning suggestions
 */
export interface GoalSuggestion {
    name: string;
    description: string;
    targetAmount: number;
    monthlyRequired: number;
    yearsToAchieve: number;
    color: string;
}

export function calculateGoalSuggestions(
    currentAge: number,
    monthlyIncome: number = 50000
): GoalSuggestion[] {
    const emergencyFund = monthlyIncome * 6;
    const homeDownPayment = 2000000; // 20L average
    const retirementAge = 60;
    const yearsToRetirement = Math.max(retirementAge - currentAge, 5);
    const retirementCorpus = monthlyIncome * 12 * 25; // 25x annual expenses

    return [
        {
            name: 'Emergency Fund',
            description: '6 months expenses',
            targetAmount: emergencyFund,
            monthlyRequired: emergencyFund / (1 * 12), // 1 year to build
            yearsToAchieve: 1,
            color: 'blue'
        },
        {
            name: 'Home Down Payment',
            description: '20% of property value',
            targetAmount: homeDownPayment,
            monthlyRequired: homeDownPayment / (5 * 12), // 5 years
            yearsToAchieve: 5,
            color: 'green'
        },
        {
            name: 'Retirement Corpus',
            description: '25x annual expenses',
            targetAmount: retirementCorpus,
            monthlyRequired: retirementCorpus / (yearsToRetirement * 12),
            yearsToAchieve: yearsToRetirement,
            color: 'purple'
        }
    ];
}
