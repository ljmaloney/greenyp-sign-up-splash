
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { useSquarePayment } from '@/hooks/useSquarePayment';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processSquarePayment } from '@/utils/squarePaymentProcessor';
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
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const apiClient = useApiClient();
  const { toast } = useToast();

  const {
    cardContainerRef,
    payments,
    card,
    error,
    setError
  } = useSquarePayment();

  const handlePayment = async () => {
    if (!card || !payments || !producerId) {
      setError('Payment form not initialized or missing producer ID');
      return;
    }

    // Validate all required fields before proceeding
    const validationError = validatePaymentFields(billingContact, billingAddress);
    if (validationError) {
      setError(validationError);
      toast({
        title: "Required Information Missing",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Validate email validation token
    if (!emailValidationToken || emailValidationToken.trim() === '') {
      setError('Email validation token is required');
      toast({
        title: "Required Information Missing",
        description: "Email validation token is required",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // First tokenize the card using Square
      const { paymentToken, verificationToken } = await processSquarePaymentTokens(
        card,
        payments,
        billingContact,
        billingAddress
      );

      // Submit the initial payment to the signup endpoint
      const paymentData = {
        producerId: producerId,
        paymentMethod: "SQUARE",
        payorName: `${billingContact.firstName} ${billingContact.lastName}`,
        payorAddress1: billingAddress.address,
        payorAddress2: "",
        payorCity: billingAddress.city,
        payorState: billingAddress.state,
        payorPostalCode: billingAddress.zipCode,
        actionType: "APPLY_ONCE",
        cycleType: "MONTHLY",
        paymentToken: paymentToken,
        verificationToken: verificationToken,
        emailValidationToken: emailValidationToken
      };

      console.log('Submitting signup payment data:', paymentData);
      
      const paymentResponse = await apiClient.post('/account/applyInitialPayment', paymentData, { requireAuth: false });
      console.log('Payment submission response:', paymentResponse);
      
      // Check if payment was completed successfully
      if (paymentResponse.response?.paymentStatus === 'COMPLETED' || paymentResponse.status === 200) {
        console.log('Payment completed successfully, redirecting to confirmation');
        
        toast({
          title: "Payment Successful",
          description: "Your subscription has been activated successfully!",
        });
        
        // Redirect to confirmation page
        navigate('/subscriber/signup/confirmation?paymentSuccess=true');
      } else {
        console.log('Payment not completed, status:', paymentResponse.response?.paymentStatus);
        setError('Payment was not completed successfully');
        toast({
          title: "Payment Issue",
          description: "There was an issue completing your payment. Please try again.",
          variant: "destructive",
        });
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
    <PaymentMethodCard
      cardContainerRef={cardContainerRef}
      error={error}
      isProcessing={isProcessing}
      onPayment={handlePayment}
      isCardReady={!!card}
    />
  );
};

// Helper function to process Square payment tokens
const processSquarePaymentTokens = async (
  card: any,
  payments: any,
  billingContact: BillingContactData,
  billingAddress: BillingAddressData
) => {
  console.log('Starting tokenization process...');
  
  // Tokenize the card
  const result = await card.tokenize();
  console.log('Tokenization result:', result);

  if (result.status === 'OK') {
    console.log('Card tokenized successfully, token:', result.token);
    
    // Prepare verification details using billing information
    const verificationDetails = {
      amount: '1.00',
      billingContact: {
        givenName: billingContact.firstName || 'John',
        familyName: billingContact.lastName || 'Doe',
        email: billingContact.email || 'john.doe@example.com',
        phone: billingContact.phone || '+13214563987',
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

    if (verificationResult && verificationResult.token) {
      console.log('Payment verified successfully');
      return {
        paymentToken: result.token,
        verificationToken: verificationResult.token
      };
    } else {
      console.error('Verification failed:', verificationResult.errors);
      throw new Error('Payment verification failed');
    }
  } else {
    console.error('Tokenization failed:', result.errors);
    throw new Error('Failed to process payment card');
  }
};

export default SquareSignUpPaymentCard;
