
import React, { useState } from 'react';
import { useSquarePayment } from '@/hooks/useSquarePayment';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import UnifiedSquarePaymentCard from '@/components/classifieds/UnifiedSquarePaymentCard';
import SubscriptionSummaryCard from './SubscriptionSummaryCard';

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
  planName: string;
  planPrice: number;
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

const SubscriptionPaymentLayout = ({ planName, planPrice, customerData, producerId }: SubscriptionPaymentLayoutProps) => {
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
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Subscription Details */}
      <div className="space-y-6">
        <SubscriptionSummaryCard 
          planName={planName}
          planPrice={planPrice}
        />
      </div>

      {/* Right Column - Payment Information */}
      <div className="space-y-6">
        <EmailValidationCard
          emailValidationToken={emailValidationToken}
          onChange={handleEmailValidationTokenChange}
          emailAddress={customerData?.emailAddress}
          helperText="A verified email address is required before creating your subscription"
        />
        <PaymentInformationCard
          customer={customerData}
          onBillingInfoChange={handleBillingInfoChange}
          emailValidationToken={emailValidationToken}
          onEmailValidationTokenChange={handleEmailValidationTokenChange}
        />
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
  );
};

export default SubscriptionPaymentLayout;
