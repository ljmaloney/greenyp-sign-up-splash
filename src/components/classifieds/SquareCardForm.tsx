
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSquarePayments, SquareCardData } from '@/hooks/useSquarePayments';
import { useToast } from '@/hooks/use-toast';
import SquareCardFormHeader from './SquareCardFormHeader';
import SquareCardFormFields from './SquareCardFormFields';
import SquareCardFormPayment from './SquareCardFormPayment';
import SquareCardFormActions from './SquareCardFormActions';
import SquareCardFormError from './SquareCardFormError';

interface SquareCardFormProps {
  billingInfo: {
    cardholderName: string;
    email: string;
    phoneNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
  onTokenReceived: (tokenData: SquareCardData) => void;
  isProcessing?: boolean;
}

const SquareCardForm = ({ 
  billingInfo, 
  onInputChange, 
  onTokenReceived,
  isProcessing = false
}: SquareCardFormProps) => {
  const { toast } = useToast();
  const { isSquareReady, isLoading, error, initializeCard, tokenizeCard, clearError } = useSquarePayments();
  const cardElementRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);

  console.log('SquareCardForm render - isSquareReady:', isSquareReady, 'error:', error, 'isLoading:', isLoading);

  useEffect(() => {
    let cardInstance: any = null;

    const initialize = async () => {
      try {
        console.log('Initializing Square card...');
        cardInstance = await initializeCard('square-card');
        cardInstanceRef.current = cardInstance;
        console.log('Square card initialized successfully:', cardInstance);
      } catch (initError: any) {
        console.error('Failed to initialize Square card:', initError);
        toast({
          title: "Payment Error",
          description: initError.message || "Failed to initialize payment form.",
          variant: "destructive"
        });
      }
    };

    if (isSquareReady && !error) {
      console.log('Square is ready, initializing card...');
      initialize();
    } else {
      console.log('Square not ready or has error - isSquareReady:', isSquareReady, 'error:', error);
    }

    return () => {
      if (cardInstance) {
        console.log('Destroying card instance...');
        cardInstance.destroy();
      }
    };
  }, [isSquareReady, initializeCard, toast, error]);

  const handleTokenize = async () => {
    if (isProcessing) return;

    try {
      const billingContact = {
        givenName: billingInfo.cardholderName.split(' ')[0],
        familyName: billingInfo.cardholderName.split(' ').slice(1).join(' '),
        email: billingInfo.email,
        phone: billingInfo.phoneNumber,
      };

      const tokenData = await tokenizeCard(billingContact);
      onTokenReceived(tokenData);
      clearError();
    } catch (tokenizeError: any) {
      console.error('Tokenization error:', tokenizeError);
      toast({
        title: "Payment Error",
        description: tokenizeError.message || "Failed to process payment. Please check your card details and try again.",
        variant: "destructive"
      });
    }
  };

  if (error) {
    console.log('Rendering error component due to:', error);
    return <SquareCardFormError error={error} />;
  }

  console.log('Rendering SquareCardForm components...');

  return (
    <Card>
      <SquareCardFormHeader />
      <CardContent className="space-y-4">
        <SquareCardFormFields
          billingInfo={billingInfo}
          onInputChange={onInputChange}
          isProcessing={isProcessing}
        />

        <SquareCardFormPayment
          cardElementRef={cardElementRef}
          isSquareReady={isSquareReady}
          error={error}
          isProcessing={isProcessing}
        />

        <SquareCardFormActions
          onTokenizeCard={handleTokenize}
          cardInitialized={isSquareReady && !error}
          isLoading={isLoading}
          isProcessing={isProcessing}
          error={error}
        />
      </CardContent>
    </Card>
  );
};

export default SquareCardForm;
