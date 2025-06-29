import { TaxBracket } from '../types';

// Brazilian Income Tax Table 2025 (Valid from May 2025 - Monthly Rental Income)
export const IR_TABLE: TaxBracket[] = [
  { min: 0, max: 2428.80, rate: 0, deduction: 0 },
  { min: 2428.81, max: 2826.65, rate: 7.5, deduction: 182.16 },
  { min: 2826.66, max: 3751.05, rate: 15, deduction: 394.16 },
  { min: 3751.06, max: 4664.68, rate: 22.5, deduction: 675.49 },
  { min: 4664.69, max: Infinity, rate: 27.5, deduction: 908.73 }
];

// INSS Table 2025 (Progressive Brackets)
export const INSS_TABLE: TaxBracket[] = [
  { min: 0, max: 1518.00, rate: 7.5, deduction: 0 },
  { min: 1518.01, max: 2793.88, rate: 9, deduction: 22.77 },
  { min: 2793.89, max: 4190.83, rate: 12, deduction: 106.59 },
  { min: 4190.84, max: 8157.41, rate: 14, deduction: 190.40 }
];

// Constants for Corporate (PJ) calculations
export const TAX_CONSTANTS = {
  PROLABORE_PERCENTAGE: 0.28, // 28% of revenue
  INSS_MAX_AMOUNT: 8157.41, // INSS ceiling 2025
  SIMPLES_NACIONAL_RATE: 0.06, // 6% Simplified National Tax
} as const;
