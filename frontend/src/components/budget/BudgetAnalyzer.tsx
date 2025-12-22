import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  AlertTriangle,
  CheckCircle,
  Target,
  Home,
  ShoppingCart,
  Car,
  Utensils,
  Zap,
  Heart,
  Film,
  Plane,
  CreditCard,
  Wallet,
  Shield,
  Plus,
  Minus,
  BarChart3,
  Sparkles,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  type: 'essential' | 'discretionary' | 'financial';
}

interface BudgetAnalysis {
  total_income: number;
  total_expenses: number;
  savings_rate: number;
  recommended_savings_rate: number;
  categories: Array<{
    name: string;
    current_amount: number;
    recommended_amount: number;
    percentage_of_income: number;
    recommended_percentage: number;
    status: 'good' | 'warning' | 'critical';
    description: string;
    tips: string[];
  }>;
  overall_score: number;
  recommendations: string[];
  emergency_fund_months: number;
  debt_to_income_ratio: number;
}

const BudgetAnalyzer: React.FC = () => {
  const { t } = useTranslation()
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);
  const [expenses, setExpenses] = useState<ExpenseCategory[]>([
    { id: 'housing', name: 'Housing (Rent/EMI)', amount: 20000, icon: <Home className="w-5 h-5" />, color: 'bg-blue-500', type: 'essential' },
    { id: 'food', name: 'Food & Groceries', amount: 8000, icon: <Utensils className="w-5 h-5" />, color: 'bg-green-500', type: 'essential' },
    { id: 'utilities', name: 'Utilities', amount: 3000, icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-500', type: 'essential' },
    { id: 'transportation', name: 'Transportation', amount: 5000, icon: <Car className="w-5 h-5" />, color: 'bg-purple-500', type: 'essential' },
    { id: 'healthcare', name: 'Healthcare', amount: 2000, icon: <Heart className="w-5 h-5" />, color: 'bg-red-500', type: 'essential' },
    { id: 'entertainment', name: 'Entertainment', amount: 4000, icon: <Film className="w-5 h-5" />, color: 'bg-pink-500', type: 'discretionary' },
    { id: 'dining', name: 'Dining Out', amount: 3000, icon: <Utensils className="w-5 h-5" />, color: 'bg-orange-500', type: 'discretionary' },
    { id: 'shopping', name: 'Shopping', amount: 2500, icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-indigo-500', type: 'discretionary' },
    { id: 'savings', name: 'Savings', amount: 5000, icon: <Wallet className="w-5 h-5" />, color: 'bg-emerald-500', type: 'financial' },
    { id: 'investments', name: 'Investments', amount: 3000, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-cyan-500', type: 'financial' },
  ]);
  
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const updateExpense = (id: string, amount: number) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === id ? { ...exp, amount: Math.max(0, amount) } : exp
    ));
  };

  const analyzeBudget = async () => {
    setLoading(true);
    try {
      const expenseMap = expenses.reduce((acc, exp) => {
        acc[exp.id] = exp.amount;
        return acc;
      }, {} as Record<string, number>);

      const response = await fetch('http://localhost:8001/budget/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthly_income: monthlyIncome,
          expenses: expenseMap,
          financial_goals: [],
          age: 30,
          dependents: 0
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Budget analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeBudget();
  }, [monthlyIncome, expenses]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success-600 bg-success-50 border-success-200';
      case 'warning': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'critical': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-error-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-primary-200 rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + i * 8}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <Brain className="w-6 h-6 text-primary-600" />
            <span className="font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('hero.aiPowered')}
            </span>
            <Sparkles className="w-5 h-5 text-secondary-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent">
              {t('budget.title')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('budget.subtitle')}
          </p>
        </motion.div>

        {/* Income Input */}
        <div className="pro-card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Monthly Income</h2>
            <div className="badge badge-primary">Required</div>
          </div>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your monthly income (₹)
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="pro-input text-2xl font-bold"
              placeholder="50,000"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Expenses</span>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{totalExpenses.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {((totalExpenses / monthlyIncome) * 100).toFixed(1)}% of income
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Savings Rate</span>
              <TrendingUp className="w-4 h-4 text-success-500" />
            </div>
            <div className={`text-2xl font-bold ${savingsRate >= 20 ? 'text-success-600' : savingsRate >= 10 ? 'text-warning-600' : 'text-error-600'}`}>
              {savingsRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">
              Target: 20%+
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Surplus</span>
              <Wallet className="w-4 h-4 text-primary-500" />
            </div>
            <div className={`text-2xl font-bold ${monthlyIncome - totalExpenses >= 0 ? 'text-success-600' : 'text-error-600'}`}>
              ₹{(monthlyIncome - totalExpenses).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              Available for goals
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Budget Score</span>
              <Target className="w-4 h-4 text-secondary-500" />
            </div>
            <div className="text-2xl font-bold text-secondary-600">
              {analysis?.overall_score || 0}/100
            </div>
            <div className="text-sm text-gray-500">
              Financial health
            </div>
          </div>
        </div>

        {/* Expense Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="pro-card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Expenses</h3>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${expense.color} text-white`}>
                      {expense.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{expense.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{expense.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateExpense(expense.id, expense.amount - 500)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-right min-w-[100px]">
                      <div className="font-bold text-gray-900">₹{expense.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {((expense.amount / monthlyIncome) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <button
                      onClick={() => updateExpense(expense.id, expense.amount + 500)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="pro-card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Expense Breakdown</h3>
            <div className="space-y-4">
              {['essential', 'discretionary', 'financial'].map((type) => {
                const categoryExpenses = expenses.filter(exp => exp.type === type);
                const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const percentage = (categoryTotal / totalExpenses) * 100;
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 capitalize">
                        {type === 'essential' ? 'Essential Expenses' : 
                         type === 'discretionary' ? 'Discretionary Spending' : 
                         'Financial Allocations'}
                      </span>
                      <span className="font-bold">₹{categoryTotal.toLocaleString()}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${
                          type === 'essential' ? 'bg-blue-500' :
                          type === 'discretionary' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500">{percentage.toFixed(1)}% of total expenses</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Budget Recommendations */}
            <div className="pro-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">AI Budget Analysis</h2>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                  <span className="badge badge-primary">AI Powered</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {analysis.categories.map((category, index) => (
                  <div key={index} className={`p-6 rounded-xl border-2 ${getStatusColor(category.status)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(category.status)}
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {category.current_amount > category.recommended_amount ? '+' : ''}
                          ₹{Math.abs(category.current_amount - category.recommended_amount).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">vs recommended</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current</p>
                        <p className="text-lg font-bold">₹{category.current_amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{category.percentage_of_income.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Recommended</p>
                        <p className="text-lg font-bold">₹{category.recommended_amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{category.recommended_percentage}%</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">{category.description}</p>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Recommendations:</h4>
                      <ul className="space-y-1">
                        {category.tips.slice(0, 3).map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Recommendations */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Priority Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.recommendations.slice(0, 6).map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="pro-card text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Fund</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {analysis.emergency_fund_months.toFixed(1)} months
                </div>
                <p className="text-gray-600">Target: 6 months of expenses</p>
              </div>

              <div className="pro-card text-center">
                <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Savings Rate</h3>
                <div className="text-3xl font-bold text-success-600 mb-2">
                  {analysis.savings_rate.toFixed(1)}%
                </div>
                <p className="text-gray-600">Target: 20%+ for wealth building</p>
              </div>

              <div className="pro-card text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Debt Ratio</h3>
                <div className="text-3xl font-bold text-secondary-600 mb-2">
                  {analysis.debt_to_income_ratio.toFixed(1)}%
                </div>
                <p className="text-gray-600">Target: Under 10% is healthy</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAnalyzer;