import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowRight, ArrowLeft, User } from 'lucide-react';

export function PersonalInfoStep() {
  const { personalInfo, setPersonalInfo, setCurrentStep, markStepComplete, setAddress, address } = useTaxStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!personalInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!personalInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!personalInfo.ssn.trim()) newErrors.ssn = 'SSN is required';
    else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(personalInfo.ssn)) newErrors.ssn = 'Invalid SSN format';
    if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!personalInfo.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!address.street.trim()) newErrors.street = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(address.zipCode)) newErrors.zipCode = 'Invalid ZIP code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      markStepComplete('personal-info');
      setCurrentStep('filing-status');
    }
  };

  const handleBack = () => {
    setCurrentStep('welcome');
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
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-600">Tell us about yourself</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={personalInfo.firstName}
              onChange={(e) => setPersonalInfo({ firstName: e.target.value })}
              placeholder="John"
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={personalInfo.lastName}
              onChange={(e) => setPersonalInfo({ lastName: e.target.value })}
              placeholder="Doe"
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* SSN and DOB */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ssn">Social Security Number *</Label>
            <Input
              id="ssn"
              value={personalInfo.ssn}
              onChange={(e) => setPersonalInfo({ ssn: formatSSN(e.target.value) })}
              placeholder="XXX-XX-XXXX"
              maxLength={11}
              className={errors.ssn ? 'border-red-500' : ''}
            />
            {errors.ssn && <p className="text-sm text-red-500 mt-1">{errors.ssn}</p>}
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={personalInfo.dateOfBirth}
              onChange={(e) => setPersonalInfo({ dateOfBirth: e.target.value })}
              className={errors.dateOfBirth ? 'border-red-500' : ''}
            />
            {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
          </div>
        </div>

        {/* Occupation */}
        <div>
          <Label htmlFor="occupation">Occupation *</Label>
          <Input
            id="occupation"
            value={personalInfo.occupation}
            onChange={(e) => setPersonalInfo({ occupation: e.target.value })}
            placeholder="Software Engineer"
            className={errors.occupation ? 'border-red-500' : ''}
          />
          {errors.occupation && <p className="text-sm text-red-500 mt-1">{errors.occupation}</p>}
        </div>

        {/* Contact Info (Optional) */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Address */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Home Address</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={address.street}
                onChange={(e) => setAddress({ street: e.target.value })}
                placeholder="123 Main Street"
                className={errors.street ? 'border-red-500' : ''}
              />
              {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => setAddress({ city: e.target.value })}
                  placeholder="Los Angeles"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => setAddress({ state: e.target.value.toUpperCase() })}
                  placeholder="CA"
                  maxLength={2}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ zipCode: e.target.value })}
                  placeholder="90210"
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
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
