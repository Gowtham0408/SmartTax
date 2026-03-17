import type { WizardStep } from '@/types';
import { useTaxStore } from '@/hooks/useTaxStore';
import { Check } from 'lucide-react';

interface WizardProgressProps {
  steps: readonly { id: string; title: string }[];
  currentStep: WizardStep;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  const completedSteps = useTaxStore((state) => state.completedSteps);
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="hidden md:flex items-center justify-between gap-2 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id as WizardStep);
        const isCurrent = step.id === currentStep;
        const isAccessible = index <= currentStepIndex || isCompleted;

        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isCurrent 
                  ? 'bg-blue-100 text-blue-700' 
                  : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : isAccessible
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-50 text-gray-400'
              }`}
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCurrent 
                    ? 'bg-blue-600 text-white' 
                    : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-4 h-0.5 mx-1 ${
                isCompleted ? 'bg-green-400' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
