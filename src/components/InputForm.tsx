import React from 'react';
import { Calculator, Users } from 'lucide-react';
import { RentalData, InputValues } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TAX_CONSTANTS } from '../constants/taxTables';

interface InputFormProps {
  data: RentalData;
  inputValues: InputValues;
  language: 'pt' | 'en';
  t: (key: string, params?: Record<string, any>) => string;
  onInputChange: (field: keyof RentalData, value: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  data,
  inputValues,
  language,
  t,
  onInputChange
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <Calculator className="w-6 h-6 mr-3" />
          {t('simulationData')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Data */}
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
                onChange={(e) => onInputChange('monthlyRent', e.target.value)}
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
                onChange={(e) => onInputChange('rentalPeriod', e.target.value)}
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
                onChange={(e) => onInputChange('numberOfInvoices', e.target.value)}
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
                onChange={(e) => onInputChange('alternativeHousingCost', e.target.value)}
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
                onChange={(e) => onInputChange('minimumDesiredProfit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder={language === 'pt' ? "5000" : "5000"}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('minimumDesiredProfitHelper')}
              </p>
            </div>
          </div>

          {/* Costs and Deductions */}
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
                value={inputValues.monthlyCosts}
                onChange={(e) => onInputChange('monthlyCosts', e.target.value)}
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
                </label>
                <input
                  type="text"
                  value={inputValues.monthlyDeductions}
                  onChange={(e) => onInputChange('monthlyDeductions', e.target.value)}
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
                {formatCurrency(data.monthlyRent * data.rentalPeriod, language)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">{t('totalCosts')}</span>
              <div className="font-bold text-red-600 text-lg">
                {formatCurrency(data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod), language)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">{t('beforeTaxes')}</span>
              <div className="font-bold text-blue-600 text-lg">
                {formatCurrency((data.monthlyRent * data.rentalPeriod) - (data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod)), language)}
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
                    {formatCurrency(data.alternativeHousingCost, language)}
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
                    {formatCurrency(data.monthlyCosts * data.rentalPeriod, language)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatCurrency(data.monthlyCosts, language)} × {data.rentalPeriod} {data.rentalPeriod === 1 ? (language === 'pt' ? 'mês' : 'month') : (language === 'pt' ? 'meses' : 'months')}
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
                  {formatCurrency((data.monthlyRent * data.rentalPeriod * TAX_CONSTANTS.PROLABORE_PERCENTAGE) / data.numberOfInvoices, language)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
