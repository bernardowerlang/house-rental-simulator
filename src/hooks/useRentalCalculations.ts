import { useState, useEffect } from 'react';
import { RentalData, ComparisonResults } from '../types';
import { calculatePFTax, calculateProlaboreTaxes } from '../utils/calculations';
import { TAX_CONSTANTS } from '../constants/taxTables';

export const useRentalCalculations = (data: RentalData) => {
  const [results, setResults] = useState<ComparisonResults>({
    pf: { totalTax: 0, netIncome: 0, finalProfit: 0 },
    pj: { totalTax: 0, netIncome: 0, finalProfit: 0 },
    bestOption: 'pf'
  });

  const calculateResults = () => {
    const totalGrossIncome = data.monthlyRent * data.rentalPeriod;
    const totalCosts = data.alternativeHousingCost + (data.monthlyCosts * data.rentalPeriod);

    // Pessoa Física (Imposto Progressivo)
    const monthlyPFTax = calculatePFTax(data.monthlyRent, data.monthlyDeductions);
    const totalPFTax = monthlyPFTax * data.rentalPeriod;
    const pfNetIncome = totalGrossIncome - totalPFTax;
    const pfFinalProfit = pfNetIncome - totalCosts;

    // Pessoa Jurídica (Simples Nacional 6% + Pró-labore)
    const simplesNacionalTax = totalGrossIncome * TAX_CONSTANTS.SIMPLES_NACIONAL_RATE;
    const prolaboreTaxes = calculateProlaboreTaxes(totalGrossIncome, data.numberOfInvoices);
    const totalPJTax = simplesNacionalTax + prolaboreTaxes.totalTax;
    const pjNetIncome = totalGrossIncome - totalPJTax;
    const pjFinalProfit = pjNetIncome - totalCosts;

    const bestOption = pfFinalProfit >= pjFinalProfit ? 'pf' : 'pj';

    setResults({
      pf: {
        totalTax: totalPFTax,
        netIncome: pfNetIncome,
        finalProfit: pfFinalProfit
      },
      pj: {
        totalTax: totalPJTax,
        netIncome: pjNetIncome,
        finalProfit: pjFinalProfit,
        prolabore: prolaboreTaxes
      },
      bestOption
    });
  };

  useEffect(() => {
    calculateResults();
  }, [data]);

  return results;
};
