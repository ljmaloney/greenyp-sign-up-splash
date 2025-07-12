
import React from 'react';
import NewOrderSummaryCard from './NewOrderSummaryCard';
import NewAdPreviewCard from './NewAdPreviewCard';
import PaymentInformationCard from './PaymentInformationCard';
import EmailValidationCard from './EmailValidationCard';
import PaymentMethodCard from './PaymentMethodCard';
import { useSquarePayment } from '@/hooks/useSquarePayment';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { processSquarePayment } from '@/utils/squarePaymentProcessor';
import { useState } from 'react';

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  price: number;
  perUnitType: string;
  createDate: string;
  adTypeId: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
}

interface PaymentLayoutProps {
  classified: ClassifiedData;
  customer: CustomerData;
}

const PaymentLayout = ({ classified, customer }: PaymentLayoutProps) => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const apiClient = useApiClient();
  const { toast } = useToast();

  const [billingInfo, setBillingInfo] = React.useState({
    contact: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.emailAddress || '',
      phone: customer?.phoneNumber || ''
    },
    address: {
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      zipCode: customer?.postalCode || ''
    },
    emailValidationToken: ''
  });

  const {
    cardContainerRef,
    payments,
    card,
    error,
    setError
  } = useSquarePayment();

  const handlePaymentProcessed = (result: any) => {
    console.log('Payment processed successfully:', result);
    // Handle successful payment here
  };

  const handleBillingInfoUpdate = React.useCallback((contact: any, address: any, emailValidationToken: string) => {
    setBillingInfo({ contact, address, emailValidationToken });
  }, []);

  const handleEmailValidationTokenChange = (value: string) => {
    setBillingInfo(prev => ({ ...prev, emailValidationToken: value }));
  };

  const handlePayment = async () => {
    if (!card || !payments || !classifiedId) {
      setError('Payment form not initialized or missing classified ID');
      return;
    }

    // Validate all required fields before proceeding
    const validationError = validatePaymentFields(billingInfo.contact, billingInfo.address);
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
    if (!billingInfo.emailValidationToken || billingInfo.emailValidationToken.trim() === '') {
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
      const paymentResponse = await processSquarePayment(
        card,
        payments,
        billingInfo.contact,
        billingInfo.address,
        classifiedId,
        apiClient,
        billingInfo.emailValidationToken
      );
      
      // Check if payment was completed successfully
      if (paymentResponse.response?.paymentStatus === 'COMPLETED') {
        console.log('Payment completed successfully, redirecting to classified detail page with success parameter');
        
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        
        // Redirect to classified detail page with success parameter
        const detailUrl = `/classifieds/${classifiedId}?paymentSuccess=true`;
        console.log('Redirecting to:', detailUrl);
        navigate(detailUrl);
      } else {
        console.log('Payment not completed, status:', paymentResponse.response?.paymentStatus);
        setError('Payment was not completed successfully');
        toast({
          title: "Payment Issue",
          description: "There was an issue completing your payment. Please try again.",
          variant: "destructive",
        });
      }
      
      handlePaymentProcessed(paymentResponse);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        <NewOrderSummaryCard classified={classified} />
        <NewAdPreviewCard classified={classified} />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <PaymentInformationCard 
          classified={classified}
          customer={customer}
          onBillingInfoChange={handleBillingInfoUpdate}
        />
        <EmailValidationCard
          emailValidationToken={billingInfo.emailValidationToken}
          onChange={handleEmailValidationTokenChange}
        />
        <PaymentMethodCard
          cardContainerRef={cardContainerRef}
          error={error}
          isProcessing={isProcessing}
          onPayment={handlePayment}
          isCardReady={!!card}
        />
      </div>
    </div>
  );
};

export default PaymentLayout;
