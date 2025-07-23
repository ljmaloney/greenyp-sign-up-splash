
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Edit } from 'lucide-react';
import { PaymentMethod } from '@/types/payment';

interface SavedPaymentMethodProps {
  paymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: Error | null;
}

const SavedPaymentMethod = ({ paymentMethod, isLoading, error }: SavedPaymentMethodProps) => {
  // Format card expiry date
  const formatExpiryDate = (month: number, year: number) => {
    if (!month || !year) return 'N/A';
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString().slice(-2);
    return `${monthStr}/${yearStr}`;
  };

  // Check if error is a 404 (no payment method found)
  const isPaymentMethodNotFound = error?.message?.includes('404');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-greenyp-600" />
            Payment Method
          </div>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Update
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-gray-600">Loading payment method...</p>
        ) : error ? (
          <p className="text-gray-600">
            {isPaymentMethodNotFound 
              ? "No payment method on file. Add a payment method to get started." 
              : "Error loading payment method"
            }
          </p>
        ) : paymentMethod ? (
          <>
            <div>
              <p className="text-sm text-gray-600">Card Type</p>
              <p className="font-medium">
                {paymentMethod.cardDetails.cardBrand} ending in {paymentMethod.cardDetails.last4}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expires</p>
              <p className="font-medium">
                {formatExpiryDate(paymentMethod.cardDetails.expMonth, paymentMethod.cardDetails.expYear)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cardholder Name</p>
              <p className="font-medium">{paymentMethod.cardDetails.cardholderName || 'N/A'}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-600">No payment method on file</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedPaymentMethod;
