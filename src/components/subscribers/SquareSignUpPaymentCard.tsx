
import React from 'react';
import { useSignUpPayment } from '@/hooks/useSignUpPayment';
import PaymentMethodCard from '@/components/classifieds/PaymentMethodCard';

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

interface SquareSignUpPaymentCardProps {
  producerId: string;
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  emailValidationToken: string;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  payments: any;
  card: any;
  squareError: string | null;
  setSquareError: (error: string | null) => void;
}

const SquareSignUpPaymentCard = ({ 
  producerId, 
  billingContact, 
  billingAddress, 
  emailValidationToken,
  cardContainerRef,
  payments,
  card,
  squareError,
  setSquareError
}: SquareSignUpPaymentCardProps) => {
  const {
    isProcessing,
    error: paymentError,
    setError: setPaymentError,
    processPayment
  } = useSignUpPayment({
    producerId,
    billingContact,
    billingAddress,
    emailValidationToken
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

export default SquareSignUpPaymentCard;
