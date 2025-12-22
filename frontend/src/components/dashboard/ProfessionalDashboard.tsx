import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Target, 
  AlertCircle, 
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  BookOpen,
  Shield,
  Briefcase,
  BarChart3
} from 'lucide-react';

interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface BudgetRecommendation {
  category: string;
  current: number;
  recommended: number;
  change: number;
  description: string;
  status: 'good' | 'warning' | 'critical';
}

const ProfessionalDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [budgetRecommendations, setBudgetRecommendations] = useState<BudgetRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setMetrics([
        {
          title: 'Total Portfolio Value',
          value: '₹12,45,000',
          change: '+8.5%',
          trend: 'up',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'text-success-600'
        },
        {
          title: 'Monthly Savings',
          value: '₹25,000',
          change: '+12%',
          trend: 'up',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'text-primary-600'
        },
        {
          title: 'Investment Returns',
          value: '14.2%',
          change: '+2.1%',
          trend: 'up',
          icon: <PieChart className="w-6 h-6" />,
          color: 'text-secondary-600'
        },
        {
          title: 'Goal Progress',
          value: '68%',
          change: '+5%',
          trend: 'up',
          icon: <Target className="w-6 h-6" />,
          color: 'text-warning-600'
        }
      ]);

      setBudgetRecommendations([
        {
          category: 'Essential Expenses (Rent, Food, Utilities)',
          current: 24500,
          recommended: 27500,
          change: 3000,
          description: 'Keep essential expenses under 55% of income for better savings',
          status: 'warning'
        },
        {
          category: 'Discretionary Spending (Entertainment, Dining)',
          current: 10500,
          recommended: 12500,
          change: 2000,
          description: 'Limit discretionary spending to 25% for better financial health',
          status: 'good'
        },
        {
          category: 'Savings & Investments',
          current: 15000,
          recommended: 10000,
          change: -5000,
          description: 'Aim to save at least 20% of your income',
          status: 'critical'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-500" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-error-500" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-success-500" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-error-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="pro-card">
                <div className="skeleton h-6 w-24 mb-4"></div>
                <div className="skeleton h-8 w-32 mb-2"></div>
                <div className="skeleton h-4 w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-professional">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Your Financial <span className="text-gradient">Command Center</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Professional-grade financial insights, AI-powered recommendations, and real-time policy impact analysis
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="glass-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-opacity-10 ${metric.color.replace('text-', 'bg-')}`}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{metric.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className={`text-sm font-semibold ${
                  metric.trend === 'up' ? 'text-success-600' : 
                  metric.trend === 'down' ? 'text-error-600' : 'text-gray-500'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Budget Recommendations */}
          <div className="lg:col-span-2">
            <div className="pro-card slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Budget Recommendations</h2>
                <span className="badge badge-primary">AI Powered</span>
              </div>
              
              <div className="space-y-6">
                {budgetRecommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-primary-200 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(rec.status)}
                        <h3 className="font-semibold text-gray-900">{rec.category}</h3>
                      </div>
                      <span className={`font-bold ${
                        rec.change > 0 ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {rec.change > 0 ? '+' : ''}₹{Math.abs(rec.change).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Current</p>
                        <p className="text-lg font-semibold">₹{rec.current.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Recommended</p>
                        <p className="text-lg font-semibold">₹{rec.recommended.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">{rec.description}</p>
                    
                    <div className="mt-4">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(rec.current / rec.recommended) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="pro-card scale-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                  <Calculator className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-700">Investment Calculator</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <BookOpen className="w-5 h-5 text-secondary-600" />
                  <span className="font-medium text-secondary-700">Financial Literacy</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-success-50 hover:bg-success-100 rounded-lg transition-colors">
                  <Shield className="w-5 h-5 text-success-600" />
                  <span className="font-medium text-success-700">Insurance Planner</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-warning-50 hover:bg-warning-100 rounded-lg transition-colors">
                  <Briefcase className="w-5 h-5 text-warning-600" />
                  <span className="font-medium text-warning-700">Policy Simulator</span>
                </button>
              </div>
            </div>

            {/* Market Insights */}
            <div className="pro-card scale-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Insights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nifty 50</span>
                  <div className="text-right">
                    <div className="font-semibold">21,456.78</div>
                    <div className="text-success-600 text-sm">+1.2%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sensex</span>
                  <div className="text-right">
                    <div className="font-semibold">71,234.56</div>
                    <div className="text-success-600 text-sm">+0.8%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">USD/INR</span>
                  <div className="text-right">
                    <div className="font-semibold">83.45</div>
                    <div className="text-error-600 text-sm">-0.3%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gold (₹/10g)</span>
                  <div className="text-right">
                    <div className="font-semibold">62,450</div>
                    <div className="text-success-600 text-sm">+0.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="pro-card glow-effect">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Investment Advisor</h3>
              <p className="text-gray-600 mb-4">Get personalized investment recommendations powered by advanced AI algorithms</p>
              <button className="btn-gradient w-full">Explore Now</button>
            </div>
          </div>

          <div className="pro-card glow-effect">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Policy Impact Simulator</h3>
              <p className="text-gray-600 mb-4">Understand how government policies affect your finances in real-time</p>
              <button className="btn-gradient w-full">Try Simulator</button>
            </div>
          </div>

          <div className="pro-card glow-effect">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multilingual Learning</h3>
              <p className="text-gray-600 mb-4">Learn financial concepts in your preferred language with interactive content</p>
              <button className="btn-gradient w-full">Start Learning</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;