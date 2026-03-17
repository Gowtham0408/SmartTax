import { Button } from '@/components/ui/button';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowLeft, FileText, User, Briefcase, Receipt, Star, Check, AlertCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function ReviewStep() {
  const { 
    personalInfo, 
    spouseInfo, 
    dependents, 
    address, 
    income, 
    deductions, 
    credits,
    setCurrentStep, 
    markStepComplete,
  } = useTaxStore();

  const handleContinue = () => {
    markStepComplete('review');
    setCurrentStep('results');
  };

  const handleBack = () => {
    setCurrentStep('credits');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalWages = income.w2Forms.reduce((sum, w2) => sum + w2.wages, 0);
  const totalFederalWithheld = income.w2Forms.reduce((sum, w2) => sum + w2.federalTaxWithheld, 0);

  const getFilingStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      single: 'Single',
      marriedJoint: 'Married Filing Jointly',
      marriedSeparate: 'Married Filing Separately',
      headOfHousehold: 'Head of Household'
    };
    return labels[status] || status;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review Your Return</h2>
          <p className="text-gray-600">Double-check your information before calculating</p>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['personal']} className="space-y-3">
        {/* Personal Information */}
        <AccordionItem value="personal" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gray-50">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Personal Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-gray-500">SSN</p>
                <p className="font-medium">{personalInfo.ssn}</p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-medium">{personalInfo.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-gray-500">Occupation</p>
                <p className="font-medium">{personalInfo.occupation}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium">{address.street}, {address.city}, {address.state} {address.zipCode}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Filing Status</p>
                <p className="font-medium">{getFilingStatusLabel(personalInfo.filingStatus)}</p>
              </div>
              {personalInfo.filingStatus === 'marriedJoint' && (
                <>
                  <div>
                    <p className="text-gray-500">Spouse Name</p>
                    <p className="font-medium">{spouseInfo.firstName} {spouseInfo.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Spouse SSN</p>
                    <p className="font-medium">{spouseInfo.ssn}</p>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dependents */}
        <AccordionItem value="dependents" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gray-50">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Dependents ({dependents.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4">
            {dependents.length === 0 ? (
              <p className="text-gray-500">No dependents claimed</p>
            ) : (
              <div className="space-y-3">
                {dependents.map((dep) => (
                  <div key={dep.id} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium">{dep.firstName} {dep.lastName}</p>
                    <p className="text-sm text-gray-600">{dep.relationship} • SSN: {dep.ssn}</p>
                    <div className="flex gap-2 mt-2">
                      {dep.isChildTaxCreditEligible && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Child Tax Credit</span>
                      )}
                      {dep.isDependentCareEligible && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Dependent Care</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Income */}
        <AccordionItem value="income" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gray-50">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Income</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4">
            <div className="space-y-4">
              {/* W-2 Summary */}
              <div>
                <p className="font-medium text-gray-900 mb-2">W-2 Income ({income.w2Forms.length} forms)</p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Wages</span>
                    <span className="font-medium">{formatCurrency(totalWages)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Federal Tax Withheld</span>
                    <span className="font-medium text-blue-600">{formatCurrency(totalFederalWithheld)}</span>
                  </div>
                </div>
              </div>

              {/* Other Income */}
              <div>
                <p className="font-medium text-gray-900 mb-2">Other Income</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {income.interestIncome > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest</span>
                      <span>{formatCurrency(income.interestIncome)}</span>
                    </div>
                  )}
                  {income.dividendIncome > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dividends</span>
                      <span>{formatCurrency(income.dividendIncome)}</span>
                    </div>
                  )}
                  {income.businessIncome > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business</span>
                      <span>{formatCurrency(income.businessIncome)}</span>
                    </div>
                  )}
                  {(income.capitalGainsLongTerm + income.capitalGainsShortTerm) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capital Gains</span>
                      <span>{formatCurrency(income.capitalGainsLongTerm + income.capitalGainsShortTerm)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Deductions */}
        <AccordionItem value="deductions" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gray-50">
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Deductions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Method</span>
                <span className="font-medium">
                  {deductions.useStandardDeduction ? 'Standard Deduction' : 'Itemized Deductions'}
                </span>
              </div>
              {!deductions.useStandardDeduction && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2 text-sm space-y-1">
                  {deductions.stateAndLocalTaxes > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">State & Local Taxes</span>
                      <span>{formatCurrency(Math.min(deductions.stateAndLocalTaxes, 10000))}</span>
                    </div>
                  )}
                  {deductions.mortgageInterest > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mortgage Interest</span>
                      <span>{formatCurrency(deductions.mortgageInterest)}</span>
                    </div>
                  )}
                  {(deductions.charitableCash + deductions.charitableNonCash) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Charitable</span>
                      <span>{formatCurrency(deductions.charitableCash + deductions.charitableNonCash)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Credits */}
        <AccordionItem value="credits" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gray-50">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold">Credits</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4">
            <div className="space-y-2 text-sm">
              {dependents.filter(d => d.isChildTaxCreditEligible).length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Child Tax Credit</span>
                  <span>{formatCurrency(dependents.filter(d => d.isChildTaxCreditEligible).length * 2000)}</span>
                </div>
              )}
              {credits.childAndDependentCareExpenses > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dependent Care Credit</span>
                  <span>{formatCurrency(Math.min(credits.childAndDependentCareExpenses * 0.35, 3000))}</span>
                </div>
              )}
              {credits.educationCreditType !== 'none' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Education Credit</span>
                  <span>{formatCurrency(credits.educationCreditType === 'americanOpportunity' ? 2500 : 2000)}</span>
                </div>
              )}
              {(credits.solarEnergyCredit + credits.evCredit) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Energy Credits</span>
                  <span>{formatCurrency(credits.solarEnergyCredit + credits.evCredit)}</span>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Confirmation */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-900">Important Notice</p>
            <p className="text-sm text-yellow-800 mt-1">
              By continuing, you confirm that all information provided is accurate to the best of your knowledge. 
              This is a demo application for educational purposes only.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
          <Check className="w-4 h-4 mr-2" />
          Calculate My Return
        </Button>
      </div>
    </div>
  );
}
