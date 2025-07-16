
import React, { useState } from 'react';
import { useSquarePayment } from '@/hooks/useSquarePayment';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import UnifiedSquarePaymentCard from '@/components/classifieds/UnifiedSquarePaymentCard';
import SubscriptionSummaryCard from './SubscriptionSummaryCard';
import { SubscriptionWithFormatting } from '@/types/subscription';

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
}

const SubscriptionPaymentLayout = ({ selectedSubscription, customerData, producerId }: SubscriptionPaymentLayoutProps) => {
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

  const handleBillingInfoChange = (
    contact: BillingContactData, 
    address: BillingAddressData, 
    token: string
  ) => {
    setBillingContact(contact);
    setBillingAddress(address);
    setEmailValidationToken(token);
  };

  const handleEmailValidationTokenChange = (value: string) => {
    setEmailValidationToken(value);
    // Reset validation state when token changes
    if (isValidated) {
      resetValidation();
    }
  };

  const handleValidateEmail = () => {
    validateEmail(emailValidationToken);
  };

  // Show fallback message if no subscription is found
  if (!selectedSubscription) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Subscription Not Found</h2>
          <p className="text-gray-600">Unable to load subscription details. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Subscription Details */}
      <div className="space-y-6">
        <SubscriptionSummaryCard selectedSubscription={selectedSubscription} />
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
};

export default SubscriptionPaymentLayout;
