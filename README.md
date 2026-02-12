# GIFT-City-Tax-
import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function InvestmentTaxCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [tenureMonths, setTenureMonths] = useState(24);
  const [xirrINRDomestic, setXirrINRDomestic] = useState(12);
  const [xirrINRGift, setXirrINRGift] = useState(15);
  const [xirrUSDDomestic, setXirrUSDDomestic] = useState(10);
  const [xirrUSDGift, setXirrUSDGift] = useState(13);

  // Tax rates based on tenure (in months)
  const getTaxRate = (months, isGiftCity, currency) => {
    if (isGiftCity) {
      // GIFT City has tax benefits
      if (months < 12) return currency === 'INR' ? 15 : 10;
      if (months < 36) return currency === 'INR' ? 10 : 5;
      return 0; // Long term benefit
    } else {
      // Domestic tax rates
      if (months < 12) return currency === 'INR' ? 15 : 20; // STCG
      if (months < 36) return currency === 'INR' ? 12.5 : 15;
      return currency === 'INR' ? 10 : 12.5; // LTCG
    }
  };

  const calculateReturns = (principal, xirrPercent, months, taxRate) => {
    // Convert annual XIRR to monthly rate
    const monthlyRate = Math.pow(1 + xirrPercent / 100, 1 / 12) - 1;
    
    // Calculate future value
    const futureValue = principal * Math.pow(1 + monthlyRate, months);
    
    // Calculate gains
    const gains = futureValue - principal;
    
    // Calculate tax
    const tax = gains * (taxRate / 100);
    
    // Net return after tax
    const netReturn = futureValue - tax;
    
    return {
      futureValue: futureValue.toFixed(2),
      gains: gains.toFixed(2),
      tax: tax.toFixed(2),
      netReturn: netReturn.toFixed(2),
      effectiveXIRR: ((Math.pow(netReturn / principal, 12 / months) - 1) * 100).toFixed(2)
    };
  };

  const scenarios = useMemo(() => {
    const inrDomesticTax = getTaxRate(tenureMonths, false, 'INR');
    const inrGiftTax = getTaxRate(tenureMonths, true, 'INR');
    const usdDomesticTax = getTaxRate(tenureMonths, false, 'USD');
    const usdGiftTax = getTaxRate(tenureMonths, true, 'USD');

    return [
      {
        name: 'INR - Domestic',
        currency: '₹',
        ...calculateReturns(investmentAmount, xirrINRDomestic, tenureMonths, inrDomesticTax),
        taxRate: inrDomesticTax,
        xirr: xirrINRDomestic
      },
      {
        name: 'INR - GIFT City',
        currency: '₹',
        ...calculateReturns(investmentAmount, xirrINRGift, tenureMonths, inrGiftTax),
        taxRate: inrGiftTax,
        xirr: xirrINRGift
      },
      {
        name: 'USD - Domestic',
        currency: '$',
        ...calculateReturns(investmentAmount, xirrUSDDomestic, tenureMonths, usdDomesticTax),
        taxRate: usdDomesticTax,
        xirr: xirrUSDDomestic
      },
      {
        name: 'USD - GIFT City',
        currency: '$',
        ...calculateReturns(investmentAmount, xirrUSDGift, tenureMonths, usdGiftTax),
        taxRate: usdGiftTax,
        xirr: xirrUSDGift
      }
    ];
  }, [investmentAmount, tenureMonths, xirrINRDomestic, xirrINRGift, xirrUSDDomestic, xirrUSDGift]);

  const bestOption = useMemo(() => {
    return scenarios.reduce((best, current) => 
      parseFloat(current.netReturn) > parseFloat(best.netReturn) ? current : best
    );
  }, [scenarios]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Investment Tax Comparison
            </h1>
          </div>

          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Investment Amount
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tenure (Months)
              </label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Percent className="inline w-4 h-4 mr-1" />
                XIRR - INR Domestic (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={xirrINRDomestic}
                onChange={(e) => setXirrINRDomestic(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Percent className="inline w-4 h-4 mr-1" />
                XIRR - INR GIFT City (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={xirrINRGift}
                onChange={(e) => setXirrINRGift(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Percent className="inline w-4 h-4 mr-1" />
                XIRR - USD Domestic (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={xirrUSDDomestic}
                onChange={(e) => setXirrUSDDomestic(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Percent className="inline w-4 h-4 mr-1" />
                XIRR - USD GIFT City (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={xirrUSDGift}
                onChange={(e) => setXirrUSDGift(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Comparison Results
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scenarios.map((scenario, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    scenario.name === bestOption.name
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800">{scenario.name}</h3>
                    {scenario.name === bestOption.name && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        BEST
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">XIRR:</span>
                      <span className="font-semibold">{scenario.xirr}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Rate:</span>
                      <span className="font-semibold text-red-600">{scenario.taxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Future Value:</span>
                      <span className="font-semibold">{scenario.currency}{parseFloat(scenario.futureValue).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gains:</span>
                      <span className="font-semibold text-green-600">{scenario.currency}{parseFloat(scenario.gains).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold text-red-600">{scenario.currency}{parseFloat(scenario.tax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                      <span className="text-gray-800 font-bold">Net Return:</span>
                      <span className="font-bold text-lg text-indigo-600">
                        {scenario.currency}{parseFloat(scenario.netReturn).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective XIRR:</span>
                      <span className="font-semibold">{scenario.effectiveXIRR}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Rate Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Tax Rate Structure (Based on Tenure)</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-semibold mb-1">Domestic Route:</p>
                <ul className="space-y-1 ml-4">
                  <li>• &lt;12 months: 15-20% (STCG)</li>
                  <li>• 12-36 months: 12.5-15%</li>
                  <li>• &gt;36 months: 10-12.5% (LTCG)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">GIFT City Route:</p>
                <ul className="space-y-1 ml-4">
                  <li>• &lt;12 months: 10-15%</li>
                  <li>• 12-36 months: 5-10%</li>
                  <li>• &gt;36 months: 0% (Tax benefit)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
