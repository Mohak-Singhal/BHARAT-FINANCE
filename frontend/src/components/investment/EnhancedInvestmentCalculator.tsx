import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Target,
  PieChart,
  BarChart3,
  ArrowUpRight,
  Zap,
  Shield,
  Award,
  RefreshCw
} from 'lucide-react';

interface InvestmentResult {
  investment_type: string;
  monthly_amount: number;
  annual_return_rate: number;
  investment_period_years: number;
  total_invested: number;
  maturity_amount: number;
  total_returns: number;
  inflation_adjusted_value: number;
  monthly_breakdown: Array<{
    month: number;
    invested_amount: number;
    current_value: number;
    returns: number;
  }>;
}

interface MutualFund {
  schemeName: string;
  schemeCode: string;
  category: string;
  returns_1y?: string;
  returns_3y?: string;
  returns_5y?: string;
  expense_ratio?: string;
  rating?: number;
  fund_house?: string;
}

const EnhancedInvestmentCalculator: React.FC = () => {
  const [investmentType, setInvestmentType] = useState('sip');
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [age, setAge] = useState(30);
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [topFunds, setTopFunds] = useState<MutualFund[]>([]);
  const [selectedFund, setSelectedFund] = useState<string>('');

  const investmentTypes = [
    { 
      id: 'sip', 
      name: 'SIP (Mutual Funds)', 
      description: 'Systematic Investment Plan',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-blue-500',
      expectedReturn: '10-15%',
      risk: 'Market-linked'
    },
    { 
      id: 'ppf', 
      name: 'PPF', 
      description: 'Public Provident Fund',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-green-500',
      expectedReturn: '7-8%',
      risk: 'Very Low'
    },
    { 
      id: 'nps', 
      name: 'NPS', 
      description: 'National Pension System',
      icon: <Award className="w-5 h-5" />,
      color: 'bg-purple-500',
      expectedReturn: '8-12%',
      risk: 'Moderate'
    },
    { 
      id: 'fd', 
      name: 'Fixed Deposit', 
      description: 'Bank Fixed Deposit',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-orange-500',
      expectedReturn: '5-7%',
      risk: 'Very Low'
    }
  ];

  useEffect(() => {
    fetchTopFunds();
  }, []);

  useEffect(() => {
    if (monthlyAmount > 0 && years > 0) {
      calculateInvestment();
    }
  }, [investmentType, monthlyAmount, annualReturn, years, age]);

  const fetchTopFunds = async () => {
    try {
      const response = await fetch('http://localhost:8001/simulate/mutual-funds/top-performers/equity');
      const data = await response.json();
      setTopFunds(data.top_performers || []);
    } catch (error) {
      console.error('Error fetching top funds:', error);
    }
  };

  const calculateInvestment = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/simulate/investment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investment_type: investmentType,
          monthly_amount: monthlyAmount,
          annual_return_rate: annualReturn,
          investment_period_years: years,
          age: age,
          inflation_rate: 6
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Investment calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const getReturnColor = (returns: number) => {
    if (returns >= 15) return 'text-green-600';
    if (returns >= 10) return 'text-blue-600';
    if (returns >= 5) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional <span className="text-gradient">Investment Calculator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate returns for SIP, PPF, NPS, and more with real mutual fund recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Type Selection */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Investment Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investmentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setInvestmentType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      investmentType === type.id
                        ? 'border-primary-500 bg-primary-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-primary-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${type.color} text-white`}>
                        {type.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-semibold text-success-600">{type.expectedReturn}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className="font-semibold">{type.risk}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Parameters */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Investment (₹)
                  </label>
                  <input
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    className="pro-input"
                    placeholder="5,000"
                  />
                  <div className="mt-2 flex space-x-2">
                    {[1000, 2500, 5000, 10000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setMonthlyAmount(amount)}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-primary-100 rounded-lg transition-colors"
                      >
                        ₹{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Annual Return (%)
                  </label>
                  <input
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="pro-input"
                    step="0.5"
                    min="1"
                    max="30"
                  />
                  <div className="mt-2 flex space-x-2">
                    {[8, 10, 12, 15].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setAnnualReturn(rate)}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-primary-100 rounded-lg transition-colors"
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Period (Years)
                  </label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="pro-input"
                    min="1"
                    max="50"
                  />
                  <div className="mt-2 flex space-x-2">
                    {[5, 10, 15, 20].map((period) => (
                      <button
                        key={period}
                        onClick={() => setYears(period)}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-primary-100 rounded-lg transition-colors"
                      >
                        {period}Y
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="pro-input"
                    min="18"
                    max="80"
                  />
                </div>
              </div>

              <button
                onClick={calculateInvestment}
                disabled={loading}
                className="w-full btn-gradient mt-6 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    <span>Calculate Returns</span>
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="pro-card border-gradient">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Investment Results</h3>
                    <p className="text-gray-600">Your wealth projection over {years} years</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Invested</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(result.total_invested)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Maturity Amount</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.maturity_amount)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Returns</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(result.total_returns)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Investment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Investment:</span>
                        <span className="font-semibold">₹{result.monthly_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Investment Period:</span>
                        <span className="font-semibold">{result.investment_period_years} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Return:</span>
                        <span className={`font-semibold ${getReturnColor(result.annual_return_rate)}`}>
                          {result.annual_return_rate}% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wealth Multiple:</span>
                        <span className="font-semibold text-success-600">
                          {(result.maturity_amount / result.total_invested).toFixed(2)}x
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Inflation Impact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inflation Rate:</span>
                        <span className="font-semibold">6% p.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Real Returns:</span>
                        <span className="font-semibold text-blue-600">
                          {(result.annual_return_rate - 6).toFixed(1)}% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Today's Value:</span>
                        <span className="font-semibold">
                          {formatCurrency(result.inflation_adjusted_value)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchasing Power:</span>
                        <span className="font-semibold text-success-600">
                          {((result.inflation_adjusted_value / result.total_invested) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Mutual Funds */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Performing Funds</h3>
              <div className="space-y-3">
                {topFunds.slice(0, 3).map((fund, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      {fund.schemeName}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{fund.fund_house}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">1Y Return:</span>
                      <span className="text-sm font-bold text-success-600">{fund.returns_1y}</span>
                    </div>
                    {fund.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-600 mr-2">Rating:</span>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(fund.rating!) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All Funds →
              </button>
            </div>

            {/* Quick Tips */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Start Early</h4>
                    <p className="text-xs text-gray-600">Time is your biggest ally in wealth creation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Stay Consistent</h4>
                    <p className="text-xs text-gray-600">Regular investments beat timing the market</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <PieChart className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Diversify</h4>
                    <p className="text-xs text-gray-600">Spread risk across different asset classes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowUpRight className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Increase Gradually</h4>
                    <p className="text-xs text-gray-600">Step up SIP amount with salary hikes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal-based Planning */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Goal Planning</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 text-sm">Emergency Fund</h4>
                  <p className="text-xs text-blue-600 mb-2">6 months expenses</p>
                  <div className="text-sm font-bold text-blue-800">₹3,00,000</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 text-sm">Home Down Payment</h4>
                  <p className="text-xs text-green-600 mb-2">20% of property value</p>
                  <div className="text-sm font-bold text-green-800">₹20,00,000</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 text-sm">Retirement Corpus</h4>
                  <p className="text-xs text-purple-600 mb-2">25x annual expenses</p>
                  <div className="text-sm font-bold text-purple-800">₹2,50,00,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedInvestmentCalculator;