import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowRight, ArrowLeft, Baby, GraduationCap, Sun, Globe, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function CreditsStep() {
  const { credits, setCredits, dependents, setCurrentStep, markStepComplete } = useTaxStore();
  const qualifyingChildren = dependents.filter(d => d.isChildTaxCreditEligible).length;

  const handleContinue = () => {
    markStepComplete('credits');
    setCurrentStep('review');
  };

  const handleBack = () => {
    setCurrentStep('deductions');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate estimated credits
  const childTaxCredit = qualifyingChildren * 2000;
  const dependentCareCredit = Math.min(credits.childAndDependentCareExpenses * 0.35, 3000);
  const educationCredit = credits.educationCreditType === 'americanOpportunity' ? 2500 : 
                         credits.educationCreditType === 'lifetimeLearning' ? 2000 : 0;
  const totalEstimatedCredits = childTaxCredit + dependentCareCredit + educationCredit + 
                                credits.solarEnergyCredit + credits.evCredit + credits.foreignTaxCredit + credits.otherCredits;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
          <Star className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tax Credits</h2>
          <p className="text-gray-600">Credits directly reduce your tax bill dollar-for-dollar</p>
        </div>
      </div>

      {/* Estimated Credits Summary */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-600">Estimated Total Credits</p>
        <p className="text-2xl font-bold text-yellow-700">{formatCurrency(totalEstimatedCredits)}</p>
      </div>

      <div className="space-y-6">
        {/* Child Tax Credit */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Baby className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Child Tax Credit</h3>
              <p className="text-sm text-gray-600 mb-3">
                Up to $2,000 per qualifying child under age 17
              </p>
              {qualifyingChildren > 0 ? (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    You have <strong>{qualifyingChildren}</strong> qualifying child(ren)
                  </p>
                  <p className="text-lg font-semibold text-green-700 mt-1">
                    Estimated credit: {formatCurrency(childTaxCredit)}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    No qualifying children added. Add dependents to claim this credit.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Child and Dependent Care Credit */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Baby className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Child and Dependent Care Credit</h3>
              <p className="text-sm text-gray-600 mb-3">
                Expenses for childcare while you work (up to $3,000 for one child, $6,000 for two or more)
              </p>
              <div>
                <Label>Care expenses paid in 2024</Label>
                <Input
                  type="number"
                  value={credits.childAndDependentCareExpenses || ''}
                  onChange={(e) => setCredits({ childAndDependentCareExpenses: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="max-w-xs"
                />
                {credits.childAndDependentCareExpenses > 0 && (
                  <p className="text-sm text-purple-600 mt-2">
                    Estimated credit: {formatCurrency(dependentCareCredit)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Education Credits */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Education Credits</h3>
              <p className="text-sm text-gray-600 mb-3">
                Expenses for higher education
              </p>
              
              <RadioGroup
                value={credits.educationCreditType}
                onValueChange={(value) => setCredits({ educationCreditType: value as 'americanOpportunity' | 'lifetimeLearning' | 'none' })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="americanOpportunity" id="americanOpportunity" />
                  <Label htmlFor="americanOpportunity" className="flex-1 cursor-pointer">
                    <span className="font-medium">American Opportunity Credit</span>
                    <p className="text-sm text-gray-500">Up to $2,500 per student (first 4 years)</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="lifetimeLearning" id="lifetimeLearning" />
                  <Label htmlFor="lifetimeLearning" className="flex-1 cursor-pointer">
                    <span className="font-medium">Lifetime Learning Credit</span>
                    <p className="text-sm text-gray-500">Up to $2,000 per return (no limit on years)</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="none" id="noEducation" />
                  <Label htmlFor="noEducation" className="flex-1 cursor-pointer">
                    <span className="font-medium">No Education Credit</span>
                  </Label>
                </div>
              </RadioGroup>

              {credits.educationCreditType !== 'none' && (
                <div className="mt-4">
                  <Label>Qualified education expenses</Label>
                  <Input
                    type="number"
                    value={credits.educationExpenses || ''}
                    onChange={(e) => setCredits({ educationExpenses: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Energy Credits */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sun className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Energy Credits</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label className="text-sm text-gray-500">Solar/energy improvements</Label>
                  <Input
                    type="number"
                    value={credits.solarEnergyCredit || ''}
                    onChange={(e) => setCredits({ solarEnergyCredit: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">30% credit available</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Electric vehicle credit</Label>
                  <Input
                    type="number"
                    value={credits.evCredit || ''}
                    onChange={(e) => setCredits({ evCredit: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Up to $7,500 for new EVs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Foreign Tax Credit */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Foreign Tax Credit</h3>
              <p className="text-sm text-gray-600 mb-3">
                Taxes paid to foreign governments on foreign income
              </p>
              <Input
                type="number"
                value={credits.foreignTaxCredit || ''}
                onChange={(e) => setCredits({ foreignTaxCredit: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="max-w-xs"
              />
            </div>
          </div>
        </div>

        {/* Other Credits */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Other Credits</h3>
              <p className="text-sm text-gray-600 mb-3">
                Any other tax credits not listed above
              </p>
              <Input
                type="number"
                value={credits.otherCredits || ''}
                onChange={(e) => setCredits({ otherCredits: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="max-w-xs"
              />
            </div>
          </div>
        </div>
      </div>

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
