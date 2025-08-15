
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processReactSquarePayment, ProcessPaymentResult } from '@/utils/reactSquarePaymentProcessor';
import ReactSquareCard from '@/components/payment/ReactSquareCard';

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

interface ReactSquarePaymentCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  emailValidationToken: string;
  onPaymentProcessed?: (result: ProcessPaymentResult) => void;
}

const ReactSquarePaymentCard = ({ 
  billingContact, 
  billingAddress, 
  emailValidationToken, 
  onPaymentProcessed 
}: ReactSquarePaymentCardProps) => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();
  const { toast } = useToast();

  const handlePaymentSuccess = async (tokenData: any) => {
    if (!classifiedId) {
      setError('Missing classified ID');
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
      const paymentResponse = await processReactSquarePayment(
        tokenData,
        classifiedId,
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
        
        // Extract payment reference information from response
        const responseData = paymentResponse.response;
        const orderRef = responseData.orderRef || '';
        const paymentRef = responseData.paymentRef || '';
        const receiptNumber = responseData.receiptNumber || '';
        
        // Build confirmation URL with payment reference data
        const confirmationParams = new URLSearchParams();
        confirmationParams.set('paymentSuccess', 'true');
        if (orderRef) confirmationParams.set('orderRef', orderRef);
        if (paymentRef) confirmationParams.set('paymentRef', paymentRef);
        if (receiptNumber) confirmationParams.set('receiptNumber', receiptNumber);
        
        // Redirect to payment confirmation page with payment reference data
        const confirmationUrl = `/classifieds/payment/confirmation/${classifiedId}?${confirmationParams.toString()}`;
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
      
      onPaymentProcessed?.(paymentResponse);
    } catch (err) {
      console.error('Payment processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: "Payment Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  return (
    <ReactSquareCard
      billingContact={billingContact}
      billingAddress={billingAddress}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentError={handlePaymentError}
      isProcessing={isProcessing}
      disabled={!emailValidationToken}
      error={error}
    />
  );
};

export default ReactSquarePaymentCard;
