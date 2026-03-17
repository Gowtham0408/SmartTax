import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowRight, ArrowLeft, Receipt, Home, Heart, Building2, Check, Calculator } from 'lucide-react';
import { STANDARD_DEDUCTIONS_2024 } from '@/lib/taxEngine';
import { cn } from '@/lib/utils';

export function DeductionsStep() {
  const { deductions, setDeductions, personalInfo, setCurrentStep, markStepComplete } = useTaxStore();
  const [showComparison, setShowComparison] = useState(false);

  const standardDeduction = STANDARD_DEDUCTIONS_2024[personalInfo.filingStatus];
  
  const itemizedTotal = 
    Math.min(deductions.stateAndLocalTaxes, 10000) + // SALT cap
    deductions.mortgageInterest +
    deductions.charitableCash +
    deductions.charitableNonCash +
    Math.max(0, deductions.medicalExpenses - (0.075 * 0)) + // Medical expenses exceeding 7.5% of AGI
    deductions.otherDeductions;

  const handleContinue = () => {
    markStepComplete('deductions');
    setCurrentStep('credits');
  };

  const handleBack = () => {
    setCurrentStep('income-other');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Receipt className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Deductions</h2>
          <p className="text-gray-600">Choose your deduction method</p>
        </div>
      </div>

      {/* Deduction Method Selection */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setDeductions({ useStandardDeduction: true })}
          className={cn(
            'p-6 rounded-xl border-2 text-left transition-all',
            deductions.useStandardDeduction
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
              deductions.useStandardDeduction ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            )}>
              {deductions.useStandardDeduction && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Deduction</h3>
          <p className="text-gray-600 mb-3">Simple and automatic. No receipts needed.</p>
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm text-gray-500">Your standard deduction:</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(standardDeduction)}</p>
          </div>
        </button>

        <button
          onClick={() => setDeductions({ useStandardDeduction: false })}
          className={cn(
            'p-6 rounded-xl border-2 text-left transition-all',
            !deductions.useStandardDeduction
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
            <div className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
              !deductions.useStandardDeduction ? 'border-green-500 bg-green-500' : 'border-gray-300'
            )}>
              {!deductions.useStandardDeduction && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Itemized Deductions</h3>
          <p className="text-gray-600 mb-3">Deduct specific expenses. Requires documentation.</p>
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm text-gray-500">Your itemized total:</p>
            <p className={cn(
              'text-2xl font-bold',
              itemizedTotal > standardDeduction ? 'text-green-600' : 'text-gray-400'
            )}>
              {formatCurrency(itemizedTotal)}
            </p>
          </div>
        </button>
      </div>

      {/* Itemized Deductions Form */}
      {!deductions.useStandardDeduction && (
        <div className="space-y-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Itemize only if your total deductions exceed the standard deduction of {formatCurrency(standardDeduction)}.
            </p>
          </div>

          {/* State and Local Taxes */}
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">State and Local Taxes (SALT)</h4>
                    <p className="text-sm text-gray-500">State income tax, property tax, sales tax</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={deductions.stateAndLocalTaxes || ''}
                    onChange={(e) => setDeductions({ stateAndLocalTaxes: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="max-w-xs"
                  />
                  <span className="text-sm text-gray-500">(Capped at $10,000)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mortgage Interest */}
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Home Mortgage Interest</h4>
                    <p className="text-sm text-gray-500">Interest on loans up to $750,000</p>
                  </div>
                </div>
                <Input
                  type="number"
                  value={deductions.mortgageInterest || ''}
                  onChange={(e) => setDeductions({ mortgageInterest: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>

          {/* Charitable Contributions */}
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-3">Charitable Contributions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Cash donations</Label>
                    <Input
                      type="number"
                      value={deductions.charitableCash || ''}
                      onChange={(e) => setDeductions({ charitableCash: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Non-cash donations</Label>
                    <Input
                      type="number"
                      value={deductions.charitableNonCash || ''}
                      onChange={(e) => setDeductions({ charitableNonCash: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Expenses */}
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Medical and Dental Expenses</h4>
                    <p className="text-sm text-gray-500">Only amounts exceeding 7.5% of AGI</p>
                  </div>
                </div>
                <Input
                  type="number"
                  value={deductions.medicalExpenses || ''}
                  onChange={(e) => setDeductions({ medicalExpenses: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>

          {/* Other Deductions */}
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Receipt className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Other Itemized Deductions</h4>
                    <p className="text-sm text-gray-500">Casualty losses, gambling losses, etc.</p>
                  </div>
                </div>
                <Input
                  type="number"
                  value={deductions.otherDeductions || ''}
                  onChange={(e) => setDeductions({ otherDeductions: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison */}
      {showComparison && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Deduction Comparison</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Standard Deduction</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(standardDeduction)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Itemized Deductions</p>
              <p className={cn(
                'text-3xl font-bold',
                itemizedTotal > standardDeduction ? 'text-green-600' : 'text-gray-400'
              )}>
                {formatCurrency(itemizedTotal)}
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg">
              <strong>Recommended:</strong>{' '}
              <span className={itemizedTotal > standardDeduction ? 'text-green-600' : 'text-blue-600'}>
                {itemizedTotal > standardDeduction ? 'Itemize Deductions' : 'Standard Deduction'}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Saves you {formatCurrency(Math.abs(itemizedTotal - standardDeduction))} more
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          {!deductions.useStandardDeduction && (
            <Button variant="outline" onClick={() => setShowComparison(!showComparison)}>
              <Calculator className="w-4 h-4 mr-2" />
              {showComparison ? 'Hide' : 'Compare'}
            </Button>
          )}
          <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
