
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { useSquarePayment } from '@/hooks/useSquarePayment';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processSquarePayment } from '@/utils/squarePaymentProcessor';
import SquarePaymentForm from './SquarePaymentForm';

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

interface SquarePaymentCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  onPaymentProcessed?: (result: any) => void;
}

const SquarePaymentCard = ({ billingContact, billingAddress, onPaymentProcessed }: SquarePaymentCardProps) => {
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
    setError
  } = useSquarePayment();

  const handlePayment = async () => {
    if (!card || !payments || !classifiedId) {
      setError('Payment form not initialized or missing classified ID');
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

    setIsProcessing(true);
    setError(null);

    try {
      const paymentResponse = await processSquarePayment(
        card,
        payments,
        billingContact,
        billingAddress,
        classifiedId,
        apiClient
      );
      
      // Check if payment was completed successfully
      if (paymentResponse.response?.paymentStatus === 'COMPLETED') {
        console.log('Payment completed successfully, redirecting to classified detail page with success parameter');
        
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        
        // Redirect to classified detail page with success parameter - FIXED URL construction
        const detailUrl = `/classifieds/${classifiedId}?paymentSuccess=true`;
        console.log('Redirecting to:', detailUrl);
        navigate(detailUrl);
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

  return (
    <SquarePaymentForm
      cardContainerRef={cardContainerRef}
      error={error}
      isProcessing={isProcessing}
      onPayment={handlePayment}
      isCardReady={!!card}
    />
  );
};

export default SquarePaymentCard;
