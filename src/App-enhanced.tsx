import React, { useState, useEffect } from 'react';
import { Calculator, Home, TrendingUp, TrendingDown, DollarSign, AlertCircle, BarChart3, PieChart } from 'lucide-react';

interface RentalData {
  monthlyRent: number;
  alternativeHousingCost: number;
  utilitiesOwn: number;
  utilitiesAlternative: number;
  internetOwn: number;
  internetAlternative: number;
  maintenanceCost: number;
  taxRate: number;
  realEstateFee: number;
  insuranceCost: number;
  otherExpenses: number;
  rentalPeriod: number;
}

interface Results {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  monthlyNetProfit: number;
  roi: number;
  expenseBreakdown: {
    taxes: number;
    realEstateFee: number;
    alternativeHousing: number;
    utilities: number;
    internet: number;
    maintenance: number;
    insurance: number;
    others: number;
  };
}

const HouseRentalSimulator: React.FC = () => {
  const [data, setData] = useState<RentalData>({
    monthlyRent: 3000,
    alternativeHousingCost: 1500,
    utilitiesOwn: 200,
    utilitiesAlternative: 150,
    internetOwn: 100,
    internetAlternative: 0,
    maintenanceCost: 200,
    taxRate: 27.5,
    realEstateFee: 8,
    insuranceCost: 50,
    otherExpenses: 100,
    rentalPeriod: 12,
  });

  const [results, setResults] = useState<Results>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    monthlyNetProfit: 0,
    roi: 0,
    expenseBreakdown: {
      taxes: 0,
      realEstateFee: 0,
      alternativeHousing: 0,
      utilities: 0,
      internet: 0,
      maintenance: 0,
      insurance: 0,
      others: 0,
    },
  });

  const calculateResults = () => {
    const grossIncome = data.monthlyRent * data.rentalPeriod;
    const taxes = (grossIncome * data.taxRate) / 100;
    const realEstateFee = (grossIncome * data.realEstateFee) / 100;
    
    const alternativeHousing = data.alternativeHousingCost * data.rentalPeriod;
    const utilities = (data.utilitiesAlternative - data.utilitiesOwn) * data.rentalPeriod;
    const internet = (data.internetAlternative - data.internetOwn) * data.rentalPeriod;
    const maintenance = data.maintenanceCost * data.rentalPeriod;
    const insurance = data.insuranceCost * data.rentalPeriod;
    const others = data.otherExpenses * data.rentalPeriod;

    const totalExpenses = taxes + realEstateFee + alternativeHousing + utilities + internet + maintenance + insurance + others;
    const netProfit = grossIncome - totalExpenses;
    const monthlyNetProfit = netProfit / data.rentalPeriod;
    const roi = data.monthlyRent > 0 ? (monthlyNetProfit / data.monthlyRent) * 100 : 0;

    setResults({
      totalIncome: grossIncome,
      totalExpenses,
      netProfit,
      monthlyNetProfit,
      roi,
      expenseBreakdown: {
        taxes,
        realEstateFee,
        alternativeHousing,
        utilities,
        internet,
        maintenance,
        insurance,
        others,
      },
    });
  };

  useEffect(() => {
    calculateResults();
  }, [data]);

  const handleInputChange = (field: keyof RentalData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const loadExampleData = () => {
    setData({
      monthlyRent: 3500,
      alternativeHousingCost: 1800,
      utilitiesOwn: 250,
      utilitiesAlternative: 0, // Incluído no aluguel alternativo
      internetOwn: 120,
      internetAlternative: 0, // Incluído no aluguel alternativo
      maintenanceCost: 300,
      taxRate: 27.5,
      realEstateFee: 8,
      insuranceCost: 80,
      otherExpenses: 150,
      rentalPeriod: 12,
    });
  };

  const clearData = () => {
    setData({
      monthlyRent: 0,
      alternativeHousingCost: 0,
      utilitiesOwn: 0,
      utilitiesAlternative: 0,
      internetOwn: 0,
      internetAlternative: 0,
      maintenanceCost: 0,
      taxRate: 27.5,
      realEstateFee: 8,
      insuranceCost: 0,
      otherExpenses: 0,
      rentalPeriod: 12,
    });
  };

  const getExpensePercentages = () => {
    if (results.totalExpenses === 0) return [];
    
    return [
      { name: 'Impostos', value: results.expenseBreakdown.taxes, color: '#ef4444' },
      { name: 'Taxa Imobiliária', value: results.expenseBreakdown.realEstateFee, color: '#f97316' },
      { name: 'Moradia Alternativa', value: results.expenseBreakdown.alternativeHousing, color: '#eab308' },
      { name: 'Utilidades', value: Math.max(0, results.expenseBreakdown.utilities), color: '#22c55e' },
      { name: 'Internet', value: Math.max(0, results.expenseBreakdown.internet), color: '#3b82f6' },
      { name: 'Manutenção', value: results.expenseBreakdown.maintenance, color: '#8b5cf6' },
      { name: 'Seguro', value: results.expenseBreakdown.insurance, color: '#ec4899' },
      { name: 'Outros', value: results.expenseBreakdown.others, color: '#6b7280' },
    ].filter(item => item.value > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Home className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">
              Simulador de Aluguel da Casa
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simule os gastos e ganhos ao alugar sua casa e ficar temporariamente em outro lugar.
            Considere todas as despesas e receitas para uma análise completa.
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={loadExampleData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Carregar Exemplo
            </button>
            <button
              onClick={clearData}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Limpar Dados
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Entrada */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Dados da Simulação
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aluguel Mensal (R$) *
                  </label>
                  <input
                    type="number"
                    value={data.monthlyRent || ''}
                    onChange={(e) => handleInputChange('monthlyRent', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="3000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período (meses) *
                  </label>
                  <input
                    type="number"
                    value={data.rentalPeriod || ''}
                    onChange={(e) => handleInputChange('rentalPeriod', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Custos de Moradia Alternativa
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aluguel/Hospedagem Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={data.alternativeHousingCost || ''}
                    onChange={(e) => handleInputChange('alternativeHousingCost', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Quanto você gastará mensalmente para se hospedar em outro lugar
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Utilidades (Luz, Água, Gás)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Casa Própria (R$/mês)
                    </label>
                    <input
                      type="number"
                      value={data.utilitiesOwn || ''}
                      onChange={(e) => handleInputChange('utilitiesOwn', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local Alternativo (R$/mês)
                    </label>
                    <input
                      type="number"
                      value={data.utilitiesAlternative || ''}
                      onChange={(e) => handleInputChange('utilitiesAlternative', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="150"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Se incluído no aluguel alternativo, deixe como 0
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Internet</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Casa Própria (R$/mês)
                    </label>
                    <input
                      type="number"
                      value={data.internetOwn || ''}
                      onChange={(e) => handleInputChange('internetOwn', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local Alternativo (R$/mês)
                    </label>
                    <input
                      type="number"
                      value={data.internetAlternative || ''}
                      onChange={(e) => handleInputChange('internetAlternative', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Taxas e Outros Custos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imposto de Renda (%)
                    </label>
                    <input
                      type="number"
                      value={data.taxRate || ''}
                      onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="27.5"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa Imobiliária (%)
                    </label>
                    <input
                      type="number"
                      value={data.realEstateFee || ''}
                      onChange={(e) => handleInputChange('realEstateFee', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="8"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manutenção/Reparos (R$/mês)
                    </label>
                    <input
                      type="number"
                      value={data.maintenanceCost || ''}
                      onChange={(e) => handleInputChange('maintenanceCost', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seguro da Casa (R$/mês)
                    </label>
                    <input
                      type="number"
                      value={data.insuranceCost || ''}
                      onChange={(e) => handleInputChange('insuranceCost', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outras Despesas (R$/mês)
                    </label>
                    <input
                      type="number"
                      value={data.otherExpenses || ''}
                      onChange={(e) => handleInputChange('otherExpenses', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            {/* Card de Resumo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Resultados da Simulação
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-700">Receita Total</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(results.totalIncome)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium text-gray-700">Despesas Totais</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(results.totalExpenses)}
                  </span>
                </div>

                <div className={`flex justify-between items-center p-4 rounded-lg border ${
                  results.netProfit >= 0 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-center">
                    <Calculator className={`w-5 h-5 mr-2 ${
                      results.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`} />
                    <span className="font-medium text-gray-700">Lucro Líquido Total</span>
                  </div>
                  <span className={`text-lg font-bold ${
                    results.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {formatCurrency(results.netProfit)}
                  </span>
                </div>

                <div className={`flex justify-between items-center p-4 rounded-lg border ${
                  results.monthlyNetProfit >= 0 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <span className="font-medium text-gray-700">Lucro Líquido Mensal</span>
                  <span className={`text-lg font-bold ${
                    results.monthlyNetProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {formatCurrency(results.monthlyNetProfit)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-medium text-gray-700">ROI (%)</span>
                  <span className="text-lg font-bold text-purple-600">
                    {results.roi.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown de Despesas */}
            {results.totalExpenses > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Composição das Despesas
                </h3>
                
                <div className="space-y-3">
                  {getExpensePercentages().map((expense, index) => {
                    const percentage = ((expense.value / results.totalExpenses) * 100).toFixed(1);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: expense.color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">
                            {expense.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-800">
                            {formatCurrency(expense.value)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Alertas e Dicas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Análise e Dicas
              </h3>
              
              <div className="space-y-3">
                {results.netProfit < 0 && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                    <p className="text-red-700 text-sm">
                      <strong>⚠️ Resultado Negativo:</strong> Você terá prejuízo de {formatCurrency(Math.abs(results.netProfit))}. 
                      Considere aumentar o aluguel ou reduzir custos.
                    </p>
                  </div>
                )}
                
                {results.roi < 5 && results.netProfit > 0 && (
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-yellow-700 text-sm">
                      <strong>📊 ROI Muito Baixo:</strong> Retorno de {results.roi.toFixed(2)}% pode não compensar 
                      o trabalho e riscos envolvidos.
                    </p>
                  </div>
                )}
                
                {results.roi >= 5 && results.roi < 15 && results.netProfit > 0 && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-blue-700 text-sm">
                      <strong>💡 ROI Moderado:</strong> Retorno de {results.roi.toFixed(2)}% é razoável. 
                      Avalie se os benefícios justificam os esforços.
                    </p>
                  </div>
                )}
                
                {results.roi >= 15 && (
                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <p className="text-green-700 text-sm">
                      <strong>✅ Excelente ROI:</strong> Retorno de {results.roi.toFixed(2)}% indica uma 
                      ótima oportunidade de negócio!
                    </p>
                  </div>
                )}

                <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                  <p className="text-indigo-700 text-sm">
                    <strong>📋 Lembre-se:</strong> Considere também custos extras como limpeza após o inquilino, 
                    possíveis períodos sem locação, inflação e desgaste do imóvel.
                  </p>
                </div>

                {data.monthlyRent > 0 && (
                  <div className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                    <p className="text-gray-700 text-sm">
                      <strong>🧮 Ponto de Equilíbrio:</strong> Você precisa de pelo menos {
                        formatCurrency((results.totalExpenses) / data.rentalPeriod)
                      } de aluguel mensal para não ter prejuízo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            💡 Esta é uma ferramenta de simulação. Para decisões importantes, 
            consulte um contador ou consultor financeiro.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HouseRentalSimulator;
