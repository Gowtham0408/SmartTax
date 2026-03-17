import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  PersonalInfo, 
  SpouseInfo, 
  Dependent, 
  Address, 
  W2Info, 
  IncomeData, 
  DeductionData, 
  CreditData,
  TaxReturn,
  TaxSummary,
  WizardStep
} from '@/types';
import { calculateTax, STANDARD_DEDUCTIONS_2024, calculateChildTaxCredit } from '@/lib/taxEngine';

interface TaxState {
  // Current Step
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  
  // Tax Return Data
  personalInfo: PersonalInfo;
  spouseInfo: SpouseInfo;
  dependents: Dependent[];
  address: Address;
  income: IncomeData;
  deductions: DeductionData;
  credits: CreditData;
  
  // Tax Summary
  taxSummary: TaxSummary | null;
  
  // Actions
  setCurrentStep: (step: WizardStep) => void;
  markStepComplete: (step: WizardStep) => void;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  setSpouseInfo: (info: Partial<SpouseInfo>) => void;
  addDependent: (dependent: Dependent) => void;
  updateDependent: (id: string, dependent: Partial<Dependent>) => void;
  removeDependent: (id: string) => void;
  setAddress: (address: Partial<Address>) => void;
  addW2Form: (w2: W2Info) => void;
  updateW2Form: (id: string, w2: Partial<W2Info>) => void;
  removeW2Form: (id: string) => void;
  setIncomeData: (data: Partial<IncomeData>) => void;
  setDeductions: (data: Partial<DeductionData>) => void;
  setCredits: (data: Partial<CreditData>) => void;
  calculateTaxSummary: () => void;
  resetTaxReturn: () => void;
  getTaxReturn: () => TaxReturn;
}

const initialPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  ssn: '',
  dateOfBirth: '',
  occupation: '',
  filingStatus: 'single'
};

const initialSpouseInfo: SpouseInfo = {
  firstName: '',
  lastName: '',
  ssn: '',
  dateOfBirth: '',
  occupation: ''
};

const initialAddress: Address = {
  street: '',
  city: '',
  state: '',
  zipCode: ''
};

const initialIncomeData: IncomeData = {
  w2Forms: [],
  interestIncome: 0,
  dividendIncome: 0,
  businessIncome: 0,
  capitalGainsLongTerm: 0,
  capitalGainsShortTerm: 0,
  rentalIncome: 0,
  unemploymentCompensation: 0,
  socialSecurityBenefits: 0,
  otherIncome: 0,
  studentLoanInterest: 0,
  selfEmploymentTaxDeduction: 0,
  retirementContributions: 0,
  hsaContributions: 0,
  alimonyPaid: 0
};

const initialDeductionData: DeductionData = {
  useStandardDeduction: true,
  medicalExpenses: 0,
  stateAndLocalTaxes: 0,
  mortgageInterest: 0,
  charitableCash: 0,
  charitableNonCash: 0,
  otherDeductions: 0
};

const initialCreditData: CreditData = {
  numQualifyingChildren: 0,
  childAndDependentCareExpenses: 0,
  educationExpenses: 0,
  educationCreditType: 'none',
  retirementContributions: 0,
  agiForRetirementCredit: 0,
  solarEnergyCredit: 0,
  evCredit: 0,
  foreignTaxCredit: 0,
  otherCredits: 0
};

export const useTaxStore = create<TaxState>()(
  persist(
    (set, get) => ({
      currentStep: 'welcome',
      completedSteps: [],
      personalInfo: initialPersonalInfo,
      spouseInfo: initialSpouseInfo,
      dependents: [],
      address: initialAddress,
      income: initialIncomeData,
      deductions: initialDeductionData,
      credits: initialCreditData,
      taxSummary: null,

      setCurrentStep: (step) => set({ currentStep: step }),
      
      markStepComplete: (step) => set((state) => ({
        completedSteps: state.completedSteps.includes(step) 
          ? state.completedSteps 
          : [...state.completedSteps, step]
      })),

      setPersonalInfo: (info) => set((state) => ({
        personalInfo: { ...state.personalInfo, ...info }
      })),

      setSpouseInfo: (info) => set((state) => ({
        spouseInfo: { ...state.spouseInfo, ...info }
      })),

      addDependent: (dependent) => set((state) => ({
        dependents: [...state.dependents, dependent]
      })),

      updateDependent: (id, dependent) => set((state) => ({
        dependents: state.dependents.map(d => d.id === id ? { ...d, ...dependent } : d)
      })),

      removeDependent: (id) => set((state) => ({
        dependents: state.dependents.filter(d => d.id !== id)
      })),

      setAddress: (address) => set((state) => ({
        address: { ...state.address, ...address }
      })),

      addW2Form: (w2) => set((state) => ({
        income: { ...state.income, w2Forms: [...state.income.w2Forms, w2] }
      })),

      updateW2Form: (id, w2) => set((state) => ({
        income: { 
          ...state.income, 
          w2Forms: state.income.w2Forms.map(w => w.id === id ? { ...w, ...w2 } : w) 
        }
      })),

      removeW2Form: (id) => set((state) => ({
        income: { 
          ...state.income, 
          w2Forms: state.income.w2Forms.filter(w => w.id !== id) 
        }
      })),

      setIncomeData: (data) => set((state) => ({
        income: { ...state.income, ...data }
      })),

      setDeductions: (data) => set((state) => ({
        deductions: { ...state.deductions, ...data }
      })),

      setCredits: (data) => set((state) => ({
        credits: { ...state.credits, ...data }
      })),

      calculateTaxSummary: () => {
        const state = get();
        const { personalInfo, income, deductions, credits, address } = state;
        
        // Calculate totals from W-2 forms
        const w2Wages = income.w2Forms.reduce((sum, w2) => sum + w2.wages, 0);
        const w2FederalWithheld = income.w2Forms.reduce((sum, w2) => sum + w2.federalTaxWithheld, 0);
        const w2StateWithheld = income.w2Forms.reduce((sum, w2) => sum + w2.stateTaxWithheld, 0);
        
        // Total income
        const totalIncome = w2Wages + 
          income.interestIncome + 
          income.dividendIncome + 
          income.businessIncome + 
          income.capitalGainsLongTerm + 
          income.capitalGainsShortTerm + 
          income.rentalIncome + 
          income.unemploymentCompensation + 
          income.socialSecurityBenefits * 0.85 + 
          income.otherIncome;
        
        // Adjustments to income
        const totalAdjustments = income.studentLoanInterest + 
          income.selfEmploymentTaxDeduction + 
          income.retirementContributions + 
          income.hsaContributions + 
          income.alimonyPaid;
        
        const adjustedGrossIncome = Math.max(0, totalIncome - totalAdjustments);
        
        // Deductions
        const standardDeduction = STANDARD_DEDUCTIONS_2024[personalInfo.filingStatus];
        const itemizedDeductions = deductions.medicalExpenses + 
          Math.min(deductions.stateAndLocalTaxes, 10000) + 
          deductions.mortgageInterest + 
          deductions.charitableCash + 
          deductions.charitableNonCash + 
          deductions.otherDeductions;
        
        const useStandard = deductions.useStandardDeduction || standardDeduction >= itemizedDeductions;
        const totalDeductions = useStandard ? standardDeduction : itemizedDeductions;
        
        const taxableIncome = Math.max(0, adjustedGrossIncome - totalDeductions);
        
        // Calculate tax using tax engine
        const taxpayerInfo = {
          filingStatus: personalInfo.filingStatus,
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          ssn: personalInfo.ssn,
          dateOfBirth: personalInfo.dateOfBirth,
          occupation: personalInfo.occupation,
          dependents: [],
          address: {
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode
          }
        };
        
        const incomeInfo = {
          wages: w2Wages,
          tips: 0,
          interestIncome: income.interestIncome,
          dividendIncome: income.dividendIncome,
          businessIncome: income.businessIncome,
          capitalGains: income.capitalGainsLongTerm + income.capitalGainsShortTerm,
          capitalGainsLongTerm: income.capitalGainsLongTerm,
          capitalGainsShortTerm: income.capitalGainsShortTerm,
          rentalIncome: income.rentalIncome,
          unemploymentCompensation: income.unemploymentCompensation,
          socialSecurityBenefits: income.socialSecurityBenefits,
          otherIncome: income.otherIncome,
          stateTaxRefund: 0
        };
        
        const deductionInfo = {
          useStandardDeduction: useStandard,
          standardDeduction,
          itemizedDeductions: {
            medicalExpenses: deductions.medicalExpenses,
            stateAndLocalTaxes: deductions.stateAndLocalTaxes,
            mortgageInterest: deductions.mortgageInterest,
            charitableContributions: deductions.charitableCash + deductions.charitableNonCash,
            otherDeductions: deductions.otherDeductions
          },
          aboveLineDeductions: {
            studentLoanInterest: income.studentLoanInterest,
            selfEmploymentTax: income.selfEmploymentTaxDeduction,
            retirementContributions: income.retirementContributions,
            hsaContributions: income.hsaContributions,
            alimonyPaid: income.alimonyPaid
          }
        };
        
        // Calculate child tax credit
        const qualifyingChildren = state.dependents.filter(d => d.isChildTaxCreditEligible).length;
        const childTaxCredit = calculateChildTaxCredit(
          qualifyingChildren, 
          adjustedGrossIncome, 
          personalInfo.filingStatus
        );
        
        const creditInfo = {
          childTaxCredit,
          childAndDependentCareCredit: 0, // Simplified
          earnedIncomeCredit: 0, // Simplified
          educationCredits: credits.educationCreditType === 'americanOpportunity' ? 2500 : 
                          credits.educationCreditType === 'lifetimeLearning' ? 2000 : 0,
          retirementSavingsCredit: 0, // Simplified
          foreignTaxCredit: credits.foreignTaxCredit,
          otherCredits: credits.solarEnergyCredit + credits.evCredit + credits.otherCredits
        };
        
        const taxResult = calculateTax(taxpayerInfo, incomeInfo, deductionInfo, creditInfo, address.state.toLowerCase());
        
        const taxSummary: TaxSummary = {
          totalIncome,
          adjustedGrossIncome,
          taxableIncome,
          standardDeduction,
          itemizedDeductions,
          totalDeductions,
          federalTax: taxResult.federalTax,
          stateTax: taxResult.stateTax,
          ficaTax: taxResult.ficaTax,
          totalTax: taxResult.taxAfterCredits,
          totalCredits: taxResult.totalCredits,
          taxBeforeCredits: taxResult.taxBeforeCredits,
          taxAfterCredits: taxResult.taxAfterCredits,
          refundOrOwed: w2FederalWithheld - taxResult.taxAfterCredits,
          federalWithheld: w2FederalWithheld,
          stateWithheld: w2StateWithheld,
          effectiveTaxRate: taxResult.effectiveTaxRate,
          marginalTaxRate: taxResult.marginalTaxRate,
          federalTaxBreakdown: taxResult.federalTaxBreakdown,
          stateTaxBreakdown: taxResult.stateTaxBreakdown
        };
        
        set({ taxSummary });
      },

      resetTaxReturn: () => set({
        currentStep: 'welcome',
        completedSteps: [],
        personalInfo: initialPersonalInfo,
        spouseInfo: initialSpouseInfo,
        dependents: [],
        address: initialAddress,
        income: initialIncomeData,
        deductions: initialDeductionData,
        credits: initialCreditData,
        taxSummary: null
      }),

      getTaxReturn: () => ({
        personalInfo: get().personalInfo,
        spouseInfo: get().spouseInfo,
        dependents: get().dependents,
        address: get().address,
        income: get().income,
        deductions: get().deductions,
        credits: get().credits
      })
    }),
    {
      name: 'smarttax-storage',
      partialize: (state) => ({
        personalInfo: state.personalInfo,
        spouseInfo: state.spouseInfo,
        dependents: state.dependents,
        address: state.address,
        income: state.income,
        deductions: state.deductions,
        credits: state.credits,
        completedSteps: state.completedSteps
      })
    }
  )
);
