import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTaxStore } from '@/hooks/useTaxStore';
import { ArrowLeft, Download, RotateCcw, CheckCircle, AlertCircle, TrendingUp, DollarSign, Percent, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TaxBracketBreakdown } from '@/types';

export function ResultsStep() {
  const { taxSummary, setCurrentStep, resetTaxReturn, address } = useTaxStore();

  useEffect(() => {
    if (!taxSummary) {
      setCurrentStep('review');
    }
  }, [taxSummary, setCurrentStep]);

  const handleStartOver = () => {
    resetTaxReturn();
  };

  const handleBack = () => {
    setCurrentStep('review');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!taxSummary) {
    return null;
  }

  const isRefund = taxSummary.refundOrOwed > 0;
  const effectiveRate = taxSummary.effectiveTaxRate;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Tax Results</h2>
          <p className="text-gray-600">Here's your 2024 tax summary</p>
        </div>
      </div>

      {/* Main Result Card */}
      <div className={`rounded-2xl p-8 mb-6 text-center ${isRefund ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-orange-500 to-red-500'} text-white`}>
        <p className="text-lg opacity-90 mb-2">
          {isRefund ? 'Your Estimated Refund' : 'Amount You Owe'}
        </p>
        <p className="text-5xl md:text-6xl font-bold mb-4">
          {formatCurrency(Math.abs(taxSummary.refundOrOwed))}
        </p>
        <div className="flex items-center justify-center gap-2 opacity-90">
          {isRefund ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Great news! You'll get a refund</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              <span>You'll need to pay this amount</span>
            </>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-lg font-bold">{formatCurrency(taxSummary.totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">AGI</p>
            <p className="text-lg font-bold">{formatCurrency(taxSummary.adjustedGrossIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Percent className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Effective Rate</p>
            <p className="text-lg font-bold">{effectiveRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Taxable Income</p>
            <p className="text-lg font-bold">{formatCurrency(taxSummary.taxableIncome)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Tabs defaultValue="summary" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="breakdown">Tax Breakdown</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income & Deductions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Income</span>
                <span className="font-medium">{formatCurrency(taxSummary.totalIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Adjustments to Income</span>
                <span className="font-medium text-green-600">-{formatCurrency(taxSummary.totalIncome - taxSummary.adjustedGrossIncome)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">Adjusted Gross Income (AGI)</span>
                <span className="font-bold">{formatCurrency(taxSummary.adjustedGrossIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deductions</span>
                <span className="font-medium text-green-600">-{formatCurrency(taxSummary.totalDeductions)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">Taxable Income</span>
                <span className="font-bold">{formatCurrency(taxSummary.taxableIncome)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tax Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Federal Income Tax</span>
                <span className="font-medium">{formatCurrency(taxSummary.federalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">State Income Tax</span>
                <span className="font-medium">{formatCurrency(taxSummary.stateTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">FICA Tax</span>
                <span className="font-medium">{formatCurrency(taxSummary.ficaTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tax Before Credits</span>
                <span className="font-medium">{formatCurrency(taxSummary.taxBeforeCredits)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Credits</span>
                <span className="font-medium text-green-600">-{formatCurrency(taxSummary.totalCredits)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">Total Tax</span>
                <span className="font-bold">{formatCurrency(taxSummary.totalTax)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payments & Refund</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Federal Tax Withheld</span>
                <span className="font-medium">{formatCurrency(taxSummary.federalWithheld)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tax</span>
                <span className="font-medium">{formatCurrency(taxSummary.totalTax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">{isRefund ? 'Refund Amount' : 'Amount Due'}</span>
                <span className={`font-bold text-lg ${isRefund ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(taxSummary.refundOrOwed))}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Federal Tax Brackets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {taxSummary.federalTaxBreakdown?.map((bracket: TaxBracketBreakdown, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{bracket.bracket}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(bracket.amount)} taxed</p>
                    </div>
                    <span className="font-medium">{formatCurrency(bracket.tax)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {taxSummary.stateTaxBreakdown && taxSummary.stateTaxBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">State Tax Brackets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {taxSummary.stateTaxBreakdown.map((bracket: TaxBracketBreakdown, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{bracket.bracket}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(bracket.amount)} taxed</p>
                      </div>
                      <span className="font-medium">{formatCurrency(bracket.tax)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generated Tax Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Form 1040</p>
                    <p className="text-sm text-gray-500">U.S. Individual Income Tax Return</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Schedule 1</p>
                    <p className="text-sm text-gray-500">Additional Income and Adjustments</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              {taxSummary.stateTax > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">State Tax Return ({address.state})</p>
                      <p className="text-sm text-gray-500">State income tax return</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleStartOver} variant="outline" className="text-gray-600">
          <RotateCcw className="w-4 h-4 mr-2" />
          Start New Return
        </Button>
      </div>
    </div>
  );
}
