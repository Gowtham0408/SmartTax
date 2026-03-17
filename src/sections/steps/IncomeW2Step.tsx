import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowRight, ArrowLeft, Briefcase, Plus, Trash2, Edit2, Check, DollarSign } from 'lucide-react';
import type { W2Info } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function IncomeW2Step() {
  const { income, addW2Form, updateW2Form, removeW2Form, setCurrentStep, markStepComplete } = useTaxStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingW2, setEditingW2] = useState<W2Info | null>(null);
  const [newW2, setNewW2] = useState<Partial<W2Info>>({
    employerName: '',
    employerEIN: '',
    wages: 0,
    federalTaxWithheld: 0,
    socialSecurityWages: 0,
    socialSecurityTaxWithheld: 0,
    medicareWages: 0,
    medicareTaxWithheld: 0,
    stateWages: 0,
    stateTaxWithheld: 0,
    localWages: 0,
    localTaxWithheld: 0,
  });

  const handleContinue = () => {
    markStepComplete('income-w2');
    setCurrentStep('income-other');
  };

  const handleBack = () => {
    setCurrentStep('dependents');
  };

  const handleAddW2 = () => {
    if (newW2.employerName && newW2.wages !== undefined) {
      const w2: W2Info = {
        id: Date.now().toString(),
        employerName: newW2.employerName,
        employerEIN: newW2.employerEIN || '',
        wages: Number(newW2.wages) || 0,
        federalTaxWithheld: Number(newW2.federalTaxWithheld) || 0,
        socialSecurityWages: Number(newW2.socialSecurityWages) || Number(newW2.wages) || 0,
        socialSecurityTaxWithheld: Number(newW2.socialSecurityTaxWithheld) || 0,
        medicareWages: Number(newW2.medicareWages) || Number(newW2.wages) || 0,
        medicareTaxWithheld: Number(newW2.medicareTaxWithheld) || 0,
        stateWages: Number(newW2.stateWages) || Number(newW2.wages) || 0,
        stateTaxWithheld: Number(newW2.stateTaxWithheld) || 0,
        localWages: Number(newW2.localWages) || 0,
        localTaxWithheld: Number(newW2.localTaxWithheld) || 0,
      };
      addW2Form(w2);
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const handleUpdateW2 = () => {
    if (editingW2 && newW2.employerName) {
      updateW2Form(editingW2.id, {
        ...newW2,
        wages: Number(newW2.wages) || 0,
        federalTaxWithheld: Number(newW2.federalTaxWithheld) || 0,
        socialSecurityWages: Number(newW2.socialSecurityWages) || Number(newW2.wages) || 0,
        socialSecurityTaxWithheld: Number(newW2.socialSecurityTaxWithheld) || 0,
        medicareWages: Number(newW2.medicareWages) || Number(newW2.wages) || 0,
        medicareTaxWithheld: Number(newW2.medicareTaxWithheld) || 0,
        stateWages: Number(newW2.stateWages) || Number(newW2.wages) || 0,
        stateTaxWithheld: Number(newW2.stateTaxWithheld) || 0,
        localWages: Number(newW2.localWages) || 0,
        localTaxWithheld: Number(newW2.localTaxWithheld) || 0,
      });
      setEditingW2(null);
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const resetForm = () => {
    setNewW2({
      employerName: '',
      employerEIN: '',
      wages: 0,
      federalTaxWithheld: 0,
      socialSecurityWages: 0,
      socialSecurityTaxWithheld: 0,
      medicareWages: 0,
      medicareTaxWithheld: 0,
      stateWages: 0,
      stateTaxWithheld: 0,
      localWages: 0,
      localTaxWithheld: 0,
    });
  };

  const handleEditW2 = (w2: W2Info) => {
    setEditingW2(w2);
    setNewW2(w2);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingW2(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const totalWages = income.w2Forms.reduce((sum, w2) => sum + w2.wages, 0);
  const totalFederalWithheld = income.w2Forms.reduce((sum, w2) => sum + w2.federalTaxWithheld, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">W-2 Income</h2>
          <p className="text-gray-600">Add your W-2 forms from employers</p>
        </div>
      </div>

      {income.w2Forms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl mb-6">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No W-2 forms added</h3>
          <p className="text-gray-600 mb-4">Add your W-2 forms from all employers</p>
          <Button onClick={openAddDialog} variant="outline" className="border-dashed border-2">
            <Plus className="w-4 h-4 mr-2" />
            Add W-2 Form
          </Button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Wages</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalWages)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Federal Tax Withheld</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalFederalWithheld)}</p>
              </div>
            </div>
          </div>

          {income.w2Forms.map((w2) => (
            <div key={w2.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{w2.employerName}</h4>
                    <p className="text-sm text-gray-600">EIN: {w2.employerEIN || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditW2(w2)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeW2Form(w2.id)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Wages</p>
                  <p className="font-medium">{formatCurrency(w2.wages)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Federal Withheld</p>
                  <p className="font-medium text-blue-600">{formatCurrency(w2.federalTaxWithheld)}</p>
                </div>
                <div>
                  <p className="text-gray-500">State Withheld</p>
                  <p className="font-medium text-green-600">{formatCurrency(w2.stateTaxWithheld)}</p>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={openAddDialog} variant="outline" className="w-full border-dashed border-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Another W-2
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingW2 ? 'Edit W-2 Form' : 'Add W-2 Form'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Employer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employer Name *</Label>
                <Input
                  value={newW2.employerName}
                  onChange={(e) => setNewW2({ ...newW2, employerName: e.target.value })}
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <Label>Employer EIN</Label>
                <Input
                  value={newW2.employerEIN}
                  onChange={(e) => setNewW2({ ...newW2, employerEIN: e.target.value })}
                  placeholder="XX-XXXXXXX"
                />
              </div>
            </div>

            {/* Wages */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Wages and Tax Withheld
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Box 1 - Wages, tips, other compensation</Label>
                  <Input
                    type="number"
                    value={newW2.wages || ''}
                    onChange={(e) => setNewW2({ ...newW2, wages: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Box 2 - Federal income tax withheld</Label>
                  <Input
                    type="number"
                    value={newW2.federalTaxWithheld || ''}
                    onChange={(e) => setNewW2({ ...newW2, federalTaxWithheld: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Social Security */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Social Security</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Box 3 - Social Security wages</Label>
                  <Input
                    type="number"
                    value={newW2.socialSecurityWages || ''}
                    onChange={(e) => setNewW2({ ...newW2, socialSecurityWages: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Box 4 - Social Security tax withheld</Label>
                  <Input
                    type="number"
                    value={newW2.socialSecurityTaxWithheld || ''}
                    onChange={(e) => setNewW2({ ...newW2, socialSecurityTaxWithheld: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Medicare */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Medicare</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Box 5 - Medicare wages</Label>
                  <Input
                    type="number"
                    value={newW2.medicareWages || ''}
                    onChange={(e) => setNewW2({ ...newW2, medicareWages: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Box 6 - Medicare tax withheld</Label>
                  <Input
                    type="number"
                    value={newW2.medicareTaxWithheld || ''}
                    onChange={(e) => setNewW2({ ...newW2, medicareTaxWithheld: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* State and Local */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">State and Local Taxes</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Box 16 - State wages</Label>
                  <Input
                    type="number"
                    value={newW2.stateWages || ''}
                    onChange={(e) => setNewW2({ ...newW2, stateWages: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Box 17 - State income tax</Label>
                  <Input
                    type="number"
                    value={newW2.stateTaxWithheld || ''}
                    onChange={(e) => setNewW2({ ...newW2, stateTaxWithheld: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Box 18 - Local wages</Label>
                  <Input
                    type="number"
                    value={newW2.localWages || ''}
                    onChange={(e) => setNewW2({ ...newW2, localWages: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Box 19 - Local income tax</Label>
                  <Input
                    type="number"
                    value={newW2.localTaxWithheld || ''}
                    onChange={(e) => setNewW2({ ...newW2, localTaxWithheld: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={editingW2 ? handleUpdateW2 : handleAddW2}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              {editingW2 ? 'Update' : 'Add'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
