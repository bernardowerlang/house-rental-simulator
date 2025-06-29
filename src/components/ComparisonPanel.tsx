import React from 'react';
import { Crown, Users, Building, Calculator, Home, AlertCircle } from 'lucide-react';
import { RentalData, ComparisonResults } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ComparisonPanelProps {
  data: RentalData;
  results: ComparisonResults;
  language: 'pt' | 'en';
  t: (key: string, params?: Record<string, any>) => string;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  data,
  results,
  language,
  t
}) => {
  return (
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
            amount: formatCurrency(Math.abs(results.pf.finalProfit - results.pj.finalProfit), language) 
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
                <div>{t('taxBase')} {formatCurrency(data.monthlyRent - data.monthlyDeductions, language)}/mês</div>
                <div>{t('monthlyTax')} {formatCurrency(results.pf.totalTax / data.rentalPeriod, language)}</div>
                <div className="font-medium">{t('progressiveTable')}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="font-medium text-gray-700">{t('totalTax')}</span>
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(results.pf.totalTax, language)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="font-medium text-gray-700">{t('netRevenue')}</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(results.pf.netIncome, language)}
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
                  {formatCurrency(results.pf.finalProfit, language)}
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
                <div>{t('taxBase')} {formatCurrency(data.monthlyRent * data.rentalPeriod, language)}</div>
                <div>{t('corporateRate')}</div>
                <div className="font-medium">{t('corporateRegime')}</div>
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <div className="font-medium mb-1">Pró-labore (28% do faturamento):</div>
                  <div>• Total no período: {formatCurrency(results.pj.prolabore?.amount || 0, language)}</div>
                  <div>• INSS Total: {formatCurrency(results.pj.prolabore?.inss || 0, language)}</div>
                  <div>• IRPF Total: {formatCurrency(results.pj.prolabore?.irpf || 0, language)}</div>
                  
                  <div className="mt-2 pt-1 border-t border-purple-200 text-xs">
                    <div className="font-medium mb-1">Valores por nota fiscal:</div>
                    <div>• Valor por nota: {formatCurrency((data.monthlyRent * data.rentalPeriod) / data.numberOfInvoices, language)}</div>
                    <div>• Pró-labore por nota: {formatCurrency(results.pj.prolabore?.breakdown?.prolaborePerInvoice || 0, language)}</div>
                    <div>• INSS por nota (progressivo): {formatCurrency(results.pj.prolabore?.breakdown?.inssPerInvoice || 0, language)}</div>
                    <div>• IRPF por nota: {formatCurrency(results.pj.prolabore?.breakdown?.irpfPerInvoice || 0, language)}</div>
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
                    <span className="font-medium">{formatCurrency((data.monthlyRent * data.rentalPeriod) * 0.06, language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">INSS Pró-labore:</span>
                    <span className="font-medium">{formatCurrency(results.pj.prolabore?.inss || 0, language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IRPF Pró-labore:</span>
                    <span className="font-medium">{formatCurrency(results.pj.prolabore?.irpf || 0, language)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Impostos:</span>
                    <span>{formatCurrency(results.pj.totalTax, language)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="font-medium text-gray-700">{t('totalTax')}</span>
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(results.pj.totalTax, language)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="font-medium text-gray-700">{t('netRevenue')}</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(results.pj.netIncome, language)}
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
                  {formatCurrency(results.pj.finalProfit, language)}
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
              {formatCurrency(data.alternativeHousingCost, language)}
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
              {formatCurrency(data.monthlyCosts * data.rentalPeriod, language)}
            </div>
            <p className="text-sm text-orange-700 mb-1">
              {formatCurrency(data.monthlyCosts, language)}/mês × {data.rentalPeriod} {data.rentalPeriod === 1 ? (language === 'pt' ? 'mês' : 'month') : (language === 'pt' ? 'meses' : 'months')}
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
              {formatCurrency(data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod), language)}
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
                <span className="font-bold text-red-600">{formatCurrency(results.pf.totalTax, language)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('corporate')}:</span>
                <span className="font-bold text-red-600">{formatCurrency(results.pj.totalTax, language)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{t('difference')}</span>
                  <span className={`font-bold ${
                    results.pf.totalTax > results.pj.totalTax ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(Math.abs(results.pf.totalTax - results.pj.totalTax), language)}
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
                  {formatCurrency(results.pf.finalProfit, language)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('corporate')}:</span>
                <span className={`font-bold ${results.pj.finalProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(results.pj.finalProfit, language)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{t('advantage')}</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(Math.abs(results.pf.finalProfit - results.pj.finalProfit), language)}
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
  );
};
