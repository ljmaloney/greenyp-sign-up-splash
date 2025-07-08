
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Payments } from '@square/web-payments-sdk';

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

interface SquarePaymentCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  onPaymentProcessed?: (result: any) => void;
}

const SquarePaymentCard = ({ billingContact, billingAddress, onPaymentProcessed }: SquarePaymentCardProps) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        // Initialize Square Payments
        const paymentsInstance = await Payments({
          appId: 'sandbox-sq0idb-your-app-id', // Replace with your actual app ID
          locationId: 'your-location-id', // Replace with your actual location ID
        });
        
        setPayments(paymentsInstance);
        
        // Create and attach card
        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
        
        console.log('Square payment card initialized successfully');
      } catch (err) {
        console.error('Failed to initialize Square payments:', err);
        setError('Failed to initialize payment form');
      }
    };

    initializeSquare();
  }, []);

  const handlePayment = async () => {
    if (!card || !payments) {
      setError('Payment form not initialized');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Starting tokenization process...');
      
      // Tokenize the card
      const result = await card.tokenize();
      console.log('Tokenization result:', result);

      if (result.status === 'OK') {
        console.log('Card tokenized successfully, token:', result.token);
        
        // Prepare verification details using billing information
        const verificationDetails = {
          amount: '1.00', // test amount or expected charge
          billingContact: {
            givenName: billingContact.firstName || 'John',
            familyName: billingContact.lastName || 'Doe',
            email: billingContact.email || 'john.doe@example.com',
            phone: billingContact.phone || '3214563987',
            addressLines: [billingAddress.address || '123 Main Street'],
            city: billingAddress.city || 'Oakland',
            state: billingAddress.state || 'CA',
            countryCode: 'US',
          },
          currencyCode: 'USD',
          intent: 'CHARGE',
          customerInitiated: true,
          sellerKeyedIn: false,
        };

        console.log('Starting buyer verification with details:', verificationDetails);
        
        // Verify the buyer
        const verificationResult = await payments.verifyBuyer(result.token, verificationDetails);
        console.log('Verification result:', verificationResult);

        if (verificationResult.status === 'OK') {
          console.log('Payment processed successfully!');
          onPaymentProcessed?.(verificationResult);
        } else {
          console.error('Verification failed:', verificationResult.errors);
          setError('Payment verification failed');
        }
      } else {
        console.error('Tokenization failed:', result.errors);
        setError('Failed to process payment card');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          id="card-container" 
          ref={cardContainerRef}
          className="p-4 border border-gray-300 rounded-lg min-h-[120px]"
        />
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <Button 
          onClick={handlePayment}
          disabled={isProcessing || !card}
          className="w-full"
        >
          {isProcessing ? 'Processing Payment...' : 'Process Payment'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SquarePaymentCard;
