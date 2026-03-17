/**
 * SmartTax - Tax Calculation Engine
 * Handles federal and state tax calculations, deductions, and credits
 */

// 2024 Federal Tax Brackets (Single, Married Filing Jointly, etc.)
export const FEDERAL_BRACKETS_2024 = {
  single: [
    { limit: 11600, rate: 0.10 },
    { limit: 47150, rate: 0.12 },
    { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243725, rate: 0.32 },
    { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ],
  marriedJoint: [
    { limit: 23200, rate: 0.10 },
    { limit: 94300, rate: 0.12 },
    { limit: 201050, rate: 0.22 },
    { limit: 383900, rate: 0.24 },
    { limit: 487450, rate: 0.32 },
    { limit: 731200, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ],
  marriedSeparate: [
    { limit: 11600, rate: 0.10 },
    { limit: 47150, rate: 0.12 },
    { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243725, rate: 0.32 },
    { limit: 365600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ],
  headOfHousehold: [
    { limit: 16550, rate: 0.10 },
    { limit: 63100, rate: 0.12 },
    { limit: 100500, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243700, rate: 0.32 },
    { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ]
};

// Standard Deductions 2024
export const STANDARD_DEDUCTIONS_2024 = {
  single: 14600,
  marriedJoint: 29200,
  marriedSeparate: 14600,
  headOfHousehold: 21900
};

// State Tax Brackets (simplified for major states)
export const STATE_BRACKETS_2024: Record<string, Record<string, { limit: number; rate: number }[]>> = {
  california: {
    single: [
      { limit: 10099, rate: 0.01 },
      { limit: 23942, rate: 0.02 },
      { limit: 37788, rate: 0.04 },
      { limit: 52455, rate: 0.06 },
      { limit: 66295, rate: 0.08 },
      { limit: 338639, rate: 0.093 },
      { limit: 406364, rate: 0.103 },
      { limit: 677275, rate: 0.113 },
      { limit: Infinity, rate: 0.123 }
    ],
    marriedJoint: [
      { limit: 20198, rate: 0.01 },
      { limit: 47884, rate: 0.02 },
      { limit: 75576, rate: 0.04 },
      { limit: 104910, rate: 0.06 },
      { limit: 132590, rate: 0.08 },
      { limit: 677278, rate: 0.093 },
      { limit: 812728, rate: 0.103 },
      { limit: 1354550, rate: 0.113 },
      { limit: Infinity, rate: 0.123 }
    ],
    marriedSeparate: [
      { limit: 10099, rate: 0.01 },
      { limit: 23942, rate: 0.02 },
      { limit: 37788, rate: 0.04 },
      { limit: 52455, rate: 0.06 },
      { limit: 66295, rate: 0.08 },
      { limit: 338639, rate: 0.093 },
      { limit: 406364, rate: 0.103 },
      { limit: 677275, rate: 0.113 },
      { limit: Infinity, rate: 0.123 }
    ],
    headOfHousehold: [
      { limit: 10099, rate: 0.01 },
      { limit: 23942, rate: 0.02 },
      { limit: 37788, rate: 0.04 },
      { limit: 52455, rate: 0.06 },
      { limit: 66295, rate: 0.08 },
      { limit: 338639, rate: 0.093 },
      { limit: 406364, rate: 0.103 },
      { limit: 677275, rate: 0.113 },
      { limit: Infinity, rate: 0.123 }
    ]
  },
  newYork: {
    single: [
      { limit: 8500, rate: 0.04 },
      { limit: 11700, rate: 0.045 },
      { limit: 13900, rate: 0.0525 },
      { limit: 80650, rate: 0.0585 },
      { limit: 215400, rate: 0.0625 },
      { limit: 1077550, rate: 0.0685 },
      { limit: Infinity, rate: 0.0882 }
    ],
    marriedJoint: [
      { limit: 17150, rate: 0.04 },
      { limit: 23600, rate: 0.045 },
      { limit: 27900, rate: 0.0525 },
      { limit: 161550, rate: 0.0585 },
      { limit: 323200, rate: 0.0625 },
      { limit: 2155350, rate: 0.0685 },
      { limit: Infinity, rate: 0.0882 }
    ],
    marriedSeparate: [
      { limit: 8500, rate: 0.04 },
      { limit: 11700, rate: 0.045 },
      { limit: 13900, rate: 0.0525 },
      { limit: 80650, rate: 0.0585 },
      { limit: 215400, rate: 0.0625 },
      { limit: 1077550, rate: 0.0685 },
      { limit: Infinity, rate: 0.0882 }
    ],
    headOfHousehold: [
      { limit: 8500, rate: 0.04 },
      { limit: 11700, rate: 0.045 },
      { limit: 13900, rate: 0.0525 },
      { limit: 80650, rate: 0.0585 },
      { limit: 215400, rate: 0.0625 },
      { limit: 1077550, rate: 0.0685 },
      { limit: Infinity, rate: 0.0882 }
    ]
  },
  texas: { single: [], marriedJoint: [], marriedSeparate: [], headOfHousehold: [] },
  florida: { single: [], marriedJoint: [], marriedSeparate: [], headOfHousehold: [] },
  washington: { single: [], marriedJoint: [], marriedSeparate: [], headOfHousehold: [] }
};

// Tax Credits
export const TAX_CREDITS_2024 = {
  childTaxCredit: 2000, // per child under 17
  childTaxCreditPhaseout: {
    single: 200000,
    marriedJoint: 400000,
    marriedSeparate: 200000,
    headOfHousehold: 200000
  },
  earnedIncomeCredit: {
    maxAmount: 7430,
    phaseout: {
      single: 21430,
      marriedJoint: 28120,
      marriedSeparate: 21430,
      headOfHousehold: 21430
    }
  },
  educationCredit: {
    americanOpportunity: 2500,
    lifetimeLearning: 2000
  },
  saversCredit: {
    maxRate: 0.50,
    maxAmount: 2000
  }
};

// FICA Tax Rates
export const FICA_RATES = {
  socialSecurity: 0.062,
  medicare: 0.0145,
  socialSecurityWageBase: 168600 // 2024 limit
};

export interface TaxpayerInfo {
  filingStatus: 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold';
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string;
  occupation: string;
  spouseInfo?: {
    firstName: string;
    lastName: string;
    ssn: string;
    dateOfBirth: string;
  };
  dependents: Array<{
    firstName: string;
    lastName: string;
    ssn: string;
    dateOfBirth: string;
    relationship: string;
    isChildTaxCreditEligible: boolean;
    isDependentCareEligible: boolean;
  }>;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface IncomeInfo {
  wages: number;
  tips: number;
  interestIncome: number;
  dividendIncome: number;
  businessIncome: number;
  capitalGains: number;
  capitalGainsLongTerm: number;
  capitalGainsShortTerm: number;
  rentalIncome: number;
  unemploymentCompensation: number;
  socialSecurityBenefits: number;
  otherIncome: number;
  stateTaxRefund: number;
}

export interface DeductionInfo {
  useStandardDeduction: boolean;
  standardDeduction: number;
  itemizedDeductions: {
    medicalExpenses: number;
    stateAndLocalTaxes: number;
    mortgageInterest: number;
    charitableContributions: number;
    otherDeductions: number;
  };
  aboveLineDeductions: {
    studentLoanInterest: number;
    selfEmploymentTax: number;
    retirementContributions: number;
    hsaContributions: number;
    alimonyPaid: number;
  };
}

export interface CreditInfo {
  childTaxCredit: number;
  childAndDependentCareCredit: number;
  earnedIncomeCredit: number;
  educationCredits: number;
  retirementSavingsCredit: number;
  foreignTaxCredit: number;
  otherCredits: number;
}

export interface TaxBracketBreakdown {
  bracket: string;
  amount: number;
  tax: number;
}

export interface TaxCalculation {
  // Income
  totalIncome: number;
  adjustedGrossIncome: number;
  taxableIncome: number;
  
  // Deductions
  totalDeductions: number;
  standardDeduction: number;
  itemizedDeductions: number;
  
  // Tax
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  totalTax: number;
  
  // Credits
  totalCredits: number;
  
  // Result
  taxBeforeCredits: number;
  taxAfterCredits: number;
  refundOrOwed: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  
  // Breakdown
  federalTaxBreakdown: TaxBracketBreakdown[];
  stateTaxBreakdown: TaxBracketBreakdown[];
}

export function calculateTax(
  taxpayerInfo: TaxpayerInfo,
  incomeInfo: IncomeInfo,
  deductionInfo: DeductionInfo,
  creditInfo: CreditInfo,
  stateCode: string = 'california'
): TaxCalculation {
  // Calculate total income
  const totalIncome = calculateTotalIncome(incomeInfo);
  
  // Calculate AGI (simplified - above line deductions)
  const aboveLineDeductions = Object.values(deductionInfo.aboveLineDeductions).reduce((a, b) => a + b, 0);
  const adjustedGrossIncome = Math.max(0, totalIncome - aboveLineDeductions);
  
  // Determine deduction amount
  const standardDeduction = STANDARD_DEDUCTIONS_2024[taxpayerInfo.filingStatus];
  const itemizedDeductionsTotal = Object.values(deductionInfo.itemizedDeductions).reduce((a, b) => a + b, 0);
  const useStandard = deductionInfo.useStandardDeduction || standardDeduction >= itemizedDeductionsTotal;
  const totalDeductions = useStandard ? standardDeduction : itemizedDeductionsTotal;
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, adjustedGrossIncome - totalDeductions);
  
  // Calculate federal tax
  const federalResult = calculateFederalTax(taxableIncome, taxpayerInfo.filingStatus);
  
  // Calculate state tax
  const stateResult = calculateStateTax(taxableIncome, taxpayerInfo.filingStatus, stateCode);
  
  // Calculate FICA tax
  const ficaTax = calculateFICATax(incomeInfo.wages + incomeInfo.tips);
  
  // Calculate total credits
  const totalCredits = Object.values(creditInfo).reduce((a, b) => a + b, 0);
  
  // Calculate final tax
  const taxBeforeCredits = federalResult.tax + stateResult.tax + ficaTax;
  const taxAfterCredits = Math.max(0, federalResult.tax + stateResult.tax - totalCredits) + ficaTax;
  
  // Calculate effective tax rate
  const effectiveTaxRate = totalIncome > 0 ? (taxAfterCredits / totalIncome) * 100 : 0;
  
  return {
    totalIncome,
    adjustedGrossIncome,
    taxableIncome,
    totalDeductions,
    standardDeduction,
    itemizedDeductions: itemizedDeductionsTotal,
    federalTax: federalResult.tax,
    stateTax: stateResult.tax,
    ficaTax,
    totalTax: taxAfterCredits,
    totalCredits,
    taxBeforeCredits,
    taxAfterCredits,
    refundOrOwed: taxAfterCredits,
    effectiveTaxRate,
    marginalTaxRate: federalResult.marginalRate,
    federalTaxBreakdown: federalResult.breakdown,
    stateTaxBreakdown: stateResult.breakdown
  };
}

function calculateTotalIncome(income: IncomeInfo): number {
  return (
    income.wages +
    income.tips +
    income.interestIncome +
    income.dividendIncome +
    income.businessIncome +
    income.capitalGains +
    income.rentalIncome +
    income.unemploymentCompensation +
    income.socialSecurityBenefits * 0.85 + // Up to 85% taxable
    income.otherIncome +
    income.stateTaxRefund
  );
}

function calculateFederalTax(taxableIncome: number, filingStatus: keyof typeof FEDERAL_BRACKETS_2024): { tax: number; marginalRate: number; breakdown: TaxBracketBreakdown[] } {
  const brackets = FEDERAL_BRACKETS_2024[filingStatus];
  let remainingIncome = taxableIncome;
  let previousLimit = 0;
  let totalTax = 0;
  let marginalRate = 0;
  const breakdown: TaxBracketBreakdown[] = [];
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const bracketSize = bracket.limit === Infinity ? remainingIncome : Math.min(remainingIncome, bracket.limit - previousLimit);
    const bracketTax = bracketSize * bracket.rate;
    
    if (bracketSize > 0) {
      breakdown.push({
        bracket: `$${previousLimit.toLocaleString()} - ${bracket.limit === Infinity ? '∞' : '$' + bracket.limit.toLocaleString()}`,
        amount: bracketSize,
        tax: bracketTax
      });
    }
    
    totalTax += bracketTax;
    remainingIncome -= bracketSize;
    previousLimit = bracket.limit;
    
    if (remainingIncome > 0) {
      marginalRate = bracket.rate;
    }
  }
  
  return { tax: totalTax, marginalRate: marginalRate * 100, breakdown };
}

function calculateStateTax(taxableIncome: number, filingStatus: keyof typeof FEDERAL_BRACKETS_2024, stateCode: string): { tax: number; breakdown: TaxBracketBreakdown[] } {
  const stateBrackets = STATE_BRACKETS_2024[stateCode];
  
  if (!stateBrackets || !stateBrackets[filingStatus] || stateBrackets[filingStatus].length === 0) {
    return { tax: 0, breakdown: [] };
  }
  
  const brackets = stateBrackets[filingStatus];
  let remainingIncome = taxableIncome;
  let previousLimit = 0;
  let totalTax = 0;
  const breakdown: TaxBracketBreakdown[] = [];
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const bracketSize = bracket.limit === Infinity ? remainingIncome : Math.min(remainingIncome, bracket.limit - previousLimit);
    const bracketTax = bracketSize * bracket.rate;
    
    if (bracketSize > 0) {
      breakdown.push({
        bracket: `$${previousLimit.toLocaleString()} - ${bracket.limit === Infinity ? '∞' : '$' + bracket.limit.toLocaleString()}`,
        amount: bracketSize,
        tax: bracketTax
      });
    }
    
    totalTax += bracketTax;
    remainingIncome -= bracketSize;
    previousLimit = bracket.limit;
  }
  
  return { tax: totalTax, breakdown };
}

function calculateFICATax(wages: number): number {
  const socialSecurityTax = Math.min(wages, FICA_RATES.socialSecurityWageBase) * FICA_RATES.socialSecurity;
  const medicareTax = wages * FICA_RATES.medicare;
  return socialSecurityTax + medicareTax;
}

// Calculate Child Tax Credit
export function calculateChildTaxCredit(numQualifyingChildren: number, agi: number, filingStatus: keyof typeof FEDERAL_BRACKETS_2024): number {
  const baseCredit = numQualifyingChildren * TAX_CREDITS_2024.childTaxCredit;
  const phaseoutThreshold = TAX_CREDITS_2024.childTaxCreditPhaseout[filingStatus];
  
  if (agi <= phaseoutThreshold) {
    return baseCredit;
  }
  
  const excessIncome = agi - phaseoutThreshold;
  const phaseoutAmount = Math.floor(excessIncome / 1000) * 50 * numQualifyingChildren;
  
  return Math.max(0, baseCredit - phaseoutAmount);
}

// Calculate Earned Income Credit (simplified)
export function calculateEIC(earnedIncome: number, _numChildren: number, filingStatus: keyof typeof FEDERAL_BRACKETS_2024): number {
  // Simplified calculation - actual EIC has complex phase-in and phase-out
  const maxEIC = TAX_CREDITS_2024.earnedIncomeCredit.maxAmount;
  const phaseoutStart = TAX_CREDITS_2024.earnedIncomeCredit.phaseout[filingStatus];
  
  if (earnedIncome < 10000) {
    return Math.min(earnedIncome * 0.34, maxEIC);
  } else if (earnedIncome < phaseoutStart) {
    return maxEIC;
  } else {
    const phaseoutIncome = earnedIncome - phaseoutStart;
    const phaseoutAmount = phaseoutIncome * 0.21;
    return Math.max(0, maxEIC - phaseoutAmount);
  }
}

// Estimate quarterly taxes for self-employed
export function estimateQuarterlyTaxes(estimatedAnnualIncome: number, filingStatus: keyof typeof FEDERAL_BRACKETS_2024, stateCode: string = 'california'): { quarterly: number; annual: number } {
  const selfEmploymentTax = estimatedAnnualIncome * 0.9235 * 0.153; // 92.35% of 15.3%
  const taxableIncome = estimatedAnnualIncome * 0.9235 * 0.5 + estimatedAnnualIncome; // Deduct employer portion
  
  const federalResult = calculateFederalTax(taxableIncome, filingStatus);
  const stateResult = calculateStateTax(taxableIncome, filingStatus, stateCode);
  
  const annualTax = federalResult.tax + stateResult.tax + selfEmploymentTax;
  const quarterlyTax = annualTax / 4;
  
  return { quarterly: quarterlyTax, annual: annualTax };
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
