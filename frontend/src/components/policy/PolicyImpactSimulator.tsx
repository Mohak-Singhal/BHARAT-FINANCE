import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  Target,
  Briefcase,
  Home,
  ShoppingCart
} from 'lucide-react';

interface PolicySimulation {
  simulation_type: string;
  impact_analysis: any;
  simulation_date: string;
  disclaimer: string;
}

interface SimulationRequest {
  type: string;
  change_percentage?: number;
  amount_change?: number;
  duty_change_percentage?: number;
  income_bracket?: string;
  category?: string;
  sector?: string;
  current_duty_percentage?: number;
}

const PolicyImpactSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tax' | 'subsidy' | 'import_duty'>('tax');
  const [simulationResult, setSimulationResult] = useState<PolicySimulation | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SimulationRequest>({
    type: 'income_tax',
    change_percentage: 0,
    amount_change: 0,
    duty_change_percentage: 0,
    income_bracket: 'middle',
    category: 'electronics',
    sector: 'transportation',
    current_duty_percentage: 10
  });

  const simulatePolicy = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let payload = {};

      switch (activeTab) {
        case 'tax':
          endpoint = 'http://localhost:8001/policy-simulation/simulate/tax-impact';
          payload = {
            type: formData.type,
            change_percentage: formData.change_percentage,
            income_bracket: formData.income_bracket
          };
          break;
        case 'subsidy':
          endpoint = 'http://localhost:8001/policy-simulation/simulate/subsidy-impact';
          payload = {
            type: formData.type,
            amount_change: formData.amount_change,
            sector: formData.sector
          };
          break;
        case 'import_duty':
          endpoint = 'http://localhost:8001/policy-simulation/simulate/import-duty-impact';
          payload = {
            category: formData.category,
            duty_change_percentage: formData.duty_change_percentage,
            current_duty_percentage: formData.current_duty_percentage
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setSimulationResult(data);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTaxForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="pro-select"
        >
          <option value="income_tax">Income Tax</option>
          <option value="gst">GST</option>
          <option value="corporate_tax">Corporate Tax</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax Rate Change (%)
        </label>
        <input
          type="number"
          value={formData.change_percentage}
          onChange={(e) => setFormData({ ...formData, change_percentage: parseFloat(e.target.value) })}
          className="pro-input"
          placeholder="e.g., -2 for 2% reduction, +3 for 3% increase"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Income Bracket</label>
        <select
          value={formData.income_bracket}
          onChange={(e) => setFormData({ ...formData, income_bracket: e.target.value })}
          className="pro-select"
        >
          <option value="low">Low Income (₹0 - ₹5L)</option>
          <option value="middle">Middle Income (₹5L - ₹10L)</option>
          <option value="high">High Income (₹10L+)</option>
        </select>
      </div>
    </div>
  );

  const renderSubsidyForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subsidy Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="pro-select"
        >
          <option value="fuel">Fuel Subsidy</option>
          <option value="fertilizer">Fertilizer Subsidy</option>
          <option value="electricity">Electricity Subsidy</option>
          <option value="food">Food Subsidy</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subsidy Amount Change (₹)
        </label>
        <input
          type="number"
          value={formData.amount_change}
          onChange={(e) => setFormData({ ...formData, amount_change: parseFloat(e.target.value) })}
          className="pro-input"
          placeholder="e.g., -5 for ₹5 reduction, +10 for ₹10 increase"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Affected Sector</label>
        <select
          value={formData.sector}
          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
          className="pro-select"
        >
          <option value="transportation">Transportation</option>
          <option value="agriculture">Agriculture</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="household">Household</option>
        </select>
      </div>
    </div>
  );

  const renderImportDutyForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="pro-select"
        >
          <option value="electronics">Electronics</option>
          <option value="automobiles">Automobiles</option>
          <option value="textiles">Textiles</option>
          <option value="machinery">Machinery</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Import Duty (%)
        </label>
        <input
          type="number"
          value={formData.current_duty_percentage}
          onChange={(e) => setFormData({ ...formData, current_duty_percentage: parseFloat(e.target.value) })}
          className="pro-input"
          placeholder="Current duty percentage"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duty Change (%)
        </label>
        <input
          type="number"
          value={formData.duty_change_percentage}
          onChange={(e) => setFormData({ ...formData, duty_change_percentage: parseFloat(e.target.value) })}
          className="pro-input"
          placeholder="e.g., -5 for 5% reduction, +10 for 10% increase"
        />
      </div>
    </div>
  );

  const renderResults = () => {
    if (!simulationResult) return null;

    const { impact_analysis } = simulationResult;

    return (
      <div className="mt-8 space-y-6">
        <div className="pro-card border-gradient">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Simulation Results</h3>
              <p className="text-gray-600">Impact analysis for your policy scenario</p>
            </div>
          </div>

          {/* Tax Impact Results */}
          {activeTab === 'tax' && impact_analysis.impact_analysis && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Rate</span>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {impact_analysis.current_rate}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">New Rate</span>
                    <TrendingUp className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    {impact_analysis.new_rate}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Avg. Savings</span>
                    <DollarSign className="w-4 h-4 text-success-500" />
                  </div>
                  <div className="text-2xl font-bold text-success-600">
                    ₹{Math.abs(impact_analysis.overall_impact?.average_savings || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {impact_analysis.impact_analysis && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Impact by Income Level</h4>
                  <div className="space-y-3">
                    {impact_analysis.impact_analysis.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">₹{item.income.toLocaleString()} Income</span>
                          <div className="text-sm text-gray-600">
                            Monthly Savings: ₹{Math.abs(item.monthly_savings || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${item.annual_savings >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                            {item.annual_savings >= 0 ? '+' : ''}₹{Math.abs(item.annual_savings).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Annual</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subsidy Impact Results */}
          {activeTab === 'subsidy' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Direct Impact</span>
                    <Target className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    ₹{Math.abs(impact_analysis.direct_impact || 0)}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Affected Sectors</span>
                    <Briefcase className="w-4 h-4 text-secondary-500" />
                  </div>
                  <div className="text-lg font-bold text-secondary-600">
                    {impact_analysis.affected_sectors?.length || 0} Sectors
                  </div>
                </div>
              </div>

              {impact_analysis.household_impact && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Household Impact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(impact_analysis.household_impact).map(([category, data]: [string, any]) => (
                      <div key={category} className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 capitalize mb-2">{category.replace('_', ' ')}</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Monthly</span>
                            <span className="font-semibold">₹{Math.abs(data.monthly_savings || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Annual</span>
                            <span className="font-semibold">₹{Math.abs(data.annual_savings || 0)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Import Duty Results */}
          {activeTab === 'import_duty' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Duty</span>
                    <PieChart className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {impact_analysis.current_duty}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">New Duty</span>
                    <PieChart className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    {impact_analysis.new_duty}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Price Impact</span>
                    <ShoppingCart className="w-4 h-4 text-warning-500" />
                  </div>
                  <div className="text-2xl font-bold text-warning-600">
                    {impact_analysis.price_impact?.price_increase_percentage?.toFixed(1) || 0}%
                  </div>
                </div>
              </div>

              {impact_analysis.price_impact?.example_product_price_change && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Price Impact Examples</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(impact_analysis.price_impact.example_product_price_change).map(([product, newPrice]: [string, any]) => (
                      <div key={product} className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{product}</div>
                        <div className="text-lg font-bold text-gray-900">{newPrice}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {impact_analysis.recommendations && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Recommendations</h4>
              </div>
              <ul className="space-y-2">
                {impact_analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800 text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 text-sm">{simulationResult.disclaimer}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Policy <span className="text-gradient">Impact Simulator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understand how government policy changes affect your finances in real-time
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('tax')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'tax'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tax Policies
          </button>
          <button
            onClick={() => setActiveTab('subsidy')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'subsidy'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Subsidies
          </button>
          <button
            onClick={() => setActiveTab('import_duty')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'import_duty'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Import Duties
          </button>
        </div>

        {/* Simulation Form */}
        <div className="pro-card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Simulate {activeTab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Impact
          </h2>
          
          {activeTab === 'tax' && renderTaxForm()}
          {activeTab === 'subsidy' && renderSubsidyForm()}
          {activeTab === 'import_duty' && renderImportDutyForm()}

          <button
            onClick={simulatePolicy}
            disabled={loading}
            className="w-full btn-gradient mt-6 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                <span>Run Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {renderResults()}
      </div>
    </div>
  );
};

export default PolicyImpactSimulator;