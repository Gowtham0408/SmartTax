import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowRight, ArrowLeft, Users, User, Heart, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';

const filingOptions = [
  {
    id: 'single',
    title: 'Single',
    description: 'You are unmarried or legally separated',
    icon: User,
  },
  {
    id: 'marriedJoint',
    title: 'Married Filing Jointly',
    description: 'You and your spouse file together',
    icon: Heart,
  },
  {
    id: 'marriedSeparate',
    title: 'Married Filing Separately',
    description: 'You and your spouse file separately',
    icon: UserMinus,
  },
  {
    id: 'headOfHousehold',
    title: 'Head of Household',
    description: 'You pay more than half the costs of keeping up a home for yourself and a qualifying person',
    icon: Users,
  },
];

export function FilingStatusStep() {
  const { personalInfo, setPersonalInfo, setCurrentStep, markStepComplete, spouseInfo, setSpouseInfo } = useTaxStore();
  const [showSpouseInfo, setShowSpouseInfo] = useState(personalInfo.filingStatus === 'marriedJoint');

  const handleSelect = (status: typeof personalInfo.filingStatus) => {
    setPersonalInfo({ filingStatus: status });
    setShowSpouseInfo(status === 'marriedJoint');
  };

  const handleContinue = () => {
    markStepComplete('filing-status');
    setCurrentStep('dependents');
  };

  const handleBack = () => {
    setCurrentStep('personal-info');
  };

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Filing Status</h2>
          <p className="text-gray-600">Select your filing status for 2024</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {filingOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = personalInfo.filingStatus === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id as typeof personalInfo.filingStatus)}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4',
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  'font-semibold',
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                )}>
                  {option.title}
                </h3>
                <p className={cn(
                  'text-sm mt-1',
                  isSelected ? 'text-blue-700' : 'text-gray-600'
                )}>
                  {option.description}
                </p>
              </div>
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              )}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Spouse Information (if married filing jointly) */}
      {showSpouseInfo && (
        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Spouse Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse First Name</label>
              <input
                type="text"
                value={spouseInfo.firstName}
                onChange={(e) => setSpouseInfo({ firstName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Last Name</label>
              <input
                type="text"
                value={spouseInfo.lastName}
                onChange={(e) => setSpouseInfo({ lastName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse SSN</label>
              <input
                type="text"
                value={spouseInfo.ssn}
                onChange={(e) => setSpouseInfo({ ssn: formatSSN(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="XXX-XX-XXXX"
                maxLength={11}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Date of Birth</label>
              <input
                type="date"
                value={spouseInfo.dateOfBirth}
                onChange={(e) => setSpouseInfo({ dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Occupation</label>
              <input
                type="text"
                value={spouseInfo.occupation}
                onChange={(e) => setSpouseInfo({ occupation: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Teacher"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
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
