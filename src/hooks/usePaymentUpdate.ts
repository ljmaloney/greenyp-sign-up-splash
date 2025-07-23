
import { useState, useCallback } from 'react';
import { useApiClient } from '@/hooks/useApiClient';
import { createPaymentService } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { normalizePhoneForSquare } from '@/utils/phoneUtils';
import { BillingContactData, BillingAddressData } from '@/types/billing';

interface UsePaymentUpdateProps {
  producerId: string | undefined;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const usePaymentUpdate = ({ producerId, onSuccess, onError }: UsePaymentUpdateProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();
  const paymentService = createPaymentService(apiClient);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const processPaymentUpdate = useCallback(async (
    card: any,
    payments: any,
    billingContact: BillingContactData,
    billingAddress: BillingAddressData,
    emailValidationToken: string
  ) => {
    if (!producerId) {
      const errorMsg = 'Missing producer ID';
      setError(errorMsg);
      if (onError) onError(new Error(errorMsg));
      return;
    }

    console.log('💳 Starting payment method update process');
    setIsProcessing(true);
    setError(null);

    try {
      // Tokenize the card
      const result = await card.tokenize();
      console.log('🔍 Card tokenization result:', result);

      if (result.status === 'OK') {
        console.log('✅ Card tokenized successfully, token:', result.token);
        
        // Normalize phone number
        const squareFormattedPhone = normalizePhoneForSquare(billingContact.phone);
        
        // Prepare verification details
        const verificationDetails = {
          amount: '1.00',
          billingContact: {
            givenName: billingContact.firstName,
            familyName: billingContact.lastName,
            email: billingContact.email,
            phone: squareFormattedPhone,
            addressLines: [billingAddress.address],
            city: billingAddress.city,
            state: billingAddress.state,
            countryCode: 'US',
          },
          currencyCode: 'USD',
          intent: 'STORE',
          customerInitiated: true,
          sellerKeyedIn: false,
        };

        // Verify the buyer
        const verificationResult = await payments.verifyBuyer(result.token, verificationDetails);
        console.log('✅ Verification result:', verificationResult);

        if (verificationResult?.token) {
          // Prepare billing info for API
          const billingInfo = {
            firstName: billingContact.firstName.trim(),
            lastName: billingContact.lastName.trim(),
            companyName: billingAddress.companyName.trim(),
            payorAddress1: billingAddress.address.trim(),
            payorAddress2: '',
            payorCity: billingAddress.city.trim(),
            payorState: billingAddress.state.trim(),
            payorPostalCode: billingAddress.zipCode.trim(),
            phoneNumber: squareFormattedPhone,
            emailAddress: billingContact.email.trim(),
            emailValidationToken: emailValidationToken.trim()
          };

          // Call API to replace payment method
          await paymentService.replacePaymentMethod(
            producerId,
            result.token,
            verificationResult.token,
            billingInfo
          );

          // Show success message
          toast({
            title: "Payment Method Updated",
            description: "Your payment method has been successfully updated.",
          });

          // Invalidate payment details query to refetch
          queryClient.invalidateQueries({ queryKey: ['payment-details', producerId] });

          // Call onSuccess callback
          if (onSuccess) onSuccess();
        } else {
          throw new Error('Payment verification failed');
        }
      } else {
        throw new Error('Failed to process payment card');
      }
    } catch (err: any) {
      console.error('❌ Payment update error:', err);
      
      // Format user-friendly error message
      let errorMessage = 'Failed to update payment method';
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error occurred. Please check your connection and try again.';
        } else if (err.message.includes('verification')) {
          errorMessage = 'Card verification failed. Please check your card details and try again.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) onError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  }, [producerId, apiClient, paymentService, toast, queryClient, onSuccess, onError]);

  return {
    isProcessing,
    error,
    setError,
    processPaymentUpdate
  };
};
