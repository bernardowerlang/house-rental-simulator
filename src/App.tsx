import React, { useState, useEffect } from 'react';
import { Calculator, Home, AlertCircle, Users, Building, Crown } from 'lucide-react';
import { useTranslation } from './useTranslation';

interface RentalData {
  monthlyRent: number;
  rentalPeriod: number;
  alternativeHousingCost: number;
  monthlyCosts: number;
  monthlyDeductions: number; // Apenas para PF
}

interface TaxResults {
  totalTax: number;
  netIncome: number;
  finalProfit: number;
}

interface ComparisonResults {
  pf: TaxResults;
  pj: TaxResults;
  bestOption: 'pf' | 'pj';
}

// Tabela do IR 2024 (Carnê-Leão)
const IR_TABLE = [
  { min: 0, max: 2259.20, rate: 0, deduction: 0 },
  { min: 2259.21, max: 2826.65, rate: 7.5, deduction: 169.44 },
  { min: 2826.66, max: 3751.05, rate: 15, deduction: 381.44 },
  { min: 3751.06, max: 4664.68, rate: 22.5, deduction: 662.77 },
  { min: 4664.69, max: Infinity, rate: 27.5, deduction: 896.00 }
];

const HouseRentalSimulator: React.FC = () => {
  const { t, language, changeLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState<'input' | 'comparison'>('input');
  const [data, setData] = useState<RentalData>({
    monthlyRent: 3500,
    rentalPeriod: 12,
    alternativeHousingCost: 18000,
    monthlyCosts: 300,
    monthlyDeductions: 500,
  });
  
  const [results, setResults] = useState<ComparisonResults>({
    pf: { totalTax: 0, netIncome: 0, finalProfit: 0 },
    pj: { totalTax: 0, netIncome: 0, finalProfit: 0 },
    bestOption: 'pf'
  });

  const formatCurrency = (value: number) => {
    if (language === 'pt') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    }
  };

  const parseCurrencyInput = (value: string) => {
    return Number(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  const calculatePFTax = (monthlyIncome: number, monthlyDeductions: number) => {
    const taxableIncome = monthlyIncome - monthlyDeductions;
    
    if (taxableIncome <= 0) return 0;
    
    const bracket = IR_TABLE.find(b => taxableIncome >= b.min && taxableIncome <= b.max);
    if (!bracket) return 0;
    
    return Math.max(0, (taxableIncome * bracket.rate / 100) - bracket.deduction);
  };

  const calculateResults = () => {
    const totalGrossIncome = data.monthlyRent * data.rentalPeriod;
    const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);

    // Pessoa Física (Carnê-Leão)
    const monthlyPFTax = calculatePFTax(data.monthlyRent, data.monthlyDeductions);
    const totalPFTax = monthlyPFTax * data.rentalPeriod;
    const pfNetIncome = totalGrossIncome - totalPFTax;
    const pfFinalProfit = pfNetIncome - totalCosts;

    // Pessoa Jurídica (Simples Nacional 6%)
    const totalPJTax = totalGrossIncome * 0.06;
    const pjNetIncome = totalGrossIncome - totalPJTax;
    const pjFinalProfit = pjNetIncome - totalCosts;

    const bestOption = pfFinalProfit >= pjFinalProfit ? 'pf' : 'pj';

    setResults({
      pf: {
        totalTax: totalPFTax,
        netIncome: pfNetIncome,
        finalProfit: pfFinalProfit
      },
      pj: {
        totalTax: totalPJTax,
        netIncome: pjNetIncome,
        finalProfit: pjFinalProfit
      },
      bestOption
    });
  };

  useEffect(() => {
    calculateResults();
  }, [data]);

  const handleInputChange = (field: keyof RentalData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyInputChange = (field: keyof RentalData, value: string) => {
    const numericValue = parseCurrencyInput(value);
    handleInputChange(field, numericValue);
  };

  const loadExampleData = () => {
    setData({
      monthlyRent: 4000,
      rentalPeriod: 12,
      alternativeHousingCost: 20000,
      monthlyCosts: 400,
      monthlyDeductions: 600,
    });
  };

  const clearData = () => {
    setData({
      monthlyRent: 0,
      rentalPeriod: 12,
      alternativeHousingCost: 0,
      monthlyCosts: 0,
      monthlyDeductions: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Home className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              {t('title')}
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {t('subtitle')}
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={loadExampleData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <Calculator className="w-5 h-5" />
              {t('loadExample')}
            </button>
            <button
              onClick={clearData}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
            >
              {t('clearData')}
            </button>
            
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as 'pt' | 'en')}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="pt">🇧🇷 {t('portuguese')}</option>
                <option value="en">🇺🇸 {t('english')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <div className="flex">
              <button
                onClick={() => setActiveTab('input')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'input'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t('inputData')}
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'comparison'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t('comparison')}
              </button>
            </div>
          </div>
        </div>

        {/* Input Tab */}
        {activeTab === 'input' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <Calculator className="w-6 h-6 mr-3" />
                {t('simulationData')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dados Básicos */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    {t('basicData')}
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('monthlyRent')}
                    </label>
                    <input
                      type="text"
                      value={data.monthlyRent ? formatCurrency(data.monthlyRent) : ''}
                      onChange={(e) => handleCurrencyInputChange('monthlyRent', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={language === 'pt' ? "R$ 3.500,00" : "$3,500.00"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('rentalPeriod')}
                    </label>
                    <input
                      type="number"
                      value={data.rentalPeriod || ''}
                      onChange={(e) => handleInputChange('rentalPeriod', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="12"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('alternativeHousingCost')}
                    </label>
                    <input
                      type="text"
                      value={data.alternativeHousingCost ? formatCurrency(data.alternativeHousingCost) : ''}
                      onChange={(e) => handleCurrencyInputChange('alternativeHousingCost', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={language === 'pt' ? "R$ 18.000,00" : "$18,000.00"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('alternativeHousingHelper')}
                    </p>
                  </div>
                </div>

                {/* Custos e Deduções */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    {t('costsAndDeductions')}
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('monthlyCosts')}
                    </label>
                    <input
                      type="text"
                      value={data.monthlyCosts ? formatCurrency(data.monthlyCosts) : ''}
                      onChange={(e) => handleCurrencyInputChange('monthlyCosts', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={language === 'pt' ? "R$ 300,00" : "$300.00"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('monthlyCortsHelper')}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-800">{t('individualOnly')}</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        {t('monthlyDeductions')}
                      </label>
                      <input
                        type="text"
                        value={data.monthlyDeductions ? formatCurrency(data.monthlyDeductions) : ''}
                        onChange={(e) => handleCurrencyInputChange('monthlyDeductions', e.target.value)}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white"
                        placeholder={language === 'pt' ? "R$ 500,00" : "$500.00"}
                      />
                      <p className="text-xs text-blue-600 mt-1">
                        {t('deductionsHelper')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4">{t('quickSummary')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t('totalGrossRevenue')}</span>
                    <div className="font-bold text-green-600 text-lg">
                      {formatCurrency(data.monthlyRent * data.rentalPeriod)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('totalCosts')}</span>
                    <div className="font-bold text-red-600 text-lg">
                      {formatCurrency(data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('beforeTaxes')}</span>
                    <div className="font-bold text-blue-600 text-lg">
                      {formatCurrency((data.monthlyRent * data.rentalPeriod) - (data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod)))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            {/* Best Option Banner */}
            <div className={`text-center py-6 px-8 rounded-xl shadow-lg ${
              results.bestOption === 'pf' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-600'
            } text-white`}>
              <div className="flex items-center justify-center mb-2">
                <Crown className="w-8 h-8 mr-3" />
                <h2 className="text-3xl font-bold">
                  {t('bestOption')} {results.bestOption === 'pf' ? t('individual') : t('corporate')}
                </h2>
              </div>
              <p className="text-xl opacity-90">
                {t('savingsCompared', { 
                  amount: formatCurrency(Math.abs(results.pf.finalProfit - results.pj.finalProfit)) 
                })}
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pessoa Física Card */}
              <div className={`bg-white rounded-xl shadow-xl p-8 border-2 ${
                results.bestOption === 'pf' ? 'border-green-400 ring-4 ring-green-100' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">{t('individual')}</h3>
                  </div>
                  {results.bestOption === 'pf' && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t('best')}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">{t('taxCalculation')}</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>{t('taxBase')} {formatCurrency(data.monthlyRent - data.monthlyDeductions)}/mês</div>
                      <div>{t('monthlyTax')} {formatCurrency(results.pf.totalTax / data.rentalPeriod)}</div>
                      <div className="font-medium">{t('progressiveTable')}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <span className="font-medium text-gray-700">{t('totalTax')}</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatCurrency(results.pf.totalTax)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <span className="font-medium text-gray-700">{t('netRevenue')}</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(results.pf.netIncome)}
                      </span>
                    </div>

                    <div className={`flex justify-between items-center p-4 rounded-lg border ${
                      results.pf.finalProfit >= 0 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <span className="font-medium text-gray-700">{t('finalProfit')}</span>
                      <span className={`text-xl font-bold ${
                        results.pf.finalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {formatCurrency(results.pf.finalProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pessoa Jurídica Card */}
              <div className={`bg-white rounded-xl shadow-xl p-8 border-2 ${
                results.bestOption === 'pj' ? 'border-purple-400 ring-4 ring-purple-100' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Building className="w-8 h-8 text-purple-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">{t('corporate')}</h3>
                  </div>
                  {results.bestOption === 'pj' && (
                    <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t('best')}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">{t('taxCalculation')}</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div>{t('taxBase')} {formatCurrency(data.monthlyRent * data.rentalPeriod)}</div>
                      <div>{t('corporateRate')}</div>
                      <div className="font-medium">{t('corporateRegime')}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <span className="font-medium text-gray-700">{t('totalTax')}</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatCurrency(results.pj.totalTax)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <span className="font-medium text-gray-700">{t('netRevenue')}</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(results.pj.netIncome)}
                      </span>
                    </div>

                    <div className={`flex justify-between items-center p-4 rounded-lg border ${
                      results.pj.finalProfit >= 0 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <span className="font-medium text-gray-700">{t('finalProfit')}</span>
                      <span className={`text-xl font-bold ${
                        results.pj.finalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {formatCurrency(results.pj.finalProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <AlertCircle className="w-6 h-6 mr-3" />
                {t('detailedAnalysis')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">{t('taxComparison')}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('individual')}:</span>
                      <span className="font-bold text-red-600">{formatCurrency(results.pf.totalTax)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('corporate')}:</span>
                      <span className="font-bold text-red-600">{formatCurrency(results.pj.totalTax)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{t('difference')}</span>
                        <span className={`font-bold ${
                          results.pf.totalTax > results.pj.totalTax ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(Math.abs(results.pf.totalTax - results.pj.totalTax))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">{t('profitComparison')}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('individual')}:</span>
                      <span className={`font-bold ${results.pf.finalProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(results.pf.finalProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('corporate')}:</span>
                      <span className={`font-bold ${results.pj.finalProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(results.pj.finalProfit)}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{t('advantage')}</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(Math.abs(results.pf.finalProfit - results.pj.finalProfit))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">{t('recommendations')}</h4>
                
                {results.bestOption === 'pf' ? (
                  <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                    <p className="text-green-700">
                      <strong>{t('individualBetter')}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                    <p className="text-purple-700">
                      <strong>{t('corporateBetter')}</strong>
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-blue-700">
                    <strong>{t('corporateReminder')}</strong>
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-yellow-700">
                    <strong>{t('consultAccountant')}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            💡 <strong>{t('footerDisclaimer')}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HouseRentalSimulator;
