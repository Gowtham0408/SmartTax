import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowRight, ArrowLeft, TrendingUp, DollarSign, Building2, Briefcase, PiggyBank, Heart, Wallet } from 'lucide-react';

interface IncomeCategory {
  id: 'interestIncome' | 'dividendIncome' | 'businessIncome' | 'capitalGainsLongTerm' | 'capitalGainsShortTerm' | 'rentalIncome' | 'unemploymentCompensation' | 'socialSecurityBenefits' | 'otherIncome';
  title: string;
  description: string;
  icon: React.ElementType;
}

const incomeCategories: IncomeCategory[] = [
  { id: 'interestIncome', title: 'Interest Income', description: 'Bank interest, savings accounts, CDs', icon: PiggyBank },
  { id: 'dividendIncome', title: 'Dividend Income', description: 'Stock dividends and distributions', icon: TrendingUp },
  { id: 'businessIncome', title: 'Business Income', description: 'Self-employment, freelance, 1099-NEC', icon: Briefcase },
  { id: 'capitalGainsLongTerm', title: 'Long-term Capital Gains', description: 'Investments held over 1 year', icon: TrendingUp },
  { id: 'capitalGainsShortTerm', title: 'Short-term Capital Gains', description: 'Investments held less than 1 year', icon: TrendingUp },
  { id: 'rentalIncome', title: 'Rental Income', description: 'Property rental income', icon: Building2 },
  { id: 'unemploymentCompensation', title: 'Unemployment', description: 'Unemployment benefits (1099-G)', icon: Wallet },
  { id: 'socialSecurityBenefits', title: 'Social Security', description: 'SSA-1099 benefits', icon: Heart },
  { id: 'otherIncome', title: 'Other Income', description: 'Alimony, prizes, gambling, etc.', icon: DollarSign },
];

interface AdjustmentCategory {
  id: 'studentLoanInterest' | 'selfEmploymentTaxDeduction' | 'retirementContributions' | 'hsaContributions' | 'alimonyPaid';
  title: string;
  description: string;
  icon: React.ElementType;
}

const adjustmentCategories: AdjustmentCategory[] = [
  { id: 'studentLoanInterest', title: 'Student Loan Interest', description: 'Up to $2,500 deduction', icon: PiggyBank },
  { id: 'selfEmploymentTaxDeduction', title: 'Self-Employment Tax', description: 'Deductible portion (50%)', icon: Briefcase },
  { id: 'retirementContributions', title: 'Retirement Contributions', description: 'Traditional IRA contributions', icon: PiggyBank },
  { id: 'hsaContributions', title: 'HSA Contributions', description: 'Health Savings Account', icon: Heart },
  { id: 'alimonyPaid', title: 'Alimony Paid', description: 'Divorce agreements before 2019', icon: Wallet },
];

export function IncomeOtherStep() {
  const { income, setIncomeData, setCurrentStep, markStepComplete } = useTaxStore();
  const [activeTab, setActiveTab] = useState<'income' | 'adjustments'>('income');

  const handleContinue = () => {
    markStepComplete('income-other');
    setCurrentStep('deductions');
  };

  const handleBack = () => {
    setCurrentStep('income-w2');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalOtherIncome = 
    income.interestIncome +
    income.dividendIncome +
    income.businessIncome +
    income.capitalGainsLongTerm +
    income.capitalGainsShortTerm +
    income.rentalIncome +
    income.unemploymentCompensation +
    income.socialSecurityBenefits * 0.85 +
    income.otherIncome;

  const totalAdjustments = 
    income.studentLoanInterest +
    income.selfEmploymentTaxDeduction +
    income.retirementContributions +
    income.hsaContributions +
    income.alimonyPaid;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Other Income</h2>
          <p className="text-gray-600">Add additional income sources and adjustments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Other Income</p>
          <p className="text-xl font-bold text-green-700">{formatCurrency(totalOtherIncome)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Adjustments (Deductions)</p>
          <p className="text-xl font-bold text-blue-700">{formatCurrency(totalAdjustments)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'income'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Additional Income
        </button>
        <button
          onClick={() => setActiveTab('adjustments')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'adjustments'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Income Adjustments
        </button>
      </div>

      {/* Income Form */}
      {activeTab === 'income' && (
        <div className="space-y-4">
          {incomeCategories.map((category) => {
            const Icon = category.icon;
            const value = income[category.id] || 0;
            
            return (
              <div key={category.id} className="bg-white border rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{category.title}</h4>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(value)}</p>
                      </div>
                    </div>
                    <Input
                      type="number"
                      value={value || ''}
                      onChange={(e) => setIncomeData({ [category.id]: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Adjustments Form */}
      {activeTab === 'adjustments' && (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-800">
              These adjustments reduce your Adjusted Gross Income (AGI), which can lower your tax bill and make you eligible for more tax benefits.
            </p>
          </div>
          
          {adjustmentCategories.map((category) => {
            const Icon = category.icon;
            const value = income[category.id] || 0;
            
            return (
              <div key={category.id} className="bg-white border rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{category.title}</h4>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">{formatCurrency(value)}</p>
                      </div>
                    </div>
                    <Input
                      type="number"
                      value={value || ''}
                      onChange={(e) => setIncomeData({ [category.id]: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
