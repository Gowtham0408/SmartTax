import { Button } from '@/components/ui/button';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowRight, Shield, Calculator, FileText, Clock } from 'lucide-react';

export function WelcomeStep() {
  const setCurrentStep = useTaxStore((state) => state.setCurrentStep);
  const markStepComplete = useTaxStore((state) => state.markStepComplete);

  const handleStart = () => {
    markStepComplete('welcome');
    setCurrentStep('personal-info');
  };

  return (
    <div className="text-center py-8">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">SmartTax</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your AI-powered tax filing assistant. We'll guide you through every step to maximize your refund and file with confidence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <Calculator className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Smart Calculations</h3>
          <p className="text-sm text-gray-600">Accurate tax calculations with real-time updates</p>
        </div>
        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
          <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
          <p className="text-sm text-gray-600">Bank-level encryption protects your data</p>
        </div>
        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
          <FileText className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Form Generation</h3>
          <p className="text-sm text-gray-600">Auto-generate IRS forms ready for filing</p>
        </div>
        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
          <Clock className="w-10 h-10 text-orange-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Save Time</h3>
          <p className="text-sm text-gray-600">Complete your return in minutes, not hours</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl mb-8 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">What you'll need:</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">Social Security Number</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">W-2 Forms from employers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">1099 Forms (if applicable)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">Bank account for direct deposit</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">Last year's tax return (optional)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">Deduction receipts (if itemizing)</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleStart}
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        Start Your Tax Return
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>

      <p className="mt-4 text-sm text-gray-500">
        Free to start. Pay only when you file.
      </p>
    </div>
  );
}
