
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnifiedSquarePayment } from '@/hooks/useUnifiedSquarePayment';
import SquarePaymentForm from './SquarePaymentForm';
import SquarePaymentWrapper from '../payment/SquarePaymentWrapper';

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

interface UnifiedSquarePaymentCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  emailValidationToken: string;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  payments: any;
  card: any;
  squareError: string | null;
  setSquareError: (error: string | null) => void;
  paymentType: 'classified' | 'subscription';
  producerId?: string;
}

const UnifiedSquarePaymentCard = ({
  billingContact,
  billingAddress,
  emailValidationToken,
  cardContainerRef,
  payments,
  card,
  squareError,
  setSquareError,
  paymentType,
  producerId
}: UnifiedSquarePaymentCardProps) => {
  const {
    isProcessing,
    error,
    setError,
    processPayment
  } = useUnifiedSquarePayment({
    billingContact,
    billingAddress,
    emailValidationToken,
    paymentType,
    producerId
  });

  const handlePayment = async () => {
    // Clear any existing errors
    setError(null);
    setSquareError(null);
    
    await processPayment(card, payments);
  };

  const handleRetry = () => {
    // Clear all errors on retry
    setError(null);
    setSquareError(null);
  };

  const displayError = error || squareError;

  return (
    <SquarePaymentWrapper onRetry={handleRetry}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <SquarePaymentForm
            cardContainerRef={cardContainerRef}
            error={displayError}
            isProcessing={isProcessing}
            onPayment={handlePayment}
            isCardReady={!!card}
          />
        </CardContent>
      </Card>
    </SquarePaymentWrapper>
  );
};

export default UnifiedSquarePaymentCard;
