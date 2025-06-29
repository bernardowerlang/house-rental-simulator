export interface RentalData {
  monthlyRent: number;
  rentalPeriod: number;
  alternativeHousingCost: number;
  monthlyCosts: number;
  monthlyDeductions: number; // Only for Individual Person (PF)
  numberOfInvoices: number; // Number of invoices to split the total revenue
  minimumDesiredProfit: number; // Minimum profit the owner wants to achieve
}

export interface InputValues {
  monthlyRent: string;
  rentalPeriod: string;
  alternativeHousingCost: string;
  monthlyCosts: string;
  monthlyDeductions: string;
  numberOfInvoices: string;
  minimumDesiredProfit: string;
}

export interface TaxResults {
  totalTax: number;
  netIncome: number;
  finalProfit: number;
  prolabore?: {
    amount: number;
    inss: number;
    irpf: number;
    totalTax: number;
    breakdown?: {
      prolaborePerInvoice: number;
      monthlyProlaborePerInvoice: number;
      inssPerInvoice: number;
      irpfPerInvoice: number;
      monthlyINSSPerInvoice: number;
      monthlyIRPFPerInvoice: number;
    };
  };
}

export interface ComparisonResults {
  pf: TaxResults;
  pj: TaxResults;
  bestOption: 'pf' | 'pj';
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  deduction: number;
}

export interface ViabilityScenario {
  reduction: number;
  reducedRent: number;
  totalGrossIncome: number;
  totalTax: number;
  netIncome: number;
  finalProfit: number;
  isViable: boolean;
}

export interface NegotiationScenario {
  reduction: number;
  newTotal: number;
  newMonthlyRent: number;
  totalGrossIncome: number;
  totalTax: number;
  netIncome: number;
  finalProfit: number;
  meetsMinimum: boolean;
  reductionPercentage: number;
}

export type TabType = 'input' | 'comparison' | 'viability' | 'negotiation';
