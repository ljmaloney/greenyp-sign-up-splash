
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUnifiedSquarePayment } from '@/hooks/useUnifiedSquarePayment';
import SquareErrorBoundary from '@/components/payment/SquareErrorBoundary';

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
  console.log('💳 UnifiedSquarePaymentCard - Props received:', {
    paymentType,
    hasCard: !!card,
    hasPayments: !!payments,
    producerId,
    squareError
  });

  const {
    isProcessing,
    error: paymentError,
    processPayment
  } = useUnifiedSquarePayment({
    billingContact,
    billingAddress,
    emailValidationToken,
    paymentType,
    producerId
  });

  const handlePayment = useCallback(async () => {
    console.log('🎯 UnifiedSquarePaymentCard - Processing payment');
    if (!card || !payments) {
      setSquareError('Payment form not ready');
      return;
    }

    await processPayment(card, payments);
  }, [card, payments, processPayment, setSquareError]);

  const displayError = squareError || paymentError;
  const isCardReady = !!(card && payments && !squareError);

  return (
    <SquareErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            id="card-container" 
            ref={cardContainerRef}
            className="p-4 border border-gray-300 rounded-lg min-h-[120px] bg-white"
          />
          
          {displayError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {displayError}
            </div>
          )}
          
          <Button 
            onClick={handlePayment}
            disabled={isProcessing || !isCardReady}
            className="w-full"
          >
            {isProcessing ? 'Processing Payment...' : 'Process Payment'}
          </Button>

          {!isCardReady && !squareError && (
            <div className="text-sm text-gray-500 text-center">
              Loading payment form...
            </div>
          )}
        </CardContent>
      </Card>
    </SquareErrorBoundary>
  );
};

export default UnifiedSquarePaymentCard;
