
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processReactSquarePayment } from '@/utils/reactSquarePaymentProcessor';
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

interface ReactSquareSubscriptionCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  emailValidationToken: string;
  producerId: string;
  onPaymentProcessed?: (result: any) => void;
}

const ReactSquareSubscriptionCard = ({ 
  billingContact, 
  billingAddress, 
  emailValidationToken,
  producerId,
  onPaymentProcessed 
}: ReactSquareSubscriptionCardProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();
  const { toast } = useToast();

  const handlePaymentSuccess = async (tokenData: any) => {
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
        producerId,
        apiClient,
        emailValidationToken,
        { 
          isSubscription: true,
          billingContact: billingContact,
          billingAddress: billingAddress
        }
      );
      
      // Check if payment was completed successfully
      if (paymentResponse.response?.paymentStatus === 'COMPLETED') {
        console.log('Subscription payment completed successfully');
        
        toast({
          title: "Payment Successful",
          description: "Your subscription payment has been processed successfully.",
        });
        
        // Navigate to subscription confirmation - using the correct path defined in App.tsx
        navigate('/subscribers/signup/confirmation');
      } else {
        console.log('Subscription payment not completed, status:', paymentResponse.response?.paymentStatus);
        setError('Subscription payment was not completed successfully');
        toast({
          title: "Payment Issue",
          description: "There was an issue completing your subscription payment. Please try again.",
          variant: "destructive",
        });
      }
      
      onPaymentProcessed?.(paymentResponse);
    } catch (err) {
      console.error('Subscription payment processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Subscription payment processing failed';
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
      buttonText="Process Subscription Payment"
    />
  );
};

export default ReactSquareSubscriptionCard;
