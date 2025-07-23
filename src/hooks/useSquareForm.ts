
import { useState, useCallback } from 'react';
import { normalizePhoneForSquare } from '@/utils/phoneUtils';

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

// Define the token response type based on react-square-web-payments-sdk
interface TokenResponse {
  token?: string;
  details?: any;
  errors?: any[];
}

export const useSquareForm = ({
  billingContact,
  billingAddress,
  onPaymentSuccess,
  onPaymentError
}: UseSquareFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const cardTokenizeResponseReceived = useCallback(async (
    token: TokenResponse
  ) => {
    if (!token.token) {
      onPaymentError('Failed to generate payment token');
      return;
    }

    setIsProcessing(true);

    try {
      // Create verification details for 3D Secure
      const verificationDetails = {
        amount: '1.00',
        billingContact: {
          givenName: billingContact.firstName || 'John',
          familyName: billingContact.lastName || 'Doe',
          email: billingContact.email || 'user@example.com',
          phone: normalizePhoneForSquare(billingContact.phone) || '+13214563987',
          addressLines: [billingAddress.address || '123 Main Street'],
          city: billingAddress.city || 'Oakland',
          state: billingAddress.state || 'CA',
          countryCode: 'US',
        },
        currencyCode: 'USD',
        intent: 'CHARGE',
      };

      // Note: With react-square-web-payments-sdk, verification is handled differently
      // We'll pass the token and verification details to the parent for processing
      onPaymentSuccess({
        token: token.token,
        verificationDetails,
        billingContact,
        billingAddress
      });

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
