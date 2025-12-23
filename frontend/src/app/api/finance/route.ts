import { NextResponse } from 'next/server';

// 1. Robust Initialization for Next.js
// We use 'require' to get the Class specifically, then create our own instance.
const yahooFinanceModule = require('yahoo-finance2');
const yahooFinance = new yahooFinanceModule.YahooFinance();

let cache = {
  data: null as any,
  lastFetch: 0
};

export async function GET() {
  const now = Date.now();
  const CACHE_DURATION = 15 * 60 * 1000; // 15 Minutes

  if (cache.data && (now - cache.lastFetch < CACHE_DURATION)) {
    return NextResponse.json(cache.data);
  }

  try {
    console.log("Fetching fresh data from Yahoo Finance...");

    const symbols = ['^BSESN', 'RELIANCE.BO', 'TCS.BO', 'INFY.BO'];
    
    // 2. Fetch Stocks
    const marketPromises = symbols.map(async (sym) => {
      try {
        const quote = await yahooFinance.quote(sym);
        return {
          symbol: sym.replace('^', '').replace('.BO', ''),
          name: quote.longName || quote.shortName || sym,
          price: quote.regularMarketPrice || 0,
          change: quote.regularMarketChange || 0,
          changePercent: quote.regularMarketChangePercent || 0
        };
      } catch (e) {
        console.error(`Failed to fetch ${sym}:`, e);
        return null;
      }
    });

    // 3. Fetch Forex & Commodities
    const forexPromise = yahooFinance.quote('INR=X'); 
    const goldPromise = yahooFinance.quote('GC=F'); 
    const silverPromise = yahooFinance.quote('SI=F');

    const [marketRaw, forexData, goldData, silverData] = await Promise.all([
      Promise.all(marketPromises),
      forexPromise,
      goldPromise,
      silverPromise
    ]);

    const usdRate = forexData.regularMarketPrice || 83.50;

    const processedData = {
      market: marketRaw.filter(Boolean),
      
      commodities: [
        {
          symbol: 'GOLD (10g)',
          price: ((goldData.regularMarketPrice || 0) / 31.1035) * 10 * usdRate,
          change: 0,
          changePercent: goldData.regularMarketChangePercent || 0
        },
        {
          symbol: 'SILVER (1kg)',
          price: ((silverData.regularMarketPrice || 0) / 31.1035) * 1000 * usdRate,
          change: 0,
          changePercent: silverData.regularMarketChangePercent || 0
        }
      ],

      currency: [
        { from: 'USD', rate: usdRate },
        { from: 'EUR', rate: usdRate * 1.09 }
      ],

      indicators: {
        gdpGrowth: 7.2,
        inflationRate: 5.4,
        repoRate: 6.5
      },
      
      lastUpdated: new Date().toISOString()
    };

    cache = {
      data: processedData,
      lastFetch: now
    };

    return NextResponse.json(processedData);

  } catch (error: any) {
    console.error("Backend Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" }, 
      { status: 500 }
    );
  }
}