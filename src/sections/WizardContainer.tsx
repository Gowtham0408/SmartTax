import { useTaxStore } from '@/hooks/useTaxStore';
import { WelcomeStep } from './steps/WelcomeStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { FilingStatusStep } from './steps/FilingStatusStep';
import { DependentsStep } from './steps/DependentsStep';
import { IncomeW2Step } from './steps/IncomeW2Step';
import { IncomeOtherStep } from './steps/IncomeOtherStep';
import { DeductionsStep } from './steps/DeductionsStep';
import { CreditsStep } from './steps/CreditsStep';
import { ReviewStep } from './steps/ReviewStep';
import { ResultsStep } from './steps/ResultsStep';
import { WizardProgress } from './WizardProgress';
import { Card } from '@/components/ui/card';

const steps = [
  { id: 'welcome', title: 'Welcome', component: WelcomeStep },
  { id: 'personal-info', title: 'Personal Info', component: PersonalInfoStep },
  { id: 'filing-status', title: 'Filing Status', component: FilingStatusStep },
  { id: 'dependents', title: 'Dependents', component: DependentsStep },
  { id: 'income-w2', title: 'W-2 Income', component: IncomeW2Step },
  { id: 'income-other', title: 'Other Income', component: IncomeOtherStep },
  { id: 'deductions', title: 'Deductions', component: DeductionsStep },
  { id: 'credits', title: 'Credits', component: CreditsStep },
  { id: 'review', title: 'Review', component: ReviewStep },
  { id: 'results', title: 'Results', component: ResultsStep },
] as const;

export function WizardContainer() {
  const currentStep = useTaxStore((state) => state.currentStep);
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const CurrentComponent = steps[currentStepIndex]?.component || WelcomeStep;
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
                  SmartTax
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Tax Filing</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <WizardProgress steps={steps} currentStep={currentStep} />
        
        <Card className="mt-6 p-6 md:p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CurrentComponent />
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>© 2024 SmartTax. All calculations are estimates for demonstration purposes.</p>
        <p className="mt-1">Consult a tax professional for official tax advice.</p>
      </footer>
    </div>
  );
}
