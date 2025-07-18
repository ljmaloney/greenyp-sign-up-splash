
import React, { useState, useCallback } from 'react';
import { useSquarePayment } from '@/hooks/useSquarePayment';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import UnifiedSquarePaymentCard from '@/components/classifieds/UnifiedSquarePaymentCard';
import SubscriptionSummaryCard from './SubscriptionSummaryCard';
import { SubscriptionWithFormatting } from '@/types/subscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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

interface SubscriptionPaymentLayoutProps {
  selectedSubscription?: SubscriptionWithFormatting;
  customerData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phoneNumber: string;
    emailAddress: string;
  };
  producerId?: string;
  apiSubscriptionData?: any;
}

const SubscriptionPaymentLayout = ({ 
  selectedSubscription, 
  customerData, 
  producerId,
  apiSubscriptionData 
}: SubscriptionPaymentLayoutProps) => {
  console.log('SubscriptionPaymentLayout - Props received:', {
    selectedSubscription,
    customerData,
    producerId,
    apiSubscriptionData
  });

  const [billingContact, setBillingContact] = useState<BillingContactData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddressData>({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [emailValidationToken, setEmailValidationToken] = useState<string>('');

  const { cardContainerRef, payments, card, error: squareError, setError: setSquareError } = useSquarePayment();

  const {
    isValidating,
    isValidated,
    validationError,
    validateEmail,
    resetValidation
  } = useEmailValidation({
    emailAddress: customerData?.emailAddress || '',
    context: 'subscribers',
    producerId: producerId
  });

  // Memoize callback functions to prevent infinite re-renders
  const handleBillingInfoChange = useCallback((
    contact: BillingContactData, 
    address: BillingAddressData, 
    token: string
  ) => {
    setBillingContact(contact);
    setBillingAddress(address);
    setEmailValidationToken(token);
  }, []);

  const handleEmailValidationTokenChange = useCallback((value: string) => {
    setEmailValidationToken(value);
    // Reset validation state when token changes
    if (isValidated) {
      resetValidation();
    }
  }, [isValidated, resetValidation]);

  const handleValidateEmail = useCallback(() => {
    validateEmail(emailValidationToken);
  }, [validateEmail, emailValidationToken]);

  // Check if we have any subscription data (either from reference data or API)
  const hasSubscriptionData = !!(selectedSubscription || apiSubscriptionData);
  
  // Show fallback message if no subscription data is found
  if (!hasSubscriptionData) {
    console.error('SubscriptionPaymentLayout - No subscription data provided');
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Subscription details are missing. Please return to the signup page and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Validate customer data
  if (!customerData?.emailAddress || !customerData?.firstName || !customerData?.lastName) {
    console.error('SubscriptionPaymentLayout - Invalid customer data:', customerData);
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Customer information is incomplete. Please return to the signup page and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  try {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Subscription Details */}
        <div className="space-y-6">
          <SubscriptionSummaryCard 
            selectedSubscription={selectedSubscription}
            apiSubscriptionData={apiSubscriptionData}
          />
        </div>

        {/* Right Column - Payment Information */}
        <div className="space-y-6">
          <EmailValidationCard
            emailValidationToken={emailValidationToken}
            onChange={handleEmailValidationTokenChange}
            emailAddress={customerData?.emailAddress}
            helperText="A verified email address is required before creating your subscription"
            isValidating={isValidating}
            isValidated={isValidated}
            validationError={validationError}
            onValidate={handleValidateEmail}
          />
          
          <div className={!isValidated ? 'opacity-50 pointer-events-none' : ''}>
            <PaymentInformationCard
              customer={customerData}
              onBillingInfoChange={handleBillingInfoChange}
              emailValidationToken={emailValidationToken}
              onEmailValidationTokenChange={handleEmailValidationTokenChange}
            />
          </div>
          
          <div className={!isValidated ? 'opacity-50 pointer-events-none' : ''}>
            <UnifiedSquarePaymentCard
              billingContact={billingContact}
              billingAddress={billingAddress}
              emailValidationToken={emailValidationToken}
              cardContainerRef={cardContainerRef}
              payments={payments}
              card={card}
              squareError={squareError}
              setSquareError={setSquareError}
              paymentType="subscription"
              producerId={producerId}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SubscriptionPaymentLayout - Render error:', error);
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            An error occurred while loading the payment page. Please try refreshing or contact support.
            <br />
            <small>Error: {error instanceof Error ? error.message : 'Unknown error'}</small>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
};

export default SubscriptionPaymentLayout;
