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
  // Value per invoice (total revenue divided by number of invoices)
  const revenuePerInvoice = totalRevenue / numberOfInvoices;
  
  // Pro-labore per invoice (28% of invoice value)
  const prolaborePerInvoice = revenuePerInvoice * TAX_CONSTANTS.PROLABORE_PERCENTAGE;
  
  // Calculate INSS per invoice using progressive brackets
  const inssPerInvoice = calculateINSS(prolaborePerInvoice);
  
  // Calculate IRPF per invoice (on net value)
  const irpfPerInvoice = calculateProlaboreIRPF(prolaborePerInvoice, inssPerInvoice);
  
  // Period totals
  const totalINSS = inssPerInvoice * numberOfInvoices;
  const totalIRPF = irpfPerInvoice * numberOfInvoices;
  const totalProlabore = prolaborePerInvoice * numberOfInvoices;
  
  return {
    amount: totalProlabore,
    inss: totalINSS,
    irpf: totalIRPF,
    totalTax: totalINSS + totalIRPF,
    // Additional data for display
    breakdown: {
      prolaborePerInvoice: prolaborePerInvoice, // Pro-labore value per invoice
      monthlyProlaborePerInvoice: prolaborePerInvoice, // Same value (now per invoice, not per month)
      inssPerInvoice: inssPerInvoice, // INSS per invoice
      irpfPerInvoice: irpfPerInvoice, // IRPF per invoice
      monthlyINSSPerInvoice: inssPerInvoice, // Same value (now per invoice, not per month)
      monthlyIRPFPerInvoice: irpfPerInvoice, // Same value (now per invoice, not per month)
    }
  };
};
