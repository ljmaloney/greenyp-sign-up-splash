
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard } from 'lucide-react';
import { useSquarePayments } from '@/hooks/useSquarePayments';
import { useToast } from '@/hooks/use-toast';
import { usePaymentInfo } from '@/hooks/usePaymentInfo';
import PaymentFormFields from './PaymentFormFields';
import SquareCardElement from './SquareCardElement';
import PaymentErrorState from './PaymentErrorState';

interface CustomerData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
}

interface NewSecurePaymentCardProps {
  customer: CustomerData;
}

const NewSecurePaymentCard = ({ customer }: NewSecurePaymentCardProps) => {
  const { toast } = useToast();
  const { isSquareReady, isLoading, error, tokenizeCard } = useSquarePayments();
  const { paymentInfo, handleInputChange } = usePaymentInfo(customer);
  const cardInstanceRef = useRef<any>(null);

  const handleCardInitialized = (cardInstance: any) => {
    cardInstanceRef.current = cardInstance;
  };

  const handleTokenize = async () => {
    if (!cardInstanceRef.current) {
      toast({
        title: "Payment Error",
        description: "Payment form is not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      const billingContact = {
        givenName: paymentInfo.firstName,
        familyName: paymentInfo.lastName,
        email: paymentInfo.email,
        phone: paymentInfo.phone.replace(/\D/g, ''), // Remove formatting for API
      };

      console.log('Tokenizing with simplified billing contact:', billingContact);
      const tokenData = await tokenizeCard(billingContact);
      
      toast({
        title: "Payment Validated",
        description: "Your payment information has been validated successfully.",
      });

      console.log('Token received:', tokenData);
      
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
    return <PaymentErrorState error={error} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentFormFields 
          paymentInfo={paymentInfo}
          onInputChange={handleInputChange}
        />

        <SquareCardElement
          isSquareReady={isSquareReady}
          error={error}
          onCardInitialized={handleCardInitialized}
        />

        {/* Payment Button */}
        <div className="pt-4">
          <Button 
            onClick={handleTokenize}
            disabled={!isSquareReady || isLoading || !!error}
            className="w-full bg-greenyp-600 hover:bg-greenyp-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isLoading ? 'Processing...' : 'Validate Payment Information'}
          </Button>
        </div>

        <div className="flex items-center justify-center text-xs text-gray-500">
          <Lock className="w-3 h-3 mr-1" />
          Secured by Square - PCI DSS Compliant
        </div>
      </CardContent>
    </Card>
  );
};

export default NewSecurePaymentCard;
