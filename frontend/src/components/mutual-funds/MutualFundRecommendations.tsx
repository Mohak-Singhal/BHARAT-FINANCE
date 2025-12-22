import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Star, 
  Shield, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';

interface MutualFund {
  schemeName: string;
  schemeCode: string;
  category: string;
  returns_1y?: string;
  returns_3y?: string;
  returns_5y?: string;
  expense_ratio?: string;
  aum?: string;
  rating?: number;
  fund_house?: string;
  nav?: string;
  date?: string;
  risk_level?: string;
  min_investment?: string;
}

interface FundCategory {
  category: string;
  name: string;
  description: string;
  risk: string;
  expected_returns: string;
  investment_horizon: string;
  tax_benefit?: string;
}

const MutualFundRecommendations: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('equity');
  const [recommendations, setRecommendations] = useState<MutualFund[]>([]);
  const [categories, setCategories] = useState<FundCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  useEffect(() => {
    fetchCategories();
    fetchRecommendations(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8001/simulate/mutual-funds/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRecommendations = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8001/simulate/mutual-funds/top-performers/${category}`);
      const data = await response.json();
      setRecommendations(data.top_performers || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback data
      setRecommendations([
        {
          schemeName: "SBI Blue Chip Fund - Direct Plan - Growth",
          schemeCode: "120503",
          category: "Large Cap",
          returns_1y: "15.2%",
          returns_3y: "18.5%",
          returns_5y: "16.8%",
          expense_ratio: "0.63%",
          aum: "₹25,000 Cr",
          rating: 4.5,
          fund_house: "SBI Mutual Fund",
          risk_level: "Moderate",
          min_investment: "₹500"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'text-success-600 bg-success-50';
      case 'moderate':
        return 'text-warning-600 bg-warning-50';
      case 'high':
        return 'text-error-600 bg-error-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredRecommendations = recommendations.filter(fund => {
    const matchesSearch = fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.fund_house?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || fund.risk_level?.toLowerCase() === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional <span className="text-gradient">Mutual Fund</span> Recommendations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover top-performing mutual funds with AI-powered analysis and real-time market data
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Investment Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedCategory === cat.category
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-primary-200 hover:shadow-md'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{cat.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(cat.risk)}`}>
                    {cat.risk} Risk
                  </span>
                  <span className="text-xs font-semibold text-success-600">
                    {cat.expected_returns}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search funds or AMC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pro-input pl-10"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="pro-select"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>

        {/* Recommendations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="pro-card">
                <div className="skeleton h-6 w-3/4 mb-4"></div>
                <div className="skeleton h-4 w-1/2 mb-4"></div>
                <div className="skeleton h-20 w-full mb-4"></div>
                <div className="skeleton h-8 w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((fund, index) => (
              <div key={fund.schemeCode} className="pro-card glow-effect fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Fund Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                      {fund.schemeName}
                    </h3>
                    <p className="text-sm text-gray-600">{fund.fund_house}</p>
                  </div>
                  {fund.rating && (
                    <div className="flex items-center space-x-1 ml-2">
                      {renderStars(fund.rating)}
                    </div>
                  )}
                </div>

                {/* Fund Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900">{fund.category}</span>
                  </div>
                  
                  {fund.nav && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current NAV</span>
                      <span className="font-semibold text-gray-900">₹{fund.nav}</span>
                    </div>
                  )}

                  {fund.aum && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">AUM</span>
                      <span className="font-semibold text-gray-900">{fund.aum}</span>
                    </div>
                  )}

                  {fund.expense_ratio && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Expense Ratio</span>
                      <span className="font-semibold text-gray-900">{fund.expense_ratio}</span>
                    </div>
                  )}
                </div>

                {/* Returns */}
                {(fund.returns_1y || fund.returns_3y || fund.returns_5y) && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Historical Returns</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {fund.returns_1y && (
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600">1 Year</div>
                          <div className="font-bold text-success-600">{fund.returns_1y}</div>
                        </div>
                      )}
                      {fund.returns_3y && (
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600">3 Years</div>
                          <div className="font-bold text-success-600">{fund.returns_3y}</div>
                        </div>
                      )}
                      {fund.returns_5y && (
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600">5 Years</div>
                          <div className="font-bold text-success-600">{fund.returns_5y}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Risk Level */}
                {fund.risk_level && (
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(fund.risk_level)}`}>
                      <Shield className="w-4 h-4 mr-1" />
                      {fund.risk_level} Risk
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 btn-gradient flex items-center justify-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Start SIP</span>
                  </button>
                  <button className="px-4 py-2 border-2 border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredRecommendations.length === 0 && !loading && (
          <div className="text-center py-12">
            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No funds found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* SIP Calculator CTA */}
        <div className="mt-12 pro-card bg-gradient-primary text-white">
          <div className="text-center">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Calculate Your SIP Returns</h2>
            <p className="text-xl opacity-90 mb-6">
              Use our advanced SIP calculator to plan your investments and achieve your financial goals
            </p>
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Open SIP Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutualFundRecommendations;