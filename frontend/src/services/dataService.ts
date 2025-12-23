// src/services/dataService.ts

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name?: string; // Optional name field
}

export const dataService = {
  async getDashboardData() {
    try {
      const response = await fetch('/api/finance');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
};

// --- Helper Functions (Make sure these are all exported) ---

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

// This was the missing export causing the error
export const formatPercentage = (value: number) => {
  // Handle cases where value might be undefined or null
  if (value === undefined || value === null) return '0.00%';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const getChangeColor = (value: number) => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};