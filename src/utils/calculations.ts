import { IR_TABLE, INSS_TABLE, TAX_CONSTANTS } from '../constants/taxTables';

export const formatCurrency = (value: number, language: 'pt' | 'en' = 'pt') => {
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

export const parseCurrencyInput = (value: string): number => {
  return Number(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

export const parseNumberInput = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

export const calculatePFTax = (monthlyIncome: number, monthlyDeductions: number): number => {
  const taxableIncome = monthlyIncome - monthlyDeductions;
  
  if (taxableIncome <= 0) return 0;
  
  const bracket = IR_TABLE.find(b => taxableIncome >= b.min && taxableIncome <= b.max);
  if (!bracket) return 0;
  
  return Math.max(0, (taxableIncome * bracket.rate / 100) - bracket.deduction);
};

export const calculateINSS = (prolabore: number): number => {
  if (prolabore <= 0) return 0;
  
  // INSS is limited to the maximum ceiling
  const limitedProlabore = Math.min(prolabore, TAX_CONSTANTS.INSS_MAX_AMOUNT);
  
  const bracket = INSS_TABLE.find(b => limitedProlabore >= b.min && limitedProlabore <= b.max);
  if (!bracket) return 0;
  
  return Math.max(0, (limitedProlabore * bracket.rate / 100) - bracket.deduction);
};

export const calculateProlaboreIRPF = (monthlyProlabore: number, monthlyINSS: number): number => {
  const taxableIncome = monthlyProlabore - monthlyINSS;
  
  if (taxableIncome <= 0) return 0;
  
  const bracket = IR_TABLE.find(b => taxableIncome >= b.min && taxableIncome <= b.max);
  if (!bracket) return 0;
  
  return Math.max(0, (taxableIncome * bracket.rate / 100) - bracket.deduction);
};

export const calculateProlaboreTaxes = (totalRevenue: number, numberOfInvoices: number) => {
  // Valor por nota (receita total dividida pelo número de notas)
  const revenuePerInvoice = totalRevenue / numberOfInvoices;
  
  // Pro-labore por nota (28% do valor da nota)
  const prolaborePerInvoice = revenuePerInvoice * TAX_CONSTANTS.PROLABORE_PERCENTAGE;
  
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
