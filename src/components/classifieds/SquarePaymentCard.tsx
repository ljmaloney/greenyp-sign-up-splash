import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { useSquarePayment } from '@/hooks/useSquarePayment';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processSquarePayment } from '@/utils/squarePaymentProcessor';
import PaymentMethodCard from '../payment/PaymentMethodCard';
import SquarePaymentWrapper from '../payment/SquarePaymentWrapper';
import { BillingContactData, BillingAddressData } from '@/types/billing';

interface SquarePaymentCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  emailValidationToken: string;
  onPaymentProcessed?: (result: any) => void;
}

const SquarePaymentCard = ({ billingContact, billingAddress, emailValidationToken, onPaymentProcessed }: SquarePaymentCardProps) => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const apiClient = useApiClient();
  const { toast } = useToast();

  const {
    cardContainerRef,
    payments,
    card,
    error,
    setError,
    cleanup
  } = useSquarePayment();

  const handlePayment = async () => {
    if (!card || !payments || !classifiedId) {
      setError('Payment form not initialized or missing classified ID');
      return;
    }

    // Create billing address with companyName defaulting to empty string
    const billingAddressWithCompany = {
      ...billingAddress,
      companyName: billingAddress.companyName || ''
    };

    // Validate all required fields before proceeding
    const validationError = validatePaymentFields(billingContact, billingAddressWithCompany);
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
      const paymentResponse = await processSquarePayment(
        card,
        payments,
        billingContact,
        billingAddressWithCompany,
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
        const responseData = paymentResponse.response || {};
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

  const handleRetry = () => {
    // Clear error and trigger cleanup/reinit
    setError(null);
    cleanup();
  };

  return (
    <SquarePaymentWrapper onRetry={handleRetry}>
      <PaymentMethodCard
        cardContainerRef={cardContainerRef}
        error={error}
        isProcessing={isProcessing}
        onPayment={handlePayment}
        isCardReady={!!card}
      />
    </SquarePaymentWrapper>
  );
};

export default SquarePaymentCard;
