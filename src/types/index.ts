export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ssn: string;
  dateOfBirth: string;
  occupation: string;
  filingStatus: 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold';
}

export interface SpouseInfo {
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string;
  occupation: string;
}

export interface Dependent {
  id: string;
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string;
  relationship: string;
  monthsLivedWithYou: number;
  isStudent: boolean;
  isDisabled: boolean;
  isChildTaxCreditEligible: boolean;
  isDependentCareEligible: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface W2Info {
  id: string;
  employerName: string;
  employerEIN: string;
  wages: number;
  federalTaxWithheld: number;
  socialSecurityWages: number;
  socialSecurityTaxWithheld: number;
  medicareWages: number;
  medicareTaxWithheld: number;
  stateWages: number;
  stateTaxWithheld: number;
  localWages: number;
  localTaxWithheld: number;
}

export interface IncomeData {
  // W-2 Income
  w2Forms: W2Info[];
  
  // Other Income
  interestIncome: number;
  dividendIncome: number;
  businessIncome: number;
  capitalGainsLongTerm: number;
  capitalGainsShortTerm: number;
  rentalIncome: number;
  unemploymentCompensation: number;
  socialSecurityBenefits: number;
  otherIncome: number;
  
  // Income adjustments (above-the-line deductions)
  studentLoanInterest: number;
  selfEmploymentTaxDeduction: number;
  retirementContributions: number;
  hsaContributions: number;
  alimonyPaid: number;
}

export interface DeductionData {
  useStandardDeduction: boolean;
  
  // Itemized Deductions
  medicalExpenses: number;
  stateAndLocalTaxes: number;
  mortgageInterest: number;
  charitableCash: number;
  charitableNonCash: number;
  otherDeductions: number;
}

export interface CreditData {
  // Child and Dependent Credits
  numQualifyingChildren: number;
  childAndDependentCareExpenses: number;
  
  // Education Credits
  educationExpenses: number;
  educationCreditType: 'americanOpportunity' | 'lifetimeLearning' | 'none';
  
  // Retirement Savings
  retirementContributions: number;
  agiForRetirementCredit: number;
  
  // Energy Credits
  solarEnergyCredit: number;
  evCredit: number;
  
  // Other Credits
  foreignTaxCredit: number;
  otherCredits: number;
}

export interface TaxReturn {
  personalInfo: PersonalInfo;
  spouseInfo?: SpouseInfo;
  dependents: Dependent[];
  address: Address;
  income: IncomeData;
  deductions: DeductionData;
  credits: CreditData;
}

export interface TaxBracketBreakdown {
  bracket: string;
  amount: number;
  tax: number;
}

export interface TaxSummary {
  totalIncome: number;
  adjustedGrossIncome: number;
  taxableIncome: number;
  standardDeduction: number;
  itemizedDeductions: number;
  totalDeductions: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  totalTax: number;
  totalCredits: number;
  taxBeforeCredits: number;
  taxAfterCredits: number;
  refundOrOwed: number;
  federalWithheld: number;
  stateWithheld: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  federalTaxBreakdown: TaxBracketBreakdown[];
  stateTaxBreakdown: TaxBracketBreakdown[];
}

export interface Form1040 {
  // Personal Information
  firstName: string;
  lastName: string;
  ssn: string;
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseSsn?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Filing Status
  filingStatus: string;
  
  // Income
  wages: number;
  interestIncome: number;
  dividendIncome: number;
  iraDistributions: number;
  pensionIncome: number;
  socialSecurityBenefits: number;
  otherIncome: number;
  totalIncome: number;
  
  // Adjustments
  studentLoanInterest: number;
  selfEmploymentTaxDeduction: number;
  retirementContributions: number;
  hsaContributions: number;
  alimonyPaid: number;
  totalAdjustments: number;
  adjustedGrossIncome: number;
  
  // Deductions
  standardDeduction: number;
  itemizedDeductions: number;
  qualifiedBusinessIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  
  // Tax and Credits
  tax: number;
  childTaxCredit: number;
  otherCredits: number;
  totalCredits: number;
  taxAfterCredits: number;
  
  // Other Taxes
  selfEmploymentTaxOwed: number;
  additionalMedicareTax: number;
  netInvestmentIncomeTax: number;
  totalOtherTaxes: number;
  totalTax: number;
  
  // Payments
  federalWithholding: number;
  estimatedPayments: number;
  earnedIncomeCredit: number;
  additionalChildTaxCredit: number;
  americanOpportunityCredit: number;
  totalPayments: number;
  
  // Refund or Amount Due
  refund: number;
  amountOwed: number;
  estimatedTaxPenalty: number;
}

export type WizardStep = 
  | 'welcome'
  | 'personal-info'
  | 'filing-status'
  | 'dependents'
  | 'income-w2'
  | 'income-other'
  | 'deductions'
  | 'credits'
  | 'review'
  | 'results';

export interface WizardStepInfo {
  id: WizardStep;
  title: string;
  description: string;
  icon: string;
}
