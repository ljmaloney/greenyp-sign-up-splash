
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSquarePayments, SquareCardData } from '@/hooks/useSquarePayments';
import { useToast } from '@/hooks/use-toast';
import SquareCardFormHeader from './SquareCardFormHeader';
import SquareCardFormError from './SquareCardFormError';
import SquareCardFormFields from './SquareCardFormFields';
import SquareCardFormPayment from './SquareCardFormPayment';
import SquareCardFormActions from './SquareCardFormActions';

interface SquareCardFormProps {
  billingInfo: {
    cardholderName: string;
    email: string;
    phoneNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
  onTokenReceived: (tokenData: SquareCardData) => void;
  onCopyFromClassified?: () => void;
  classifiedData?: any;
  isProcessing?: boolean;
}

const SquareCardForm = ({ 
  billingInfo, 
  onInputChange, 
  onTokenReceived,
  onCopyFromClassified, 
  classifiedData,
  isProcessing = false
}: SquareCardFormProps) => {
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [cardInitialized, setCardInitialized] = useState(false);
  const { isSquareReady, isLoading, error, initializeCard, tokenizeCard, clearError } = useSquarePayments();
  const { toast } = useToast();

  useEffect(() => {
    const setupCard = async () => {
      if (isSquareReady && !cardInitialized && !error && cardElementRef.current) {
        try {
          await initializeCard('square-card');
          setCardInitialized(true);
          console.log('Square card initialized successfully');
        } catch (err: any) {
          console.error('Failed to initialize Square card:', err);
        }
      }
    };

    setupCard();
  }, [isSquareReady, cardInitialized, error, initializeCard]);

  const handleTokenizeCard = async () => {
    if (error) {
      toast({
        title: "Configuration Error",
        description: error,
        variant: "destructive"
      });
      return;
    }

    if (!cardInitialized) {
      toast({
        title: "Payment Error",
        description: "Payment form is not ready. Please wait and try again.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!billingInfo.cardholderName || !billingInfo.email || !billingInfo.phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required billing information fields",
        variant: "destructive"
      });
      return;
    }

    clearError();

    try {
      const billingContact = {
        givenName: billingInfo.cardholderName.split(' ')[0] || '',
        familyName: billingInfo.cardholderName.split(' ').slice(1).join(' ') || '',
        email: billingInfo.email,
        phone: billingInfo.phoneNumber,
      };

      const tokenData = await tokenizeCard(billingContact);
      
      toast({
        title: "Payment Ready",
        description: "Your payment information has been securely processed",
      });

      onTokenReceived(tokenData);
    } catch (err: any) {
      console.error('Tokenization failed:', err);
      toast({
        title: "Payment Error",
        description: err.message || "Failed to process payment information",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <SquareCardFormHeader 
        onCopyFromClassified={onCopyFromClassified}
        classifiedData={classifiedData}
      />
      <CardContent className="space-y-4">
        {error && <SquareCardFormError error={error} />}

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
          onTokenizeCard={handleTokenizeCard}
          cardInitialized={cardInitialized}
          isLoading={isLoading}
          isProcessing={isProcessing}
          error={error}
        />
      </CardContent>
    </Card>
  );
};

export default SquareCardForm;
