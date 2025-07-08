
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  onTokenReceived: (tokenData: any) => void;
  isProcessing?: boolean;
}

const SquareCardForm = ({ 
  billingInfo, 
  onInputChange, 
  onTokenReceived,
  isProcessing = false
}: SquareCardFormProps) => {
  const { toast } = useToast();
  const cardElementRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // Mock Square functionality since we removed Square integration
  const isSquareReady = true;
  const isLoading = false;
  const error = null;

  const handleTokenize = async () => {
    if (isProcessing || !cardInstanceRef.current) {
      console.log('Cannot tokenize - processing:', isProcessing, 'cardInstance:', !!cardInstanceRef.current);
      return;
    }

    try {
      // Mock tokenization for now
      const mockTokenData = {
        token: 'mock_token_' + Date.now(),
        details: {
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2025
          }
        }
      };
      
      onTokenReceived(mockTokenData);
      
      toast({
        title: "Payment Validated",
        description: "Your payment information has been validated successfully.",
      });
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
    return <SquareCardFormError error={error} />;
  }

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
          cardInitialized={isSquareReady && !error && isInitializedRef.current}
          isLoading={isLoading}
          isProcessing={isProcessing}
          error={error}
        />
      </CardContent>
    </Card>
  );
};

export default SquareCardForm;
