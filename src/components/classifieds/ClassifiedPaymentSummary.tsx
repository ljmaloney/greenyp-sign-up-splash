
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Calendar, Package } from 'lucide-react';
import { Classified } from '@/types/classifieds';
import { AdPackage } from '@/types/adPackages';

interface ClassifiedPaymentSummaryProps {
  classified: Classified;
  adPackage: AdPackage;
}

const ClassifiedPaymentSummary = ({ classified, adPackage }: ClassifiedPaymentSummaryProps) => {
  const subtotal = adPackage.monthlyPrice;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Ad Package</span>
            <span className="text-greenyp-600 font-semibold">{adPackage.adTypeName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Monthly Price
            </span>
            <span>${adPackage.monthlyPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Billing Period
            </span>
            <span>1 Month</span>
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-greenyp-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <p className="text-blue-800">
            Your ad will be published immediately after payment confirmation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedPaymentSummary;
