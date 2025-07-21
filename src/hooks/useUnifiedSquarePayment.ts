
import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processSquarePayment } from '@/utils/squarePaymentProcessor';

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

interface UseUnifiedSquarePaymentProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  emailValidationToken: string;
  paymentType: 'classified' | 'subscription';
  producerId?: string;
}

export const useUnifiedSquarePayment = ({
  billingContact,
  billingAddress,
  emailValidationToken,
  paymentType,
  producerId
}: UseUnifiedSquarePaymentProps) => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();
  const { toast } = useToast();

  const processPayment = useCallback(async (card: any, payments: any) => {
    console.log('💳 Processing unified Square payment:', {
      paymentType,
      hasCard: !!card,
      hasPayments: !!payments,
      producerId,
      classifiedId
    });

    if (!card || !payments) {
      setError('Payment form not initialized');
      return;
    }

    // Validate payment fields
    const validationError = validatePaymentFields(billingContact, billingAddress);
    if (validationError) {
      setError(validationError);
      toast({
        title: "Required Information Missing",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Validate email validation token
    if (!emailValidationToken || emailValidationToken.trim() === '') {
      setError('Email validation token is required');
      toast({
        title: "Required Information Missing",
        description: "Email validation token is required",
        variant: "destructive",
      });
      return;
    }

    // Validate required IDs based on payment type
    if (paymentType === 'classified' && !classifiedId) {
      setError('Classified ID is missing');
      return;
    }

    if (paymentType === 'subscription' && !producerId) {
      setError('Producer ID is missing');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let paymentResponse;

      // Process payment using unified approach
      paymentResponse = await processSquarePayment(
          card,
          payments,
          billingContact,
          billingAddress,
          paymentType === 'classified' ? classifiedId : producerId,
          apiClient,
          emailValidationToken,
          {isSubscription: paymentType === 'subscription'}
      );
      
      // Check if payment was completed successfully
      if (paymentResponse.response?.paymentStatus === 'COMPLETED') {
        console.log('✅ Payment completed successfully');
        
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        
        // Handle navigation based on payment type
        if (paymentType === 'classified') {
          const responseData = paymentResponse.response ?? {};
          const orderRef = responseData.orderRef ?? '';
          const paymentRef = responseData.paymentRef ?? '';
          const receiptNumber = responseData.receiptNumber ?? '';
          
          const confirmationParams = new URLSearchParams();
          confirmationParams.set('paymentSuccess', 'true');
          if (orderRef) confirmationParams.set('orderRef', orderRef);
          if (paymentRef) confirmationParams.set('paymentRef', paymentRef);
          if (receiptNumber) confirmationParams.set('receiptNumber', receiptNumber);
          
          const confirmationUrl = `/classifieds/payment/confirmation/${classifiedId}?${confirmationParams.toString()}`;
          navigate(confirmationUrl);
        } else {
          // Navigate to subscription confirmation
          navigate('/subscribers/payment/confirmation');
        }
      } else {
        console.log('❌ Payment not completed, status:', paymentResponse.response?.paymentStatus);
        setError('Payment was not completed successfully');
        toast({
          title: "Payment Issue",
          description: "There was an issue completing your payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('❌ Payment processing error:', err);
      setError('Payment processing failed');
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    billingContact,
    billingAddress,
    emailValidationToken,
    paymentType,
    producerId,
    classifiedId,
    apiClient,
    toast,
    navigate
  ]);

  return {
    isProcessing,
    error,
    setError,
    processPayment
  };
};
