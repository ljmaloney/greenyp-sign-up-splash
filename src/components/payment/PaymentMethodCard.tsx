
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SquarePaymentForm from '../classifieds/SquarePaymentForm';

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

interface PaymentMethodCardProps {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  error: string | null;
  isProcessing: boolean;
  onPayment: () => void;
  isCardReady: boolean;
}

const PaymentMethodCard = ({ 
  cardContainerRef, 
  error, 
  isProcessing, 
  onPayment, 
  isCardReady 
}: PaymentMethodCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <SquarePaymentForm
          cardContainerRef={cardContainerRef}
          error={error}
          isProcessing={isProcessing}
          onPayment={onPayment}
          isCardReady={isCardReady}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
