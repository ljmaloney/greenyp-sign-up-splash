
import React from 'react';
import { useSquarePayment } from '@/hooks/useSquarePayment';
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
}

const SquareSignUpPaymentCard = ({ 
  producerId, 
  billingContact, 
  billingAddress, 
  emailValidationToken 
}: SquareSignUpPaymentCardProps) => {
  const {
    cardContainerRef,
    payments,
    card,
    error: squareError,
    setError: setSquareError
  } = useSquarePayment();

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

  // Combine errors from both hooks
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
