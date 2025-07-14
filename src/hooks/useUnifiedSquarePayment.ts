
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processSquarePayment } from '@/utils/squarePaymentProcessor';
import { processSquareSignUpTokens } from '@/utils/squareSignUpTokenProcessor';

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

  const processPayment = async (card: any, payments: any) => {
    if (!card || !payments) {
      setError('Payment form not initialized');
      return;
    }

    // For classified payments, we need classifiedId
    if (paymentType === 'classified' && !classifiedId) {
      setError('Missing classified ID');
      return;
    }

    // For subscription payments, we need producerId
    if (paymentType === 'subscription' && !producerId) {
      setError('Missing producer ID');
      return;
    }

    // Validate all required fields before proceeding
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

    setIsProcessing(true);
    setError(null);

    try {
      if (paymentType === 'classified') {
        // Process classified payment
        const paymentResponse = await processSquarePayment(
          card,
          payments,
          billingContact,
          billingAddress,
          classifiedId!,
          apiClient,
          emailValidationToken
        );
        
        // Check if payment was completed successfully
        if (paymentResponse.response?.paymentStatus === 'COMPLETED') {
          console.log('Payment completed successfully, redirecting to confirmation page');
          
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully.",
          });
          
          // Redirect to payment confirmation page
          const confirmationUrl = `/classifieds/payment/confirmation/${classifiedId}?paymentSuccess=true`;
          console.log('Redirecting to:', confirmationUrl);
          navigate(confirmationUrl);
        } else {
          console.log('Payment not completed, status:', paymentResponse.response?.paymentStatus);
          setError('Payment was not completed successfully');
          toast({
            title: "Payment Issue",
            description: "There was an issue completing your payment. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Process subscription sign-up payment
        const { paymentToken, verificationToken } = await processSquareSignUpTokens(
          card,
          payments,
          billingContact,
          billingAddress
        );

        // Submit the initial payment to the signup endpoint
        const paymentData = {
          producerId: producerId,
          paymentMethod: "SQUARE",
          payorName: `${billingContact.firstName} ${billingContact.lastName}`,
          payorAddress1: billingAddress.address,
          payorAddress2: "",
          payorCity: billingAddress.city,
          payorState: billingAddress.state,
          payorPostalCode: billingAddress.zipCode,
          actionType: "APPLY_ONCE",
          cycleType: "MONTHLY",
          paymentToken: paymentToken,
          verificationToken: verificationToken,
          emailValidationToken: emailValidationToken
        };

        console.log('Submitting signup payment data:', paymentData);
        
        const paymentResponse = await apiClient.post('/account/applyInitialPayment', paymentData, { requireAuth: false });
        console.log('Payment submission response:', paymentResponse);
        
        // Check if payment was completed successfully
        if (paymentResponse.response?.paymentStatus === 'COMPLETED' || paymentResponse.status === 200) {
          console.log('Payment completed successfully, redirecting to confirmation');
          
          toast({
            title: "Payment Successful",
            description: "Your subscription has been activated successfully!",
          });
          
          // Redirect to confirmation page
          navigate('/subscriber/signup/confirmation?paymentSuccess=true');
        } else {
          console.log('Payment not completed, status:', paymentResponse.response?.paymentStatus);
          setError('Payment was not completed successfully');
          toast({
            title: "Payment Issue",
            description: "There was an issue completing your payment. Please try again.",
            variant: "destructive",
          });
        }
      }
      
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Payment processing failed');
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    error,
    setError,
    processPayment
  };
};
