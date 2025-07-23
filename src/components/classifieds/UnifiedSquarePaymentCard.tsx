
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle } from 'lucide-react';

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
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handlePayment = async () => {
    if (!emailValidationToken.trim()) {
      setSquareError('Please validate your email address first');
      return;
    }

    setIsProcessing(true);
    setSquareError(null);

    try {
      console.log('💳 Processing payment...', {
        paymentType,
        producerId,
        billingContact,
        billingAddress
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Payment processed successfully');
    } catch (error) {
      console.error('❌ Payment failed:', error);
      setSquareError(error instanceof Error ? error.message : 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={cardContainerRef}
          className="border border-gray-300 rounded-lg p-4 min-h-[120px] bg-gray-50"
        >
          {payments && card ? (
            <div className="text-center text-gray-600">
              Card input ready
            </div>
          ) : (
            <div className="text-center text-gray-400">
              Loading payment form...
            </div>
          )}
        </div>

        {squareError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-red-700 text-sm">{squareError}</div>
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={isProcessing || !payments || !card || !emailValidationToken.trim()}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : `Pay for ${paymentType}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UnifiedSquarePaymentCard;
