import React, { useState, useEffect } from 'react';
import { Calculator, Home, AlertCircle, Users, Building, Crown } from 'lucide-react';
import { useTranslation } from './useTranslation';

interface RentalData {
  monthlyRent: number;
  rentalPeriod: number;
  alternativeHousingCost: number;
  monthlyCosts: number;
  monthlyDeductions: number; // Only for Individual Person (PF)
  numberOfInvoices: number; // Number of invoices to split the total revenue
  minimumDesiredProfit: number; // Minimum profit the owner wants to achieve
}

interface InputValues {
  monthlyRent: string;
  rentalPeriod: string;
  alternativeHousingCost: string;
  monthlyCosts: string;
  monthlyDeductions: string;
  numberOfInvoices: string;
  minimumDesiredProfit: string;
}

interface TaxResults {
  totalTax: number;
  netIncome: number;
  finalProfit: number;
  prolabore?: {
    amount: number;
    inss: number;
    irpf: number;
    totalTax: number;
    breakdown?: {
      prolaborePerInvoice: number;
      monthlyProlaborePerInvoice: number;
      inssPerInvoice: number;
      irpfPerInvoice: number;
      monthlyINSSPerInvoice: number;
      monthlyIRPFPerInvoice: number;
    };
  };
}

interface ComparisonResults {
  pf: TaxResults;
  pj: TaxResults;
  bestOption: 'pf' | 'pj';
}

// Brazilian Income Tax Table 2025 (Valid from May 2025 - Monthly Rental Income)
const IR_TABLE = [
  { min: 0, max: 2428.80, rate: 0, deduction: 0 },
  { min: 2428.81, max: 2826.65, rate: 7.5, deduction: 182.16 },
  { min: 2826.66, max: 3751.05, rate: 15, deduction: 394.16 },
  { min: 3751.06, max: 4664.68, rate: 22.5, deduction: 675.49 },
  { min: 4664.69, max: Infinity, rate: 27.5, deduction: 908.73 }
];

// INSS Table 2025 (Progressive Brackets)
const INSS_TABLE = [
  { min: 0, max: 1518.00, rate: 7.5, deduction: 0 },
  { min: 1518.01, max: 2793.88, rate: 9, deduction: 22.77 },
  { min: 2793.89, max: 4190.83, rate: 12, deduction: 106.59 },
  { min: 4190.84, max: 8157.41, rate: 14, deduction: 190.40 }
];

// Constants for Corporate (PJ) calculations
const PROLABORE_PERCENTAGE = 0.28; // 28% of revenue
const INSS_MAX_AMOUNT = 8157.41; // INSS ceiling 2025
const SIMPLES_NACIONAL_RATE = 0.06; // 6% Simplified National Tax

const HouseRentalSimulator: React.FC = () => {
  const { t, language, changeLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState<'input' | 'comparison' | 'viability' | 'negotiation'>('input');
  const [data, setData] = useState<RentalData>({
    monthlyRent: 3500,
    rentalPeriod: 12,
    alternativeHousingCost: 18000,
    monthlyCosts: 300,
    monthlyDeductions: 500,
    numberOfInvoices: 1,
    minimumDesiredProfit: 5000,
  });

  // Separate state to control input values while user types
  const [inputValues, setInputValues] = useState<InputValues>({
    monthlyRent: '3500',
    rentalPeriod: '12',
    alternativeHousingCost: '18000',
    monthlyCosts: '300',
    monthlyDeductions: '500',
    numberOfInvoices: '1',
    minimumDesiredProfit: '5000',
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

  const calculateINSS = (prolabore: number) => {
    if (prolabore <= 0) return 0;
    
    // INSS is limited to the maximum ceiling
    const limitedProlabore = Math.min(prolabore, INSS_MAX_AMOUNT);
    
    const bracket = INSS_TABLE.find(b => limitedProlabore >= b.min && limitedProlabore <= b.max);
    if (!bracket) return 0;
    
    return Math.max(0, (limitedProlabore * bracket.rate / 100) - bracket.deduction);
  };

  const calculateProlaboreIRPF = (monthlyProlabore: number, monthlyINSS: number) => {
    const taxableIncome = monthlyProlabore - monthlyINSS;
    
    if (taxableIncome <= 0) return 0;
    
    const bracket = IR_TABLE.find(b => taxableIncome >= b.min && taxableIncome <= b.max);
    if (!bracket) return 0;
    
    return Math.max(0, (taxableIncome * bracket.rate / 100) - bracket.deduction);
  };

  const calculateProlaboreTaxes = (totalRevenue: number, numberOfInvoices: number) => {
    // Valor por nota (receita total dividida pelo número de notas)
    const revenuePerInvoice = totalRevenue / numberOfInvoices;
    
    // Pro-labore por nota (28% do valor da nota)
    const prolaborePerInvoice = revenuePerInvoice * PROLABORE_PERCENTAGE;
    
    // Calcular INSS por nota usando faixas progressivas
    const inssPerInvoice = calculateINSS(prolaborePerInvoice);
    
    // Calcular IRPF por nota (sobre o valor líquido)
    const irpfPerInvoice = calculateProlaboreIRPF(prolaborePerInvoice, inssPerInvoice);
    
    // Totais do período
    const totalINSS = inssPerInvoice * numberOfInvoices;
    const totalIRPF = irpfPerInvoice * numberOfInvoices;
    const totalProlabore = prolaborePerInvoice * numberOfInvoices;
    
    return {
      amount: totalProlabore,
      inss: totalINSS,
      irpf: totalIRPF,
      totalTax: totalINSS + totalIRPF,
      // Dados adicionais para exibição
      breakdown: {
        prolaborePerInvoice: prolaborePerInvoice, // Valor do pro-labore por nota
        monthlyProlaborePerInvoice: prolaborePerInvoice, // Mesmo valor (agora por nota, não por mês)
        inssPerInvoice: inssPerInvoice, // INSS por nota
        irpfPerInvoice: irpfPerInvoice, // IRPF por nota
        monthlyINSSPerInvoice: inssPerInvoice, // Mesmo valor (agora por nota, não por mês)
        monthlyIRPFPerInvoice: irpfPerInvoice, // Mesmo valor (agora por nota, não por mês)
      }
    };
  };

  const calculateResults = () => {
    const totalGrossIncome = data.monthlyRent * data.rentalPeriod;
    const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);

    // Pessoa Física (Imposto Progressivo)
    const monthlyPFTax = calculatePFTax(data.monthlyRent, data.monthlyDeductions);
    const totalPFTax = monthlyPFTax * data.rentalPeriod;
    const pfNetIncome = totalGrossIncome - totalPFTax;
    const pfFinalProfit = pfNetIncome - totalCosts;

    // Pessoa Jurídica (Simples Nacional 6% + Pró-labore)
    const simplesNacionalTax = totalGrossIncome * SIMPLES_NACIONAL_RATE;
    const prolaboreTaxes = calculateProlaboreTaxes(totalGrossIncome, data.numberOfInvoices);
    const totalPJTax = simplesNacionalTax + prolaboreTaxes.totalTax;
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
        finalProfit: pjFinalProfit,
        prolabore: prolaboreTaxes
      },
      bestOption
    });
  };

  useEffect(() => {
    calculateResults();
  }, [data]);

  const handleInputChange = (field: keyof RentalData, value: string) => {
    // Update input value immediately to keep typing smooth
    setInputValues(prev => ({ ...prev, [field]: value }));
    
    // Parse value and update numeric data
    let numericValue: number;
    if (field === 'rentalPeriod' || field === 'numberOfInvoices') {
      numericValue = parseNumberInput(value);
    } else {
      numericValue = parseCurrencyInput(value);
    }
    
    setData(prev => ({ ...prev, [field]: numericValue }));
  };

  const parseNumberInput = (value: string) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const loadExampleData = () => {
    const exampleData = {
      monthlyRent: 4000,
      rentalPeriod: 12,
      alternativeHousingCost: 20000,
      monthlyCosts: 400,
      monthlyDeductions: 600,
      numberOfInvoices: 2,
      minimumDesiredProfit: 8000,
    };
    
    setData(exampleData);
    setInputValues({
      monthlyRent: '4000',
      rentalPeriod: '12',
      alternativeHousingCost: '20000',
      monthlyCosts: '400',
      monthlyDeductions: '600',
      numberOfInvoices: '2',
      minimumDesiredProfit: '8000',
    });
  };

  const clearData = () => {
    const emptyData = {
      monthlyRent: 0,
      rentalPeriod: 12,
      alternativeHousingCost: 0,
      monthlyCosts: 0,
      monthlyDeductions: 0,
      numberOfInvoices: 1,
      minimumDesiredProfit: 0,
    };
    
    setData(emptyData);
    setInputValues({
      monthlyRent: '',
      rentalPeriod: '12',
      alternativeHousingCost: '',
      monthlyCosts: '',
      monthlyDeductions: '',
      numberOfInvoices: '1',
      minimumDesiredProfit: '',
    });
  };

  // Calculate maximum rent reduction while maintaining profitability
  const calculateRentReduction = () => {
    const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);
    const bestTaxRegime = results.bestOption;
    
    // Calculate what monthly rent would result in zero profit
    const breakEvenAnalysis = [];
    
    // Expand analysis to show more scenarios, going deeper into negative territory
    for (let reduction = 0; reduction <= 80; reduction += 5) {
      const reducedRent = data.monthlyRent * (1 - reduction / 100);
      const totalGrossIncome = reducedRent * data.rentalPeriod;
      
      let totalTax = 0;
      let netIncome = 0;
      let finalProfit = 0;
      
      if (bestTaxRegime === 'pf') {
        const monthlyPFTax = calculatePFTax(reducedRent, data.monthlyDeductions);
        totalTax = monthlyPFTax * data.rentalPeriod;
        netIncome = totalGrossIncome - totalTax;
        finalProfit = netIncome - totalCosts;
      } else {
        const simplesNacionalTax = totalGrossIncome * SIMPLES_NACIONAL_RATE;
        const prolaboreTaxes = calculateProlaboreTaxes(totalGrossIncome, data.numberOfInvoices);
        totalTax = simplesNacionalTax + prolaboreTaxes.totalTax;
        netIncome = totalGrossIncome - totalTax;
        finalProfit = netIncome - totalCosts;
      }
      
      breakEvenAnalysis.push({
        reduction,
        reducedRent,
        totalGrossIncome,
        totalTax,
        netIncome,
        finalProfit,
        isViable: finalProfit >= data.minimumDesiredProfit
      });
    }
    
    return breakEvenAnalysis;
  };

  const getViabilityMetrics = () => {
    const analysis = calculateRentReduction();
    const lastViable = analysis.filter(item => item.isViable).pop();
    const firstNonViable = analysis.find(item => !item.isViable);
    
    return {
      analysis,
      maxReduction: lastViable?.reduction || 0,
      minViableRent: lastViable?.reducedRent || data.monthlyRent,
      maxReductionAmount: data.monthlyRent - (lastViable?.reducedRent || data.monthlyRent),
      breakEvenPoint: firstNonViable?.reduction || 80
    };
  };

  // Calculate negotiation scenarios based on minimum desired profit
  const calculateNegotiationScenarios = () => {
    const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);
    const bestTaxRegime = results.bestOption;
    
    // Binary search to find minimum rent that achieves target profit
    let minRent = 0;
    let maxRent = data.monthlyRent * 2;
    let optimalRent = data.monthlyRent;
    
    for (let i = 0; i < 50; i++) { // 50 iterations should be enough for precision
      const testRent = (minRent + maxRent) / 2;
      const totalGrossIncome = testRent * data.rentalPeriod;
      
      let totalTax = 0;
      if (bestTaxRegime === 'pf') {
        const monthlyPFTax = calculatePFTax(testRent, data.monthlyDeductions);
        totalTax = monthlyPFTax * data.rentalPeriod;
      } else {
        const simplesNacionalTax = totalGrossIncome * SIMPLES_NACIONAL_RATE;
        const prolaboreTaxes = calculateProlaboreTaxes(totalGrossIncome, data.numberOfInvoices);
        totalTax = simplesNacionalTax + prolaboreTaxes.totalTax;
      }
      
      const netIncome = totalGrossIncome - totalTax;
      const finalProfit = netIncome - totalCosts;
      
      if (Math.abs(finalProfit - data.minimumDesiredProfit) < 10) {
        optimalRent = testRent;
        break;
      }
      
      if (finalProfit < data.minimumDesiredProfit) {
        minRent = testRent;
      } else {
        maxRent = testRent;
        optimalRent = testRent;
      }
    }
    
    // Generate scenarios
    const scenarios = [];
    const originalTotal = data.monthlyRent * data.rentalPeriod;
    
    // Add some negotiation scenarios - expanded range to show more scenarios
    const reductionAmounts = [0, 2000, 5000, 8000, 10000, 15000, 20000, 25000, 30000, 35000, 40000];
    
    for (const reduction of reductionAmounts) {
      const newTotal = originalTotal - reduction;
      const newMonthlyRent = newTotal / data.rentalPeriod;
      
      if (newMonthlyRent <= 0) continue;
      
      const totalGrossIncome = newTotal;
      let totalTax = 0;
      let netIncome = 0;
      let finalProfit = 0;
      
      if (bestTaxRegime === 'pf') {
        const monthlyPFTax = calculatePFTax(newMonthlyRent, data.monthlyDeductions);
        totalTax = monthlyPFTax * data.rentalPeriod;
        netIncome = totalGrossIncome - totalTax;
        finalProfit = netIncome - totalCosts;
      } else {
        const simplesNacionalTax = totalGrossIncome * SIMPLES_NACIONAL_RATE;
        const prolaboreTaxes = calculateProlaboreTaxes(totalGrossIncome, data.numberOfInvoices);
        totalTax = simplesNacionalTax + prolaboreTaxes.totalTax;
        netIncome = totalGrossIncome - totalTax;
        finalProfit = netIncome - totalCosts;
      }
      
      const meetsMinimum = finalProfit >= data.minimumDesiredProfit;
      
      scenarios.push({
        reduction,
        newTotal,
        newMonthlyRent,
        totalGrossIncome,
        totalTax,
        netIncome,
        finalProfit,
        meetsMinimum,
        reductionPercentage: (reduction / originalTotal) * 100
      });
    }
    
    return {
      scenarios,
      optimalRent,
      minViableTotal: optimalRent * data.rentalPeriod,
      maxReduction: originalTotal - (optimalRent * data.rentalPeriod)
    };
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
          
          {/* 2025 Tax Updates Badge */}
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-full">
            <span className="text-sm font-medium text-green-800">
              🆕 {language === 'pt' ? 'Tabelas Tributárias 2025 (IRPF/INSS Atualizadas)' : 'Updated 2025 Tax Tables (IRPF/INSS)'}
            </span>
          </div>
          
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
              <button
                onClick={() => setActiveTab('viability')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'viability'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t('viabilityAnalysis')}
              </button>
              <button
                onClick={() => setActiveTab('negotiation')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'negotiation'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t('negotiationHelper')}
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
                      value={inputValues.monthlyRent}
                      onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={language === 'pt' ? "3500" : "3500"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('rentalPeriod')}
                    </label>
                    <input
                      type="text"
                      value={inputValues.rentalPeriod}
                      onChange={(e) => handleInputChange('rentalPeriod', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('numberOfInvoices')}
                    </label>
                    <input
                      type="text"
                      value={inputValues.numberOfInvoices}
                      onChange={(e) => handleInputChange('numberOfInvoices', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('numberOfInvoicesHelper')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('alternativeHousingCost')}
                    </label>
                    <input
                      type="text"
                      value={inputValues.alternativeHousingCost}
                      onChange={(e) => handleInputChange('alternativeHousingCost', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={language === 'pt' ? "18000" : "18000"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('alternativeHousingHelper')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('minimumDesiredProfit')}
                    </label>
                    <input
                      type="text"
                      value={inputValues.minimumDesiredProfit}
                      onChange={(e) => handleInputChange('minimumDesiredProfit', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={language === 'pt' ? "5000" : "5000"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('minimumDesiredProfitHelper')}
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
                    </label>                      <input
                        type="text"
                        value={inputValues.monthlyCosts}
                        onChange={(e) => handleInputChange('monthlyCosts', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        placeholder={language === 'pt' ? "300" : "300"}
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
                      </label>                        <input
                          type="text"
                          value={inputValues.monthlyDeductions}
                          onChange={(e) => handleInputChange('monthlyDeductions', e.target.value)}
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white"
                          placeholder={language === 'pt' ? "500" : "500"}
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
                
                {/* Costs Breakdown */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-3">{t('costsBreakdown')}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">🏠 {t('alternativeHousing')}</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(data.alternativeHousingCost)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t('alternativeHousingHelper')}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">🔧 {t('propertyFixedCosts')}</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(data.monthlyCosts * data.rentalPeriod)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatCurrency(data.monthlyCosts)} × {data.rentalPeriod} {data.rentalPeriod === 1 ? (language === 'pt' ? 'mês' : 'month') : (language === 'pt' ? 'meses' : 'months')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('monthlyCortsHelper')}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Corporate Strategy Info */}
                {data.numberOfInvoices > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">📄 {language === 'pt' ? 'Estratégia PJ:' : 'Corporate Strategy:'}</span>
                      <span className="font-medium text-purple-600">
                        {data.numberOfInvoices} {language === 'pt' ? 'notas fiscais' : 'invoices'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Pró-labore por nota:</span>
                      <span className="font-medium text-purple-600">
                        {formatCurrency((data.monthlyRent * data.rentalPeriod * PROLABORE_PERCENTAGE) / data.numberOfInvoices)}
                      </span>
                    </div>
                  </div>
                )}
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
                      <div className="font-medium">{t('corporateRegime')}</div>                        <div className="mt-2 pt-2 border-t border-purple-200">
                        <div className="font-medium mb-1">Pró-labore (28% do faturamento):</div>
                        <div>• Total no período: {formatCurrency(results.pj.prolabore?.amount || 0)}</div>
                        <div>• INSS Total: {formatCurrency(results.pj.prolabore?.inss || 0)}</div>
                        <div>• IRPF Total: {formatCurrency(results.pj.prolabore?.irpf || 0)}</div>
                        
                        <div className="mt-2 pt-1 border-t border-purple-200 text-xs">
                          <div className="font-medium mb-1">Valores por nota fiscal:</div>
                          <div>• Valor por nota: {formatCurrency((data.monthlyRent * data.rentalPeriod) / data.numberOfInvoices)}</div>
                          <div>• Pró-labore por nota: {formatCurrency(results.pj.prolabore?.breakdown?.prolaborePerInvoice || 0)}</div>
                          <div>• INSS por nota (progressivo): {formatCurrency(results.pj.prolabore?.breakdown?.inssPerInvoice || 0)}</div>
                          <div>• IRPF por nota: {formatCurrency(results.pj.prolabore?.breakdown?.irpfPerInvoice || 0)}</div>
                          {data.numberOfInvoices > 1 && (
                            <div className="text-green-600 font-medium mt-1">
                              💡 {data.numberOfInvoices} notas totais = valores menores por nota = impostos otimizados
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Breakdown detalhado dos impostos PJ */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-3">Composição dos Impostos PJ:</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Simples Nacional (6%):</span>
                          <span className="font-medium">{formatCurrency((data.monthlyRent * data.rentalPeriod) * 0.06)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">INSS Pró-labore:</span>
                          <span className="font-medium">{formatCurrency(results.pj.prolabore?.inss || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IRPF Pró-labore:</span>
                          <span className="font-medium">{formatCurrency(results.pj.prolabore?.irpf || 0)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Impostos:</span>
                          <span>{formatCurrency(results.pj.totalTax)}</span>
                        </div>
                      </div>
                    </div>

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

            {/* Costs Summary */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-3" />
                {t('costsBreakdown')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Alternative Housing Cost */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center mb-3">
                    <Home className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="font-semibold text-red-800">{t('alternativeHousing')}</h4>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {formatCurrency(data.alternativeHousingCost)}
                  </div>
                  <p className="text-sm text-red-700">
                    {t('alternativeHousingHelper')}
                  </p>
                </div>

                {/* Property Fixed Costs */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center mb-3">
                    <Building className="w-5 h-5 text-orange-600 mr-2" />
                    <h4 className="font-semibold text-orange-800">{t('propertyFixedCosts')}</h4>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {formatCurrency(data.monthlyCosts * data.rentalPeriod)}
                  </div>
                  <p className="text-sm text-orange-700 mb-1">
                    {formatCurrency(data.monthlyCosts)}/mês × {data.rentalPeriod} {data.rentalPeriod === 1 ? (language === 'pt' ? 'mês' : 'month') : (language === 'pt' ? 'meses' : 'months')}
                  </p>
                  <p className="text-xs text-orange-600">
                    {t('monthlyCortsHelper')}
                  </p>
                </div>

                {/* Total Costs */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-300">
                  <div className="flex items-center mb-3">
                    <AlertCircle className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">{t('totalCosts')}</h4>
                  </div>
                  <div className="text-2xl font-bold text-gray-700 mb-2">
                    {formatCurrency(data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {language === 'pt' ? 'Soma de todos os custos do período' : 'Sum of all period costs'}
                  </p>
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

        {/* Viability Analysis Tab */}
        {activeTab === 'viability' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center py-6 px-8 rounded-xl shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center justify-center mb-2">
                <Calculator className="w-8 h-8 mr-3" />
                <h2 className="text-3xl font-bold">
                  {t('viabilityAnalysisTitle')}
                </h2>
              </div>
              <p className="text-xl opacity-90">
                {t('viabilitySubtitle')}
              </p>
            </div>

            {(() => {
              const viabilityData = getViabilityMetrics();
              return (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Maximum Reduction */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-lg">%</span>
                        </div>
                        <h3 className="font-semibold text-green-800">{t('maxReduction')}</h3>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {viabilityData.maxReduction}%
                      </div>
                      <p className="text-sm text-green-700">
                        {t('maxReductionDesc')}
                      </p>
                    </div>

                    {/* Minimum Viable Rent */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-lg">R$</span>
                        </div>
                        <h3 className="font-semibold text-blue-800">{t('minViableRent')}</h3>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {formatCurrency(viabilityData.minViableRent)}
                      </div>
                      <p className="text-sm text-blue-700">
                        {t('minViableRentDesc')}
                      </p>
                    </div>

                    {/* Maximum Discount Amount */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-lg">-</span>
                        </div>
                        <h3 className="font-semibold text-purple-800">{t('maxDiscountAmount')}</h3>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {formatCurrency(viabilityData.maxReductionAmount)}
                      </div>
                      <p className="text-sm text-purple-700">
                        {t('maxDiscountAmountDesc')}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Analysis Table */}
                  <div className="bg-white rounded-xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <AlertCircle className="w-6 h-6 mr-3" />
                      {t('detailedViabilityAnalysis')}
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('reduction')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('newRent')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('grossRevenue')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('taxes')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('netRevenue')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('finalProfit')}</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">{t('viable')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viabilityData.analysis.map((item, index) => (
                            <tr 
                              key={index} 
                              className={`border-b border-gray-100 ${
                                !item.isViable ? 'bg-red-50' : 
                                item.reduction === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="py-3 px-4 font-medium">
                                {item.reduction === 0 ? (
                                  <span className="text-blue-600 font-bold">{item.reduction}% (Atual)</span>
                                ) : (
                                  <span className={item.isViable ? 'text-green-600' : 'text-red-600'}>
                                    -{item.reduction}%
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">{formatCurrency(item.reducedRent)}</td>
                              <td className="py-3 px-4">{formatCurrency(item.totalGrossIncome)}</td>
                              <td className="py-3 px-4 text-red-600">{formatCurrency(item.totalTax)}</td>
                              <td className="py-3 px-4 text-green-600">{formatCurrency(item.netIncome)}</td>
                              <td className={`py-3 px-4 font-semibold ${
                                item.finalProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                {formatCurrency(item.finalProfit)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {item.isViable ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✅ {t('yes')}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ❌ {t('no')}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Strategic Insights */}
                    <div className="mt-8 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">{t('strategicInsights')}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {viabilityData.maxReduction > 0 ? (
                          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                            <h5 className="font-medium text-green-800 mb-2">💰 {t('pricingFlexibility')}</h5>
                            <p className="text-green-700 text-sm">
                              {language === 'pt' 
                                ? `Você pode reduzir até ${viabilityData.maxReduction}% do aluguel (${formatCurrency(viabilityData.maxReductionAmount)}) e ainda ter lucro.`
                                : `You can reduce up to ${viabilityData.maxReduction}% of rent (${formatCurrency(viabilityData.maxReductionAmount)}) and still profit.`
                              }
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                            <h5 className="font-medium text-red-800 mb-2">⚠️ {t('lowMargin')}</h5>
                            <p className="text-red-700 text-sm">
                              {t('lowMarginDesc')}
                            </p>
                          </div>
                        )}

                        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <h5 className="font-medium text-blue-800 mb-2">📊 {t('optimalStrategy')}</h5>
                          <p className="text-blue-700 text-sm">
                            {language === 'pt'
                              ? `Use ${results.bestOption === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'} para maximizar lucros neste cenário.`
                              : `Use ${results.bestOption === 'pf' ? 'Individual' : 'Corporate'} to maximize profits in this scenario.`
                            }
                          </p>
                        </div>

                        <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                          <h5 className="font-medium text-orange-800 mb-2">🚨 {language === 'pt' ? 'Ponto de Alerta' : 'Warning Point'}</h5>
                          <p className="text-orange-700 text-sm">
                            {language === 'pt'
                              ? `Reduções acima de ${viabilityData.maxReduction}% resultam em prejuízo. Cenários em vermelho na tabela mostram operações inviáveis.`
                              : `Reductions above ${viabilityData.maxReduction}% result in losses. Red scenarios in the table show unviable operations.`
                            }
                          </p>
                        </div>
                      </div>

                      {viabilityData.maxReduction >= 15 && (
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                          <h5 className="font-medium text-yellow-800 mb-2">🎯 {t('marketingTip')}</h5>
                          <p className="text-yellow-700 text-sm">
                            {t('marketingTipDesc')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Negotiation Helper Tab */}
        {activeTab === 'negotiation' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center py-6 px-8 rounded-xl shadow-lg bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 mr-3" />
                <h2 className="text-3xl font-bold">
                  {t('negotiationHelperTitle')}
                </h2>
              </div>
              <p className="text-xl opacity-90">
                {t('negotiationSubtitle')}
              </p>
            </div>

            {(() => {
              const negotiationData = calculateNegotiationScenarios();
              const originalTotal = data.monthlyRent * data.rentalPeriod;
              
              return (
                <>
                  {/* Key Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Current Offer */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-lg">💰</span>
                        </div>
                        <h3 className="font-semibold text-blue-800">{t('currentOffer')}</h3>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {formatCurrency(originalTotal)}
                      </div>
                      <div className="text-sm text-blue-700">
                        {formatCurrency(data.monthlyRent)}/mês × {data.rentalPeriod} meses
                      </div>
                    </div>

                    {/* Minimum Desired Profit */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-lg">🎯</span>
                        </div>
                        <h3 className="font-semibold text-green-800">{t('yourMinimumProfit')}</h3>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {formatCurrency(data.minimumDesiredProfit)}
                      </div>
                      <div className="text-sm text-green-700">
                        {t('minimumTarget')}
                      </div>
                    </div>

                    {/* Minimum Viable Offer */}
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-lg">⚠️</span>
                        </div>
                        <h3 className="font-semibold text-yellow-800">{t('minimumViableOffer')}</h3>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {formatCurrency(negotiationData.minViableTotal)}
                      </div>
                      <div className="text-sm text-yellow-700">
                        {t('lowestAcceptable')}
                      </div>
                    </div>

                    {/* Maximum Reduction */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 shadow-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-lg">📉</span>
                        </div>
                        <h3 className="font-semibold text-red-800">{t('maxPossibleReduction')}</h3>
                      </div>
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {formatCurrency(negotiationData.maxReduction)}
                      </div>
                      <div className="text-sm text-red-700">
                        {((negotiationData.maxReduction / originalTotal) * 100).toFixed(1)}% {t('discount')}
                      </div>
                    </div>
                  </div>

                  {/* Negotiation Scenarios Table */}
                  <div className="bg-white rounded-xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <AlertCircle className="w-6 h-6 mr-3" />
                      {t('negotiationScenarios')}
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('reduction')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('newTotalValue')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('newMonthlyRent')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('taxes')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('finalProfit')}</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">{t('decision')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {negotiationData.scenarios.map((scenario, index) => (
                            <tr 
                              key={index} 
                              className={`border-b border-gray-100 ${
                                !scenario.meetsMinimum ? 'bg-red-50' : 
                                scenario.reduction === 0 ? 'bg-blue-50' : 
                                scenario.finalProfit >= data.minimumDesiredProfit * 1.5 ? 'bg-green-50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="py-3 px-4 font-medium">
                                {scenario.reduction === 0 ? (
                                  <span className="text-blue-600 font-bold">Original</span>
                                ) : (
                                  <span className={scenario.meetsMinimum ? 'text-orange-600' : 'text-red-600'}>
                                    -{formatCurrency(scenario.reduction)} ({scenario.reductionPercentage.toFixed(1)}%)
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-semibold">{formatCurrency(scenario.newTotal)}</td>
                              <td className="py-3 px-4">{formatCurrency(scenario.newMonthlyRent)}</td>
                              <td className="py-3 px-4 text-red-600">{formatCurrency(scenario.totalTax)}</td>
                              <td className={`py-3 px-4 font-semibold ${
                                scenario.finalProfit >= data.minimumDesiredProfit ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatCurrency(scenario.finalProfit)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {scenario.meetsMinimum ? (
                                  scenario.finalProfit >= data.minimumDesiredProfit * 1.5 ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      ✅ {t('excellent')}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      ⚠️ {t('acceptable')}
                                    </span>
                                  )
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ❌ {t('reject')}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Negotiation Tips */}
                    <div className="mt-8 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">{t('negotiationTips')}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <h5 className="font-medium text-blue-800 mb-2">💡 {t('strongPosition')}</h5>
                          <p className="text-blue-700 text-sm">
                            {t('strongPositionDesc')}
                          </p>
                        </div>

                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                          <h5 className="font-medium text-yellow-800 mb-2">⚖️ {t('counterOffer')}</h5>
                          <p className="text-yellow-700 text-sm">
                            {t('counterOfferDesc')}
                          </p>
                        </div>

                        <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                          <h5 className="font-medium text-green-800 mb-2">🎯 {t('sweetSpot')}</h5>
                          <p className="text-green-700 text-sm">
                            {t('sweetSpotDesc')}
                          </p>
                        </div>

                        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                          <h5 className="font-medium text-red-800 mb-2">🚫 {t('walkAway')}</h5>
                          <p className="text-red-700 text-sm">
                            {t('walkAwayDesc', { amount: formatCurrency(negotiationData.minViableTotal) })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm space-y-2">
          <p className="flex items-center justify-center gap-2">
            💡 <strong>{t('footerDisclaimer')}</strong>
          </p>
          <p className="text-xs">
            {language === 'pt' 
              ? 'Baseado nas tabelas tributárias brasileiras de 2025 (IRPF vigente desde maio/2025 e INSS progressivo)'
              : 'Based on 2025 Brazilian tax tables (IRPF effective May 2025 and progressive INSS)'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HouseRentalSimulator;
