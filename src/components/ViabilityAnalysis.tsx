import { RentalData } from '../types';
import { calculatePFTax, calculateProlaboreTaxes } from '../utils/calculations';
import { TAX_CONSTANTS } from '../constants/taxTables';

interface ViabilityAnalysisProps {
  data: RentalData;
  language: 'pt' | 'en';
  t: (key: string) => string;
}

interface ViabilityScenario {
  discountPercent: number;
  newMonthlyRent: number;
  newTotalRevenue: number;
  newIndividualProfit: number;
  newCorporateProfit: number;
  bestOption: 'individual' | 'corporate';
  isViable: boolean;
}

export const ViabilityAnalysis = ({ data, language, t }: ViabilityAnalysisProps) => {
  // Calculate maximum reduction while maintaining positive profit
  const calculateMaxReduction = () => {
    let maxDiscountPercent = 0;
    
    // Search in increments of 5% to find maximum discount that keeps profit above minimum desired
    for (let discount = 0; discount <= 80; discount += 5) {
      const newMonthlyRent = data.monthlyRent * (1 - discount / 100);
      const newTotalRevenue = newMonthlyRent * data.rentalPeriod;
      const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);
      
      // Calculate Individual Tax
      const monthlyPFTax = calculatePFTax(newMonthlyRent, data.monthlyDeductions);
      const totalPFTax = monthlyPFTax * data.rentalPeriod;
      const newIndividualProfit = newTotalRevenue - totalPFTax - totalCosts;
      
      // Calculate Corporate Tax
      const simplesNacionalTax = newTotalRevenue * TAX_CONSTANTS.SIMPLES_NACIONAL_RATE;
      const prolaboreTaxes = calculateProlaboreTaxes(newTotalRevenue, data.numberOfInvoices);
      const totalPJTax = simplesNacionalTax + prolaboreTaxes.totalTax;
      const newCorporateProfit = newTotalRevenue - totalPJTax - totalCosts;
      
      const bestNewProfit = Math.max(newIndividualProfit, newCorporateProfit);
      
      if (bestNewProfit >= data.minimumDesiredProfit) {
        maxDiscountPercent = discount;
      } else {
        break;
      }
    }

    const maxDiscountAmount = data.monthlyRent * data.rentalPeriod * (maxDiscountPercent / 100);
    const minViableRent = data.monthlyRent * (1 - maxDiscountPercent / 100);
    
    return { maxDiscountPercent, maxDiscountAmount, minViableRent };
  };

  // Generate scenarios for different discount levels
  const generateScenarios = (): ViabilityScenario[] => {
    const scenarios: ViabilityScenario[] = [];
    const discountLevels = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
    
    discountLevels.forEach(discountPercent => {
      const newMonthlyRent = data.monthlyRent * (1 - discountPercent / 100);
      const newTotalRevenue = newMonthlyRent * data.rentalPeriod;
      const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);
      
      // Calculate Individual Tax
      const monthlyPFTax = calculatePFTax(newMonthlyRent, data.monthlyDeductions);
      const totalPFTax = monthlyPFTax * data.rentalPeriod;
      const newIndividualProfit = newTotalRevenue - totalPFTax - totalCosts;
      
      // Calculate Corporate Tax
      const simplesNacionalTax = newTotalRevenue * TAX_CONSTANTS.SIMPLES_NACIONAL_RATE;
      const prolaboreTaxes = calculateProlaboreTaxes(newTotalRevenue, data.numberOfInvoices);
      const totalPJTax = simplesNacionalTax + prolaboreTaxes.totalTax;
      const newCorporateProfit = newTotalRevenue - totalPJTax - totalCosts;
      
      const bestOption = newIndividualProfit >= newCorporateProfit ? 'individual' : 'corporate';
      const bestProfit = Math.max(newIndividualProfit, newCorporateProfit);
      const isViable = bestProfit >= data.minimumDesiredProfit;
      
      scenarios.push({
        discountPercent,
        newMonthlyRent,
        newTotalRevenue,
        newIndividualProfit,
        newCorporateProfit,
        bestOption,
        isViable
      });
    });
    
    return scenarios;
  };

  const { maxDiscountPercent, maxDiscountAmount, minViableRent } = calculateMaxReduction();
  const scenarios = generateScenarios();
  const currency = language === 'pt' ? 'R$' : '$';

  const formatCurrency = (value: number) => {
    return `${currency} ${Math.abs(value).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('viabilityAnalysisTitle')}
        </h2>
        <p className="text-gray-600">
          {t('viabilitySubtitle')}
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              📉 {t('maxReduction')}
            </h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {maxDiscountPercent.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">{t('maxReductionDesc')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              💰 {t('minViableRent')}
            </h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(minViableRent)}
            </div>
            <p className="text-sm text-gray-600">{t('minViableRentDesc')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              💸 {t('maxDiscountAmount')}
            </h3>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {formatCurrency(maxDiscountAmount)}
            </div>
            <p className="text-sm text-gray-600">{t('maxDiscountAmountDesc')}</p>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📊 {t('detailedViabilityAnalysis')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('reduction')}</th>
                <th className="text-left p-2">{t('newRent')}</th>
                <th className="text-left p-2">{t('grossRevenue')}</th>
                <th className="text-left p-2">{t('individual')}</th>
                <th className="text-left p-2">{t('corporate')}</th>
                <th className="text-left p-2">{t('bestOption')}</th>
                <th className="text-left p-2">{t('viable')}</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, index) => {
                const bestProfit = Math.max(scenario.newIndividualProfit, scenario.newCorporateProfit);
                const isBelowMinimum = bestProfit < data.minimumDesiredProfit;
                
                return (
                  <tr key={index} className={`border-b transition-colors hover:bg-gray-100 ${
                    isBelowMinimum ? 'bg-red-100 hover:bg-red-200' : 
                    scenario.discountPercent === 0 ? 'bg-blue-100 hover:bg-blue-200' :
                    scenario.discountPercent <= 15 ? 'bg-green-100 hover:bg-green-200' :
                    scenario.discountPercent <= 30 ? 'bg-yellow-100 hover:bg-yellow-200' :
                    'bg-orange-100 hover:bg-orange-200'
                  }`}>
                    <td className="p-2 font-medium">
                      {scenario.discountPercent}%
                      {scenario.discountPercent === 0 && (
                        <span className="ml-2 text-xs bg-blue-300 text-blue-900 px-1 rounded font-bold">ORIGINAL</span>
                      )}
                      {isBelowMinimum && (
                        <span className="ml-2 text-xs bg-red-300 text-red-900 px-1 rounded font-bold">BAIXO</span>
                      )}
                    </td>
                    <td className="p-2">
                      {formatCurrency(scenario.newMonthlyRent)}
                    </td>
                    <td className="p-2">
                      {formatCurrency(scenario.newTotalRevenue)}
                    </td>
                    <td className="p-2">
                      <span className={scenario.newIndividualProfit >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                        {formatCurrency(scenario.newIndividualProfit)}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={scenario.newCorporateProfit >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                        {formatCurrency(scenario.newCorporateProfit)}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        scenario.bestOption === 'individual' 
                          ? 'bg-blue-200 text-blue-900' 
                          : 'bg-purple-200 text-purple-900'
                      }`}>
                        {t(scenario.bestOption)}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        scenario.isViable 
                          ? 'bg-green-200 text-green-900' 
                          : 'bg-red-200 text-red-900'
                      }`}>
                        {scenario.isViable ? t('yes') : t('no')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {t('strategicInsights')}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <strong>{t('pricingFlexibility')}:</strong> {' '}
              {maxDiscountPercent < 10 ? (
                <>
                  <span className="text-orange-600 font-medium">{t('lowMargin')}</span> - {t('lowMarginDesc')}
                </>
              ) : (
                <>
                  <span className="text-green-600 font-medium">{t('optimalStrategy')}</span> - {' '}
                  {maxDiscountPercent > 25 ? 
                    `${t('marketingTipDesc')} Você pode oferecer até ${maxDiscountPercent.toFixed(1)}% de desconto!` :
                    t('marketingTipDesc')
                  }
                </>
              )}
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <strong>{t('marketingTip')}:</strong> {' '}
              {maxDiscountPercent > 15 ? 
                `Com ${maxDiscountPercent.toFixed(1)}% de margem, você pode ser agressivo nas negociações.` :
                'Margem moderada - negocie cuidadosamente.'
              }
            </div>
          </div>
          
          {/* Additional Strategic Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <strong>📈 Ponto de Equilíbrio:</strong><br/>
              <span className="text-lg font-bold text-yellow-700">
                {formatCurrency(data.minimumDesiredProfit / data.rentalPeriod)}
              </span>
              <p className="text-sm text-gray-600 mt-1">Aluguel mínimo mensal para atingir sua meta</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <strong>🎯 Taxa de Lucro:</strong><br/>
              <span className="text-lg font-bold text-purple-700">
                {((data.minimumDesiredProfit / (data.monthlyRent * data.rentalPeriod)) * 100).toFixed(1)}%
              </span>
              <p className="text-sm text-gray-600 mt-1">Margem de lucro desejada sobre receita bruta</p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <strong>💼 Flexibilidade Total:</strong><br/>
              <span className="text-lg font-bold text-indigo-700">
                {formatCurrency(maxDiscountAmount)}
              </span>
              <p className="text-sm text-gray-600 mt-1">Valor total que pode ser negociado</p>
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <strong>⚠️ Análise de Risco:</strong><br/>
            {maxDiscountPercent < 10 && (
              <span className="text-red-600">
                Margem muito apertada! Qualquer imprevisto pode comprometer a lucratividade.
              </span>
            )}
            {maxDiscountPercent >= 10 && maxDiscountPercent < 25 && (
              <span className="text-orange-600">
                Margem moderada. Tenha uma reserva para imprevistos de pelo menos 10% do valor total.
              </span>
            )}
            {maxDiscountPercent >= 25 && (
              <span className="text-green-600">
                Boa margem de segurança! Você pode absorver imprevistos e ser flexível nas negociações.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
