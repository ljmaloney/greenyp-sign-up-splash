
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processSquarePayment } from '@/utils/squarePaymentProcessor';
import PaymentMethodCard from './PaymentMethodCard';

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

interface SquarePaymentMethodCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  emailValidationToken: string;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  payments: any;
  card: any;
  squareError: string | null;
  setSquareError: (error: string | null) => void;
}

const SquarePaymentMethodCard = ({ 
  billingContact, 
  billingAddress, 
  emailValidationToken,
  cardContainerRef,
  payments,
  card,
  squareError,
  setSquareError
}: SquarePaymentMethodCardProps) => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const apiClient = useApiClient();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!card || !payments || !classifiedId) {
      setSquareError('Payment form not initialized or missing classified ID');
      return;
    }

    // Validate all required fields before proceeding
    const validationError = validatePaymentFields(billingContact, billingAddress);
    if (validationError) {
      setSquareError(validationError);
      toast({
        title: "Required Information Missing",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Validate email validation token
    if (!emailValidationToken || emailValidationToken.trim() === '') {
      setSquareError('Email validation token is required');
      toast({
        title: "Required Information Missing",
        description: "Email validation token is required",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setSquareError(null);

    try {
      const paymentResponse = await processSquarePayment(
        card,
        payments,
        billingContact,
        billingAddress,
        classifiedId,
        apiClient,
        emailValidationToken
      );
      
      // Check if payment was completed successfully
      if (paymentResponse.response?.paymentStatus === 'COMPLETED') {
        console.log('Payment completed successfully, redirecting to classified detail page with success parameter');
        
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        
        // Redirect to classified detail page with success parameter
        const detailUrl = `/classifieds/${classifiedId}?paymentSuccess=true`;
        console.log('Redirecting to:', detailUrl);
        navigate(detailUrl);
      } else {
        console.log('Payment not completed, status:', paymentResponse.response?.paymentStatus);
        setSquareError('Payment was not completed successfully');
        toast({
          title: "Payment Issue",
          description: "There was an issue completing your payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setSquareError('Payment processing failed');
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
    <PaymentMethodCard
      cardContainerRef={cardContainerRef}
      error={squareError}
      isProcessing={isProcessing}
      onPayment={handlePayment}
      isCardReady={!!card}
    />
  );
};

export default SquarePaymentMethodCard;
