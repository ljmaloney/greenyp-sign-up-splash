import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PaymentMethod } from '@/types/payment';
import { formatPhoneNumber } from '@/utils/phoneFormatting';

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

  // Format phone number using US standard format
  const formatPhoneDisplay = (phone: string) => {
    if (!phone) {
      console.log('❌ Missing phone number');
      return 'Not provided';
    }
    
    console.log('🔎 Debug - Raw phone number:', phone);
    console.log('🔎 Debug - Phone number type:', typeof phone);
    console.log('🔎 Debug - Phone number length:', phone.length);
    
    try {
      const formatted = formatPhoneNumber(phone);
      console.log('📞 Debug - Formatted phone number:', formatted);
      return formatted || 'Invalid format';
    } catch (error) {
      console.error('❌ Error formatting phone number:', error);
      return 'Error formatting number';
    }
  };

  // Check if error is a 404 (no payment method found)
  const isPaymentMethodNotFound = error?.message?.includes('404');

  // Debug the payment method data
  React.useEffect(() => {
    if (paymentMethod) {
      console.log('💳 Debug - Payment method data:', paymentMethod);
      console.log('📞 Debug - Phone number field value:', paymentMethod.phoneNumber);
    }
  }, [paymentMethod]);

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
              <p className="text-gray-600 mt-2">Phone: {formatPhoneDisplay(paymentMethod.phoneNumber)}</p>
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