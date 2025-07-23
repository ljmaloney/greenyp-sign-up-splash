
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
    console.log('💳 useUnifiedSquarePayment - Processing payment with enhanced validation', {
      paymentType,
      hasCard: !!card,
      hasPayments: !!payments,
      producerId,
      classifiedId,
      hasEmailToken: !!emailValidationToken,
      billingContact: {
        hasFirstName: !!billingContact.firstName,
        hasLastName: !!billingContact.lastName,
        hasEmail: !!billingContact.email,
        hasPhone: !!billingContact.phone
      },
      billingAddress: {
        hasAddress: !!billingAddress.address,
        hasCity: !!billingAddress.city,
        hasState: !!billingAddress.state,
        hasZipCode: !!billingAddress.zipCode
      }
    });

    if (!card || !payments) {
      setError('Payment form not initialized properly. Please refresh and try again.');
      console.error('❌ Payment form not initialized', { hasCard: !!card, hasPayments: !!payments });
      return;
    }

    // Enhanced validation with detailed error messages
    const validationError = validatePaymentFields(billingContact, billingAddress);
    if (validationError) {
      setError(`Incomplete information: ${validationError}`);
      toast({
        title: "Required Information Missing",
        description: validationError,
        variant: "destructive",
      });
      console.error('❌ Validation failed', { validationError, billingContact, billingAddress });
      return;
    }

    // Validate email validation token with specific error
    if (!emailValidationToken || emailValidationToken.trim() === '') {
      const errorMsg = 'Email validation token is required before processing payment';
      setError(errorMsg);
      toast({
        title: "Email Validation Required",
        description: "Please validate your email address first",
        variant: "destructive",
      });
      console.error('❌ Email validation token missing');
      return;
    }

    // Validate required IDs based on payment type with specific errors
    if (paymentType === 'classified' && !classifiedId) {
      const errorMsg = 'Classified ID is missing - cannot process payment';
      setError(errorMsg);
      console.error('❌ Classified ID missing for classified payment');
      return;
    }

    if (paymentType === 'subscription' && !producerId) {
      const errorMsg = 'Producer ID is missing - cannot process subscription payment';
      setError(errorMsg);
      console.error('❌ Producer ID missing for subscription payment');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('🚀 useUnifiedSquarePayment - Starting payment processing...');

      const paymentResponse = await processSquarePayment(
        card,
        payments,
        billingContact,
        billingAddress,
        paymentType === 'classified' ? classifiedId : producerId,
        apiClient,
        emailValidationToken,
        { isSubscription: paymentType === 'subscription' }
      );
      
      console.log('📋 useUnifiedSquarePayment - Payment response received', {
        status: paymentResponse.response?.paymentStatus,
        hasResponse: !!paymentResponse.response,
        responseKeys: paymentResponse.response ? Object.keys(paymentResponse.response) : []
      });
      
      // Check if payment was completed successfully
      if (paymentResponse.response?.paymentStatus === 'COMPLETED') {
        console.log('✅ useUnifiedSquarePayment - Payment completed successfully');
        
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        
        // Handle navigation based on payment type with enhanced logging
        if (paymentType === 'classified') {
          const responseData = paymentResponse.response ?? {};
          const orderRef = responseData.orderRef ?? '';
          const paymentRef = responseData.paymentRef ?? '';
          const receiptNumber = responseData.receiptNumber ?? '';
          
          console.log('🧾 useUnifiedSquarePayment - Classified payment references', {
            orderRef,
            paymentRef,
            receiptNumber
          });
          
          const confirmationParams = new URLSearchParams();
          confirmationParams.set('paymentSuccess', 'true');
          if (orderRef) confirmationParams.set('orderRef', orderRef);
          if (paymentRef) confirmationParams.set('paymentRef', paymentRef);
          if (receiptNumber) confirmationParams.set('receiptNumber', receiptNumber);
          
          const confirmationUrl = `/classifieds/payment/confirmation/${classifiedId}?${confirmationParams.toString()}`;
          console.log('🔗 useUnifiedSquarePayment - Navigating to:', confirmationUrl);
          navigate(confirmationUrl);
        } else {
          // Navigate to subscription confirmation
          console.log('🔗 useUnifiedSquarePayment - Navigating to subscription confirmation');
          navigate('/subscribers/payment/confirmation');
        }
      } else {
        const status = paymentResponse.response?.paymentStatus || 'UNKNOWN';
        console.error('❌ useUnifiedSquarePayment - Payment not completed', { 
          status,
          response: paymentResponse.response 
        });
        setError(`Payment was not completed. Status: ${status}`);
        toast({
          title: "Payment Issue",
          description: `Payment status: ${status}. Please try again.`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('❌ useUnifiedSquarePayment - Payment processing error:', err);
      
      // Enhanced error handling with specific messages
      let errorMessage = 'Payment processing failed';
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error occurred. Please check your connection and try again.';
        } else if (err.message.includes('400')) {
          errorMessage = 'Invalid payment information. Please check your details and try again.';
        } else if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = 'Authentication error. Please refresh the page and try again.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error occurred. Please try again in a few moments.';
        } else {
          errorMessage = `Payment error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      console.log('🏁 useUnifiedSquarePayment - Payment processing completed');
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
