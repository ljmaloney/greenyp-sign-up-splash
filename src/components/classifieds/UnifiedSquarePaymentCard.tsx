import React from 'react';
import { useUnifiedSquarePayment } from '@/hooks/useUnifiedSquarePayment';
import PaymentMethodCard from '../payment/PaymentMethodCard';

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
    error: paymentError,
    setError: setPaymentError,
    processPayment
  } = useUnifiedSquarePayment({
    billingContact,
    billingAddress,
    emailValidationToken,
    paymentType,
    producerId
  });

  // Combine errors from Square and payment processing
  const error = squareError || paymentError;
  const setError = (errorMessage: string | null) => {
    setSquareError(errorMessage);
    setPaymentError(errorMessage);
  };

  const handlePayment = async () => {
    await processPayment(card, payments);
  };

  return (
    <PaymentMethodCard
      cardContainerRef={cardContainerRef}
      error={error}
      isProcessing={isProcessing}
      onPayment={handlePayment}
      isCardReady={!!card}
    />
  );
};

export default UnifiedSquarePaymentCard;
