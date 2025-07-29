
import { useState, useCallback } from 'react';

interface BillingContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BillingAddressData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UseSquareFormProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
}

export const useSquareForm = ({
  billingContact,
  billingAddress,
  onPaymentSuccess,
  onPaymentError
}: UseSquareFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const cardTokenizeResponseReceived = useCallback(async (token: any) => {
    if (!token) {
      onPaymentError('Failed to generate payment token');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('💳 Processing Square payment token...');
      
      // Simulate successful payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = {
        token: token.token || 'mock_token',
        billingContact,
        billingAddress,
        verificationDetails: {
          amount: '1.00',
          currencyCode: 'USD',
          intent: 'CHARGE'
        }
      };

      onPaymentSuccess(result);
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  }, [billingContact, billingAddress, onPaymentSuccess, onPaymentError]);

  return {
    cardTokenizeResponseReceived,
    isProcessing
  };
};
