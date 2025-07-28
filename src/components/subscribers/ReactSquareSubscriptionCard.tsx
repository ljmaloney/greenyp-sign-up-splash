import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processReactSquarePayment } from '@/utils/reactSquarePaymentProcessor';
import ReactSquareCard from '@/components/payment/ReactSquareCard';

interface ReactSquareSubscriptionCardProps {
  billingContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emailValidationToken: string;
  producerId: string;
  paymentType?: 'SUBSCRIPTION' | 'CLASSIFIED' | 'PAYMENT_UPDATE';
  onPaymentProcessed?: (result: any) => void;
}

const ReactSquareSubscriptionCard: React.FC<ReactSquareSubscriptionCardProps> = ({ 
  billingContact, 
  billingAddress, 
  emailValidationToken,
  producerId,
  paymentType = 'SUBSCRIPTION',
  onPaymentProcessed 
}) => {
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

    if ( paymentType !== 'PAYMENT_UPDATE'
         && (!emailValidationToken || emailValidationToken.trim() === '')) {
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
        paymentType,
        { 
          billingContact: billingContact,
          billingAddress: billingAddress
        }
      );
      
      // Check if payment was completed successfully
      if (paymentResponse.response?.paymentStatus === 'COMPLETED') {
        if ( paymentType === 'SUBSCRIPTION' ) {
          console.log('Subscription payment completed successfully');

          toast({
            title: "Payment Successful",
            description: "Your subscription payment has been processed successfully.",
          });

          // Navigate to subscription confirmation - using the correct path defined in App.tsx
          navigate('/subscribers/signup/confirmation');
        }
        else if ( paymentType === 'PAYMENT_UPDATE' ) {
          console.log('Subscription payment method successfully updated');
          toast({
            title: "Payment Method Updated",
            description: "Your subscription payment method has been updated successfully.",
          });
        }
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
      disabled={!emailValidationToken && paymentType !== 'PAYMENT_UPDATE'}
      error={error}
      buttonText= {paymentType !== 'PAYMENT_UPDATE' ? "Process Subscription Payment" : "Update Payment Method"}
    />
  );
};

export default ReactSquareSubscriptionCard;