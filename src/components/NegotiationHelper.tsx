import { useState } from 'react';
import { RentalData } from '../types';
import { calculatePFTax, calculateProlaboreTaxes, parseCurrencyInput } from '../utils/calculations';
import { TAX_CONSTANTS } from '../constants/taxTables';

interface NegotiationHelperProps {
  data: RentalData;
  language: 'pt' | 'en';
  t: (key: string) => string;
}

interface NegotiationScenario {
  discountPercent: number;
  newMonthlyRent: number;
  newTotalRevenue: number;
  newIndividualProfit: number;
  newCorporateProfit: number;
  bestOption: 'individual' | 'corporate';
  bestProfit: number;
  decision: 'excellent' | 'acceptable' | 'reject';
}

export const NegotiationHelper = ({ data, language, t }: NegotiationHelperProps) => {
  const [negotiationRent, setNegotiationRent] = useState<string>(data.monthlyRent.toString());
  const [negotiationRentValue, setNegotiationRentValue] = useState<number>(data.monthlyRent);

  const currency = language === 'pt' ? 'R$' : '$';

  const formatCurrency = (value: number) => {
    return `${currency} ${Math.abs(value).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handleNegotiationRentChange = (value: string) => {
    setNegotiationRent(value);
    const numericValue = parseCurrencyInput(value);
    setNegotiationRentValue(numericValue);
  };

  // Calculate minimum viable offer
  const calculateMinimumViableOffer = () => {
    // Binary search to find minimum rent that meets minimum desired profit
    let low = 0;
    let high = data.monthlyRent * 2;
    let result = data.monthlyRent;
    
    while (high - low > 1) {
      const mid = (low + high) / 2;
      const totalRevenue = mid * data.rentalPeriod;
      const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);
      
      // Calculate Individual Tax
      const monthlyPFTax = calculatePFTax(mid, data.monthlyDeductions);
      const totalPFTax = monthlyPFTax * data.rentalPeriod;
      const individualProfit = totalRevenue - totalPFTax - totalCosts;
      
      // Calculate Corporate Tax
      const simplesNacionalTax = totalRevenue * TAX_CONSTANTS.SIMPLES_NACIONAL_RATE;
      const prolaboreTaxes = calculateProlaboreTaxes(totalRevenue, data.numberOfInvoices);
      const totalPJTax = simplesNacionalTax + prolaboreTaxes.totalTax;
      const corporateProfit = totalRevenue - totalPJTax - totalCosts;
      
      const bestProfit = Math.max(individualProfit, corporateProfit);
      
      if (bestProfit >= data.minimumDesiredProfit) {
        result = mid;
        high = mid;
      } else {
        low = mid;
      }
    }
    
    return result;
  };

  // Calculate analysis for current negotiation
  const calculateNegotiationAnalysis = () => {
    const originalTotalRevenue = data.monthlyRent * data.rentalPeriod;
    const newTotalRevenue = negotiationRentValue * data.rentalPeriod;
    const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);
    
    // Calculate Individual Tax for new rent
    const monthlyPFTax = calculatePFTax(negotiationRentValue, data.monthlyDeductions);
    const totalPFTax = monthlyPFTax * data.rentalPeriod;
    const newIndividualProfit = newTotalRevenue - totalPFTax - totalCosts;
    
    // Calculate Corporate Tax for new rent
    const simplesNacionalTax = newTotalRevenue * TAX_CONSTANTS.SIMPLES_NACIONAL_RATE;
    const prolaboreTaxes = calculateProlaboreTaxes(newTotalRevenue, data.numberOfInvoices);
    const totalPJTax = simplesNacionalTax + prolaboreTaxes.totalTax;
    const newCorporateProfit = newTotalRevenue - totalPJTax - totalCosts;
    
    const bestOption = newIndividualProfit >= newCorporateProfit ? 'individual' : 'corporate';
    const bestProfit = Math.max(newIndividualProfit, newCorporateProfit);
    
    const discountPercent = ((data.monthlyRent - negotiationRentValue) / data.monthlyRent) * 100;
    const discountAmount = originalTotalRevenue - newTotalRevenue;
    
    return {
      discountPercent,
      discountAmount,
      newTotalRevenue,
      newIndividualProfit,
      newCorporateProfit,
      bestOption,
      bestProfit,
      totalPFTax,
      totalPJTax
    };
  };

  // Generate scenarios for negotiation
  const generateNegotiationScenarios = (): NegotiationScenario[] => {
    const scenarios: NegotiationScenario[] = [];
    const discountLevels = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
    
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
      
      let decision: 'excellent' | 'acceptable' | 'reject';
      if (bestProfit >= data.minimumDesiredProfit * 1.2) {
        decision = 'excellent';
      } else if (bestProfit >= data.minimumDesiredProfit) {
        decision = 'acceptable';
      } else {
        decision = 'reject';
      }
      
      scenarios.push({
        discountPercent,
        newMonthlyRent,
        newTotalRevenue,
        newIndividualProfit,
        newCorporateProfit,
        bestOption,
        bestProfit,
        decision
      });
    });
    
    return scenarios;
  };

  const minViableOffer = calculateMinimumViableOffer();
  const maxDiscountPercent = ((data.monthlyRent - minViableOffer) / data.monthlyRent) * 100;
  const negotiationAnalysis = calculateNegotiationAnalysis();
  const scenarios = generateNegotiationScenarios();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('negotiationHelperTitle')}
        </h2>
        <p className="text-gray-600">
          {t('negotiationSubtitle')}
        </p>
      </div>

      {/* Current Negotiation Input */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🎯 {t('currentOffer')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('newMonthlyRent')}
            </label>
            <input
              type="text"
              value={negotiationRent}
              onChange={(e) => handleNegotiationRentChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={formatCurrency(data.monthlyRent)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('discount')}:</span>
              <span className="font-medium">
                {negotiationAnalysis.discountPercent.toFixed(1)}% 
                ({formatCurrency(negotiationAnalysis.discountAmount)})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('newTotalValue')}:</span>
              <span className="font-medium">{formatCurrency(negotiationAnalysis.newTotalRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('bestOption')}:</span>
              <span className={`font-medium px-2 py-1 rounded text-xs ${
                negotiationAnalysis.bestOption === 'individual' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {t(negotiationAnalysis.bestOption)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              💼 {t('yourMinimumProfit')}
            </h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {formatCurrency(data.minimumDesiredProfit)}
            </div>
            <p className="text-sm text-gray-600">{t('minimumTarget')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              🚨 {t('minimumViableOffer')}
            </h3>
            <div className="text-2xl font-bold text-red-600 mb-2">
              {formatCurrency(minViableOffer)}
            </div>
            <p className="text-sm text-gray-600">{t('lowestAcceptable')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              📊 {t('maxPossibleReduction')}
            </h3>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {((data.monthlyRent - minViableOffer) / data.monthlyRent * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">{t('maxPossibleReduction')}</p>
          </div>
        </div>
      </div>

      {/* Negotiation Scenarios Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📋 {t('negotiationScenarios')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('reduction')}</th>
                <th className="text-left p-2">{t('newMonthlyRent')}</th>
                <th className="text-left p-2">{t('newTotalValue')}</th>
                <th className="text-left p-2">{t('bestOption')}</th>
                <th className="text-left p-2">{t('netProfit')}</th>
                <th className="text-left p-2">{t('decision')}</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, index) => {
                const isBelowMinimum = scenario.bestProfit < data.minimumDesiredProfit;
                
                return (
                  <tr key={index} className={`border-b transition-colors hover:bg-gray-100 ${
                    isBelowMinimum ? 'bg-red-100 hover:bg-red-200' : 
                    scenario.decision === 'excellent' ? 'bg-green-100 hover:bg-green-200' : 
                    'bg-yellow-100 hover:bg-yellow-200'
                  }`}>
                    <td className="p-2 font-medium">
                      {scenario.discountPercent.toFixed(1)}%
                      {scenario.discountPercent === 0 && (
                        <span className="ml-2 text-xs bg-blue-300 text-blue-900 px-1 rounded font-bold">ATUAL</span>
                      )}
                      {scenario.discountPercent <= 10 && scenario.discountPercent > 0 && (
                        <span className="ml-2 text-xs bg-green-300 text-green-900 px-1 rounded font-bold">ÓTIMO</span>
                      )}
                      {isBelowMinimum && (
                        <span className="ml-2 text-xs bg-red-300 text-red-900 px-1 rounded font-bold">BAIXO</span>
                      )}
                    </td>
                    <td className="p-2">
                      {formatCurrency(scenario.newMonthlyRent)}
                      <div className="text-xs text-gray-600">
                        {scenario.discountPercent > 0 && `(-${formatCurrency((data.monthlyRent - scenario.newMonthlyRent) * data.rentalPeriod)})`}
                      </div>
                    </td>
                    <td className="p-2">
                      {formatCurrency(scenario.newTotalRevenue)}
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
                      <span className={`font-bold ${
                        scenario.bestProfit >= data.minimumDesiredProfit ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(scenario.bestProfit)}
                      </span>
                      <div className={`text-xs ${
                        scenario.bestProfit >= data.minimumDesiredProfit ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {((scenario.bestProfit / data.minimumDesiredProfit) * 100).toFixed(0)}% da meta
                      </div>
                    </td>
                    <td className="p-2">
                      <span className={`px-3 py-1 rounded text-xs font-bold ${
                        scenario.decision === 'excellent' ? 'bg-green-200 text-green-900' :
                        scenario.decision === 'acceptable' ? 'bg-yellow-200 text-yellow-900' :
                        'bg-red-200 text-red-900'
                      }`}>
                        {t(scenario.decision)}
                      </span>
                      {scenario.decision === 'excellent' && (
                        <div className="text-xs text-green-700 mt-1 font-medium">✅ Aceite</div>
                      )}
                      {scenario.decision === 'acceptable' && (
                        <div className="text-xs text-yellow-700 mt-1 font-medium">⚖️ Negocie</div>
                      )}
                      {scenario.decision === 'reject' && (
                        <div className="text-xs text-red-700 mt-1 font-medium">❌ Recuse</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Negotiation Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {t('negotiationTips')}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <strong>{t('strongPosition')}:</strong> {' '}
              {negotiationAnalysis.bestProfit > data.minimumDesiredProfit * 1.2 ? (
                <>
                  <span className="text-green-600 font-medium">{t('excellent')}</span> - {t('strongPositionDesc')}
                </>
              ) : (
                <>
                  <span className="text-yellow-600 font-medium">{t('acceptable')}</span> - {t('counterOfferDesc')}
                </>
              )}
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <strong>{t('counterOffer')}:</strong> {t('counterOfferDesc')}
            </div>
          </div>
          
          {/* Tactical Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <strong>🎯 Zona de Conforto:</strong><br/>
              <span className="text-lg font-bold text-indigo-700">
                {formatCurrency(minViableOffer)} - {formatCurrency(data.monthlyRent * 0.95)}
              </span>
              <p className="text-sm text-gray-600 mt-1">Faixa ideal para iniciar negociações</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <strong>💡 Estratégia Recomendada:</strong><br/>
              {negotiationAnalysis.discountPercent <= 10 && (
                <span className="text-green-600 font-medium">Aceite rapidamente</span>
              )}
              {negotiationAnalysis.discountPercent > 10 && negotiationAnalysis.discountPercent <= 25 && (
                <span className="text-blue-600 font-medium">Negocie termos extras</span>
              )}
              {negotiationAnalysis.discountPercent > 25 && (
                <span className="text-orange-600 font-medium">Contra-oferte</span>
              )}
              <p className="text-sm text-gray-600 mt-1">
                {negotiationAnalysis.discountPercent <= 10 && "Desconto baixo, boa oferta"}
                {negotiationAnalysis.discountPercent > 10 && negotiationAnalysis.discountPercent <= 25 && "Peça prazo maior ou garantias"}
                {negotiationAnalysis.discountPercent > 25 && "Desconto alto, reavalie"}
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <strong>⚡ Poder de Barganha:</strong><br/>
              <span className="text-lg font-bold text-yellow-700">
                {((maxDiscountPercent - negotiationAnalysis.discountPercent) / maxDiscountPercent * 100).toFixed(0)}%
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {((maxDiscountPercent - negotiationAnalysis.discountPercent) / maxDiscountPercent * 100) > 50 ? 
                  "Você tem vantagem" : "Negociação equilibrada"}
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <strong>{t('sweetSpot')}:</strong> {' '}
            {t('sweetSpotDesc').replace('{amount}', formatCurrency(minViableOffer))}
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <strong>{t('walkAway')}:</strong> {' '}
            {t('walkAwayDesc').replace('{amount}', formatCurrency(minViableOffer))}
          </div>

          {/* Advanced Negotiation Tactics */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <strong>🎨 Táticas Avançadas de Negociação:</strong>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="text-sm">
                <strong>Se pedirem mais de {((maxDiscountPercent * 0.7)).toFixed(1)}% desconto:</strong>
                <ul className="list-disc list-inside text-gray-600 ml-2">
                  <li>Proponha contrato mais longo</li>
                  <li>Peça garantias adicionais</li>
                  <li>Negocie reajustes anuais</li>
                </ul>
              </div>
              <div className="text-sm">
                <strong>Para fechar rapidamente:</strong>
                <ul className="list-disc list-inside text-gray-600 ml-2">
                  <li>Ofereça {(maxDiscountPercent * 0.3).toFixed(1)}% desconto</li>
                  <li>Inclua benefícios extras</li>
                  <li>Estabeleça prazo de decisão</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
