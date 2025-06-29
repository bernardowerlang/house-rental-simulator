export const translations = {
  pt: {
    // Header
    title: "Simulador de Tributação - Aluguel",
    subtitle: "Compare a tributação entre Pessoa Física (Carnê-Leão) e Pessoa Jurídica (Simples Nacional) para decidir a melhor estratégia fiscal no seu negócio de aluguel.",
    loadExample: "Carregar Exemplo",
    clearData: "Limpar Dados",
    
    // Navigation
    inputData: "📝 Dados de Entrada",
    comparison: "📊 Comparativo PF vs PJ",
    viabilityAnalysis: "💰 Análise de Viabilidade",
    negotiationHelper: "🤝 Ajuda p/ Negociação",
    
    // Input Form
    simulationData: "Dados da Simulação",
    basicData: "📊 Dados Básicos",
    monthlyRent: "💰 Valor Bruto do Aluguel (R$/mês) *",
    rentalPeriod: "📅 Duração do Aluguel (meses) *",
    numberOfInvoices: "📄 Número Total de Notas Fiscais (PJ)",
    numberOfInvoicesHelper: "Total de notas para dividir todo o faturamento do período (ex: 4 notas para dividir R$ 40.000)",
    alternativeHousingCost: "🏠 Custo Total da Moradia Alternativa (R$) *",
    alternativeHousingHelper: "Valor total que você gastará com hospedagem durante todo o período",
    
    costsAndDeductions: "💸 Custos e Deduções",
    monthlyCosts: "🔧 Custo Fixo Mensal do Imóvel (R$/mês) *",
    monthlyCortsHelper: "IPTU, condomínio, seguro, manutenção, etc.",
    individualOnly: "Apenas para Pessoa Física",
    monthlyDeductions: "📋 Deduções Mensais (R$/mês)",
    deductionsHelper: "Despesas dedutíveis: IPTU, condomínio, reformas, depreciação, etc.",
    minimumDesiredProfit: "💰 Lucro Mínimo Desejado (R$) *",
    minimumDesiredProfitHelper: "Menor lucro que você quer ter ao final do período",
    
    // Quick Summary
    quickSummary: "📋 Resumo Rápido:",
    totalGrossRevenue: "Receita Bruta Total:",
    totalCosts: "Custos Totais:",
    beforeTaxes: "Antes dos Impostos:",
    costsBreakdown: "💸 Detalhamento dos Custos:",
    alternativeHousing: "Moradia Alternativa:",
    propertyFixedCosts: "Custos Fixos do Imóvel:",
    monthlyCostDetail: "R$/mês × {months} meses",
    
    // Comparison Results
    bestOption: "Melhor Opção:",
    individual: "Pessoa Física",
    corporate: "Pessoa Jurídica",
    savingsCompared: "Economia de {amount} comparado à outra opção",
    
    // Tax Cards
    taxCalculation: "📊 Cálculo do Imposto",
    taxBase: "Base de cálculo:",
    monthlyTax: "Imposto mensal:",
    progressiveTable: "Método: Tabela Progressiva IRPF (2025)",
    corporateRate: "Taxa: 6% (Simples Nacional) + Pró-labore (INSS/IRPF 2025)",
    corporateRegime: "Método: Simples Nacional + Impostos do Pró-labore",
    
    totalTax: "💸 Imposto Total",
    netRevenue: "💰 Receita Líquida",
    finalProfit: "🎯 Lucro Final",
    best: "👑 MELHOR",
    
    // Detailed Analysis
    detailedAnalysis: "Análise Detalhada",
    taxComparison: "📊 Comparativo de Impostos",
    profitComparison: "🎯 Comparativo de Lucro",
    difference: "Diferença:",
    advantage: "Vantagem:",
    
    // Recommendations
    recommendations: "💡 Recomendações",
    individualBetter: "✅ Pessoa Física é mais vantajosa: Com as deduções informadas, a tributação progressiva resulta em menor imposto.",
    corporateBetter: "✅ Pessoa Jurídica é mais vantajosa: Mesmo com o pró-labore (28% do faturamento) e seus impostos (INSS + IRPF), a opção PJ ainda é mais eficiente neste cenário.",
    corporateReminder: "📋 Lembre-se: Para PJ, considere também custos de abertura, contabilidade (~R$ 200-500/mês), obrigações fiscais e que 28% do faturamento será pró-labore (sujeito a INSS e IRPF).",
    consultAccountant: "⚖️ Consulte um contador: Esta simulação é apenas orientativa. Cada situação é única e requer análise profissional.",
    
    // Negotiation Helper
    negotiationHelperTitle: "Assistente de Negociação",
    negotiationSubtitle: "Análise detalhada para sua negociação atual",
    currentOffer: "Oferta Atual",
    yourMinimumProfit: "Seu Lucro Mínimo",
    minimumTarget: "Meta Definida",
    minimumViableOffer: "Oferta Mínima Viável",
    lowestAcceptable: "Menor Valor Aceitável",
    maxPossibleReduction: "Redução Máxima",
    discount: "desconto",
    negotiationScenarios: "Cenários de Negociação",
    reduction: "Redução",
    newTotalValue: "Novo Valor Total",
    newMonthlyRent: "Novo Aluguel Mensal",
    taxes: "Impostos",
    decision: "Decisão",
    excellent: "Excelente",
    acceptable: "Aceitável",
    reject: "Rejeitar",
    negotiationTips: "💡 Dicas de Negociação",
    strongPosition: "Posição Forte",
    strongPositionDesc: "Você tem margem para negociar. Use isso como vantagem para flexibilizar outros termos.",
    counterOffer: "Contra-oferta",
    counterOfferDesc: "Se pedirem desconto, contra-oferte com contrato mais longo ou outras vantagens.",
    sweetSpot: "Ponto Ideal",
    sweetSpotDesc: "Procure um valor que deixe ambas as partes satisfeitas e ainda atinja seu lucro mínimo.",
    walkAway: "Limite Inferior",
    walkAwayDesc: "Não aceite ofertas abaixo de {amount}. Abaixo disso, não vale a pena o investimento.",

    // Viability Analysis
    viabilityAnalysisTitle: "Análise de Viabilidade",
    viabilitySubtitle: "Avalie a viabilidade do seu cenário de aluguel",
    maxReduction: "Redução Máxima",
    maxReductionDesc: "Maior desconto possível mantendo lucro positivo",
    minViableRent: "Aluguel Mínimo Viável",
    minViableRentDesc: "Menor valor de aluguel que ainda gera lucro",
    maxDiscountAmount: "Valor Máximo de Desconto (R$)",
    maxDiscountAmountDesc: "Máximo que pode ser descontado",
    detailedViabilityAnalysis: "Análise Detalhada de Viabilidade",
    newRent: "Novo Aluguel",
    grossRevenue: "Receita Bruta",
    viable: "Viável",
    yes: "Sim",
    no: "Não",
    strategicInsights: "💡 Insights Estratégicos",
    pricingFlexibility: "Flexibilidade de Preços",
    lowMargin: "Margem Baixa",
    lowMarginDesc: "Sua operação tem margem apertada. Considere revisar custos ou aumentar o aluguel.",
    optimalStrategy: "Estratégia Ótima",
    marketingTip: "Dica de Marketing",
    marketingTipDesc: "Com boa margem, você pode oferecer descontos para atrair inquilinos rapidamente ou negociar contratos mais longos.",

    // Footer
    footerDisclaimer: "Simulação baseada nas tabelas tributárias de 2025 (IRPF vigente desde maio/2025). Para decisões importantes, consulte sempre um contador qualificado.",
    
    // Language
    language: "Idioma",
    portuguese: "Português",
    english: "English"
  },
  
  en: {
    // Header
    title: "House Rental Tax Simulator",
    subtitle: "Compare taxation between Individual (Progressive Tax) and Corporate (Simplified Tax) to decide the best tax strategy for your rental business.",
    loadExample: "Load Example",
    clearData: "Clear Data",
    
    // Navigation
    inputData: "📝 Input Data",
    comparison: "📊 Individual vs Corporate",
    viabilityAnalysis: "💰 Viability Analysis",
    negotiationHelper: "🤝 Negotiation Helper",
    
    // Input Form
    simulationData: "Simulation Data",
    basicData: "📊 Basic Data",
    monthlyRent: "💰 Gross Monthly Rent ($) *",
    rentalPeriod: "📅 Rental Duration (months) *",
    numberOfInvoices: "📄 Total Number of Invoices (Corporate)",
    numberOfInvoicesHelper: "Total invoices to split all period revenue (e.g.: 4 invoices to split $40,000)",
    alternativeHousingCost: "🏠 Total Alternative Housing Cost ($) *",
    alternativeHousingHelper: "Total amount you'll spend on accommodation during the entire period",
    
    costsAndDeductions: "💸 Costs and Deductions",
    monthlyCosts: "🔧 Monthly Property Fixed Costs ($) *",
    monthlyCortsHelper: "Property tax, HOA, insurance, maintenance, etc.",
    individualOnly: "Individual Tax Only",
    monthlyDeductions: "📋 Monthly Deductions ($)",
    deductionsHelper: "Deductible expenses: property tax, HOA, repairs, depreciation, etc.",
    minimumDesiredProfit: "💰 Minimum Desired Profit ($) *",
    minimumDesiredProfitHelper: "Lowest profit you want to have at the end of the period",
    
    // Quick Summary
    quickSummary: "📋 Quick Summary:",
    totalGrossRevenue: "Total Gross Revenue:",
    totalCosts: "Total Costs:",
    beforeTaxes: "Before Taxes:",
    costsBreakdown: "💸 Costs Breakdown:",
    alternativeHousing: "Alternative Housing:",
    propertyFixedCosts: "Property Fixed Costs:",
    monthlyCostDetail: "$/month × {months} months",
    
    // Comparison Results
    bestOption: "Best Option:",
    individual: "Individual",
    corporate: "Corporate",
    savingsCompared: "Savings of {amount} compared to the other option",
    
    // Tax Cards
    taxCalculation: "📊 Tax Calculation",
    taxBase: "Tax base:",
    monthlyTax: "Monthly tax:",
    progressiveTable: "Method: Progressive Tax Table (2025)",
    corporateRate: "Rate: 6% (Simplified Tax) + Pro-labore (2025 Social Security/Income Tax)",
    corporateRegime: "Method: Simplified Corporate Tax + Pro-labore Taxes",
    
    totalTax: "💸 Total Tax",
    netRevenue: "💰 Net Revenue",
    finalProfit: "🎯 Final Profit",
    best: "👑 BEST",
    
    // Detailed Analysis
    detailedAnalysis: "Detailed Analysis",
    taxComparison: "📊 Tax Comparison",
    profitComparison: "🎯 Profit Comparison",
    difference: "Difference:",
    advantage: "Advantage:",
    
    // Recommendations
    recommendations: "💡 Recommendations",
    individualBetter: "✅ Individual is more advantageous: With the informed deductions, progressive taxation results in lower taxes.",
    corporateBetter: "✅ Corporate is more advantageous: Even with pro-labore (28% of revenue) and its taxes (Social Security + Income Tax), the corporate option is still more efficient in this scenario.",
    corporateReminder: "📋 Remember: For corporate, also consider opening costs, accounting (~$200-500/month), tax obligations, and that 28% of revenue will be pro-labore (subject to Social Security and Income Tax).",
    consultAccountant: "⚖️ Consult an accountant: This simulation is only for guidance. Each situation is unique and requires professional analysis.",
    
    // Negotiation Helper
    negotiationHelperTitle: "Negotiation Assistant",
    negotiationSubtitle: "Detailed analysis for your current negotiation",
    currentOffer: "Current Offer",
    yourMinimumProfit: "Your Minimum Profit",
    minimumTarget: "Defined Target",
    minimumViableOffer: "Minimum Viable Offer",
    lowestAcceptable: "Lowest Acceptable Value",
    maxPossibleReduction: "Maximum Reduction",
    discount: "discount",
    negotiationScenarios: "Negotiation Scenarios",
    reduction: "Reduction",
    newTotalValue: "New Total Value",
    newMonthlyRent: "New Monthly Rent",
    taxes: "Taxes",
    decision: "Decision",
    excellent: "Excellent",
    acceptable: "Acceptable",
    reject: "Reject",
    negotiationTips: "💡 Negotiation Tips",
    strongPosition: "Strong Position",
    strongPositionDesc: "You have room to negotiate. Use this as an advantage to flexibilize other terms.",
    counterOffer: "Counter-Offer",
    counterOfferDesc: "If they ask for a discount, counter-offer with a longer contract or other advantages.",
    sweetSpot: "Ideal Point",
    sweetSpotDesc: "Look for a value that satisfies both parties and still meets your minimum profit.",
    walkAway: "Lower Limit",
    walkAwayDesc: "Do not accept offers below {amount}. Below this, it is not worth the investment.",

    // Viability Analysis
    viabilityAnalysisTitle: "Viability Analysis",
    viabilitySubtitle: "Evaluate the viability of your rental scenario",
    maxReduction: "Maximum Reduction",
    maxReductionDesc: "Highest discount possible while maintaining positive profit",
    minViableRent: "Minimum Viable Rent",
    minViableRentDesc: "Lowest rent value that still generates profit",
    maxDiscountAmount: "Maximum Discount ($)",
    maxDiscountAmountDesc: "Maximum amount that can be discounted",
    detailedViabilityAnalysis: "Detailed Viability Analysis",
    newRent: "New Rent",
    grossRevenue: "Gross Revenue",
    viable: "Viable",
    yes: "Yes",
    no: "No",
    strategicInsights: "💡 Strategic Insights",
    pricingFlexibility: "Pricing Flexibility",
    lowMargin: "Low Margin",
    lowMarginDesc: "Your operation has tight margins. Consider reviewing costs or increasing rent.",
    optimalStrategy: "Optimal Strategy",
    marketingTip: "Marketing Tip",
    marketingTipDesc: "With good margins, you can offer discounts to attract tenants quickly or negotiate longer contracts.",

    // Footer
    footerDisclaimer: "Simulation based on 2025 tax tables (IRPF effective May 2025). For important decisions, always consult a qualified accountant.",
    
    // Language
    language: "Language",
    portuguese: "Português",
    english: "English"
  }
};
