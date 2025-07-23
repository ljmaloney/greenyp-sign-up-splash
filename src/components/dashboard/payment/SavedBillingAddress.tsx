
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PaymentMethod } from '@/types/payment';

interface SavedBillingAddressProps {
  paymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: Error | null;
}

const SavedBillingAddress = ({ paymentMethod, isLoading, error }: SavedBillingAddressProps) => {
  // Format billing address
  const formatBillingAddress = () => {
    if (!paymentMethod) return 'No address on file';
    
    const parts = [
      paymentMethod.payorAddress1,
      paymentMethod.payorAddress2,
      `${paymentMethod.payorCity}, ${paymentMethod.payorState} ${paymentMethod.payorPostalCode}`
    ].filter(Boolean);
    
    return parts.join(', ') || 'No address on file';
  };

  // Check if error is a 404 (no payment method found)
  const isPaymentMethodNotFound = error?.message?.includes('404');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Address</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-gray-600">Loading billing address...</p>
        ) : error ? (
          <p className="text-gray-600">
            {isPaymentMethodNotFound 
              ? "No billing address on file. Add a payment method to set up billing address." 
              : "Error loading billing address"
            }
          </p>
        ) : paymentMethod ? (
          <>
            <p className="text-gray-900">{formatBillingAddress()}</p>
            {paymentMethod.phoneNumber && (
              <p className="text-gray-600 mt-2">Phone: {paymentMethod.phoneNumber}</p>
            )}
            {paymentMethod.emailAddress && (
              <p className="text-gray-600">Email: {paymentMethod.emailAddress}</p>
            )}
          </>
        ) : (
          <p className="text-gray-600">No billing address on file</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedBillingAddress;
