import React, { useState } from 'react';
import { Calculator, Home } from 'lucide-react';
import { useTranslation } from './hooks/useTranslation';
import { useRentalCalculations } from './hooks/useRentalCalculations';
import { InputForm } from './components/InputForm';
import { ComparisonPanel } from './components/ComparisonPanel';
import { RentalData, InputValues, TabType } from './types';
import { parseNumberInput, parseCurrencyInput } from './utils/calculations';

const HouseRentalSimulator: React.FC = () => {
  const { t, language, changeLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('input');
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

  const results = useRentalCalculations(data);

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

        {/* Tab Content */}
        {activeTab === 'input' && (
          <InputForm
            data={data}
            inputValues={inputValues}
            language={language}
            t={t}
            onInputChange={handleInputChange}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonPanel
            data={data}
            results={results}
            language={language}
            t={t}
          />
        )}

        {activeTab === 'viability' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('viabilityAnalysis')} - Em Desenvolvimento
            </h2>
            <p className="text-gray-600">
              Esta seção será implementada em breve com a análise de viabilidade refatorada.
            </p>
          </div>
        )}

        {activeTab === 'negotiation' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('negotiationHelper')} - Em Desenvolvimento
            </h2>
            <p className="text-gray-600">
              Esta seção será implementada em breve com o assistente de negociação refatorado.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm space-y-2">
          <p className="flex items-center justify-center gap-2">
            💡 <strong>
              {language === 'pt' 
                ? 'Simulador educativo - Sempre consulte um contador para decisões fiscais!'
                : 'Educational simulator - Always consult an accountant for tax decisions!'
              }
            </strong>
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
