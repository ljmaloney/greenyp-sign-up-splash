
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';

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
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();
  const { toast } = useToast();

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        // Use environment variables for Square configuration
        const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
        
        if (!appId || !locationId) {
          throw new Error('Square application ID or location ID not configured');
        }

        // Dynamically import Square Web SDK
        const { payments: paymentsFunction } = await import('@square/web-sdk');
        
        // Initialize Square Payments
        const paymentsInstance = paymentsFunction({
          appId: appId,
          locationId: locationId,
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
    if (!card || !payments || !classifiedId) {
      setError('Payment form not initialized or missing classified ID');
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
          console.log('Payment verified successfully, submitting to backend...');
          
          // Submit payment to backend
          const paymentData = {
            classifiedId: classifiedId,
            paymentToken: result.token,
            verificationToken: verificationResult.token,
            firstName: billingContact.firstName,
            lastName: billingContact.lastName,
            address: billingAddress.address,
            city: billingAddress.city || 'Oakland',
            state: billingAddress.state || 'CA',
            postalCode: billingAddress.zipCode,
            phoneNumber: billingContact.phone,
            emailAddress: billingContact.email
          };

          console.log('Submitting payment data:', paymentData);
          
          const paymentResponse = await apiClient.post('/classified/payment', paymentData, { requireAuth: false });
          console.log('Payment submission response:', paymentResponse);
          
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully.",
          });
          
          onPaymentProcessed?.(paymentResponse);
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
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
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
