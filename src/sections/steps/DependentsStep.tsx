import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowRight, ArrowLeft, Users, Plus, Trash2, Edit2, Check } from 'lucide-react';
import type { Dependent } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

export function DependentsStep() {
  const { dependents, addDependent, updateDependent, removeDependent, setCurrentStep, markStepComplete } = useTaxStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDependent, setEditingDependent] = useState<Dependent | null>(null);
  const [newDependent, setNewDependent] = useState<Partial<Dependent>>({
    firstName: '',
    lastName: '',
    ssn: '',
    dateOfBirth: '',
    relationship: '',
    monthsLivedWithYou: 12,
    isStudent: false,
    isDisabled: false,
    isChildTaxCreditEligible: true,
    isDependentCareEligible: false,
  });

  const handleContinue = () => {
    markStepComplete('dependents');
    setCurrentStep('income-w2');
  };

  const handleBack = () => {
    setCurrentStep('filing-status');
  };

  const handleAddDependent = () => {
    if (newDependent.firstName && newDependent.lastName && newDependent.ssn) {
      const dependent: Dependent = {
        id: Date.now().toString(),
        firstName: newDependent.firstName,
        lastName: newDependent.lastName,
        ssn: newDependent.ssn,
        dateOfBirth: newDependent.dateOfBirth || '',
        relationship: newDependent.relationship || '',
        monthsLivedWithYou: newDependent.monthsLivedWithYou || 12,
        isStudent: newDependent.isStudent || false,
        isDisabled: newDependent.isDisabled || false,
        isChildTaxCreditEligible: newDependent.isChildTaxCreditEligible ?? true,
        isDependentCareEligible: newDependent.isDependentCareEligible || false,
      };
      addDependent(dependent);
      setNewDependent({
        firstName: '',
        lastName: '',
        ssn: '',
        dateOfBirth: '',
        relationship: '',
        monthsLivedWithYou: 12,
        isStudent: false,
        isDisabled: false,
        isChildTaxCreditEligible: true,
        isDependentCareEligible: false,
      });
      setIsDialogOpen(false);
    }
  };

  const handleEditDependent = (dependent: Dependent) => {
    setEditingDependent(dependent);
    setNewDependent(dependent);
    setIsDialogOpen(true);
  };

  const handleUpdateDependent = () => {
    if (editingDependent && newDependent.firstName && newDependent.lastName) {
      updateDependent(editingDependent.id, {
        ...newDependent,
      } as Dependent);
      setEditingDependent(null);
      setNewDependent({
        firstName: '',
        lastName: '',
        ssn: '',
        dateOfBirth: '',
        relationship: '',
        monthsLivedWithYou: 12,
        isStudent: false,
        isDisabled: false,
        isChildTaxCreditEligible: true,
        isDependentCareEligible: false,
      });
      setIsDialogOpen(false);
    }
  };

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  };

  const openAddDialog = () => {
    setEditingDependent(null);
    setNewDependent({
      firstName: '',
      lastName: '',
      ssn: '',
      dateOfBirth: '',
      relationship: '',
      monthsLivedWithYou: 12,
      isStudent: false,
      isDisabled: false,
      isChildTaxCreditEligible: true,
      isDependentCareEligible: false,
    });
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dependents</h2>
          <p className="text-gray-600">Add any dependents you claim on your tax return</p>
        </div>
      </div>

      {dependents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl mb-6">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dependents added</h3>
          <p className="text-gray-600 mb-4">Add children or other dependents you support</p>
          <Button onClick={openAddDialog} variant="outline" className="border-dashed border-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Dependent
          </Button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {dependents.map((dependent) => (
            <div key={dependent.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {dependent.firstName[0]}{dependent.lastName[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{dependent.firstName} {dependent.lastName}</h4>
                  <p className="text-sm text-gray-600">{dependent.relationship} • SSN: {dependent.ssn}</p>
                  <div className="flex gap-2 mt-1">
                    {dependent.isChildTaxCreditEligible && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Child Tax Credit</span>
                    )}
                    {dependent.isDependentCareEligible && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Dependent Care</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditDependent(dependent)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeDependent(dependent.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={openAddDialog} variant="outline" className="w-full border-dashed border-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Dependent
          </Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDependent ? 'Edit Dependent' : 'Add Dependent'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={newDependent.firstName}
                  onChange={(e) => setNewDependent({ ...newDependent, firstName: e.target.value })}
                  placeholder="Child"
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={newDependent.lastName}
                  onChange={(e) => setNewDependent({ ...newDependent, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SSN *</Label>
                <Input
                  value={newDependent.ssn}
                  onChange={(e) => setNewDependent({ ...newDependent, ssn: formatSSN(e.target.value) })}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={newDependent.dateOfBirth}
                  onChange={(e) => setNewDependent({ ...newDependent, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Relationship</Label>
                <Input
                  value={newDependent.relationship}
                  onChange={(e) => setNewDependent({ ...newDependent, relationship: e.target.value })}
                  placeholder="Son, Daughter, etc."
                />
              </div>
              <div>
                <Label>Months Lived With You</Label>
                <Input
                  type="number"
                  min={0}
                  max={12}
                  value={newDependent.monthsLivedWithYou}
                  onChange={(e) => setNewDependent({ ...newDependent, monthsLivedWithYou: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isStudent"
                  checked={newDependent.isStudent}
                  onCheckedChange={(checked) => setNewDependent({ ...newDependent, isStudent: checked as boolean })}
                />
                <Label htmlFor="isStudent" className="cursor-pointer">Is a full-time student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDisabled"
                  checked={newDependent.isDisabled}
                  onCheckedChange={(checked) => setNewDependent({ ...newDependent, isDisabled: checked as boolean })}
                />
                <Label htmlFor="isDisabled" className="cursor-pointer">Is permanently disabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isChildTaxCreditEligible"
                  checked={newDependent.isChildTaxCreditEligible}
                  onCheckedChange={(checked) => setNewDependent({ ...newDependent, isChildTaxCreditEligible: checked as boolean })}
                />
                <Label htmlFor="isChildTaxCreditEligible" className="cursor-pointer">Qualifies for Child Tax Credit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDependentCareEligible"
                  checked={newDependent.isDependentCareEligible}
                  onCheckedChange={(checked) => setNewDependent({ ...newDependent, isDependentCareEligible: checked as boolean })}
                />
                <Label htmlFor="isDependentCareEligible" className="cursor-pointer">Qualifies for Dependent Care Credit</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={editingDependent ? handleUpdateDependent : handleAddDependent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              {editingDependent ? 'Update' : 'Add'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
