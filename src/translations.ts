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
    
    // Quick Summary
    quickSummary: "📋 Resumo Rápido:",
    totalGrossRevenue: "Receita Bruta Total:",
    totalCosts: "Custos Totais:",
    beforeTaxes: "Antes dos Impostos:",
    
    // Comparison Results
    bestOption: "Melhor Opção:",
    individual: "Pessoa Física",
    corporate: "Pessoa Jurídica",
    savingsCompared: "Economia de {amount} comparado à outra opção",
    
    // Tax Cards
    taxCalculation: "📊 Cálculo do Imposto",
    taxBase: "Base de cálculo:",
    monthlyTax: "Imposto mensal:",
    progressiveTable: "Regime: Carnê-Leão (Tabela Progressiva)",
    corporateRate: "Alíquota: 6% (Simples Nacional) + Pró-labore",
    corporateRegime: "Regime: Simples Nacional - Anexo III + Impostos sobre Pró-labore",
    
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
    individualBetter: "✅ Pessoa Física é mais vantajosa: Com as deduções informadas, a tributação progressiva do Carnê-Leão resulta em menor imposto.",
    corporateBetter: "✅ Pessoa Jurídica é mais vantajosa: Mesmo com o pró-labore (28% do faturamento) e seus impostos (INSS + IRPF), a opção PJ ainda é mais eficiente neste cenário.",
    corporateReminder: "📋 Lembre-se: Para PJ, considere também custos de abertura, contabilidade (~R$ 200-500/mês), obrigações fiscais e que 28% do faturamento será pró-labore (sujeito a INSS e IRPF).",
    consultAccountant: "⚖️ Consulte um contador: Esta simulação é apenas orientativa. Cada situação é única e requer análise profissional.",
    
    // Footer
    footerDisclaimer: "Simulação baseada na legislação de 2024. Para decisões importantes, consulte sempre um contador qualificado.",
    
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
    
    // Quick Summary
    quickSummary: "📋 Quick Summary:",
    totalGrossRevenue: "Total Gross Revenue:",
    totalCosts: "Total Costs:",
    beforeTaxes: "Before Taxes:",
    
    // Comparison Results
    bestOption: "Best Option:",
    individual: "Individual",
    corporate: "Corporate",
    savingsCompared: "Savings of {amount} compared to the other option",
    
    // Tax Cards
    taxCalculation: "📊 Tax Calculation",
    taxBase: "Tax base:",
    monthlyTax: "Monthly tax:",
    progressiveTable: "Method: Progressive Tax Table",
    corporateRate: "Rate: 6% (Simplified Tax) + Pro-labore",
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
    
    // Footer
    footerDisclaimer: "Simulation based on 2024 legislation. For important decisions, always consult a qualified accountant.",
    
    // Language
    language: "Language",
    portuguese: "Português",
    english: "English"
  }
};
