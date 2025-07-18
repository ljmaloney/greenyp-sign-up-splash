import React from 'react';
import NewOrderSummaryCard from './NewOrderSummaryCard';
import NewAdPreviewCard from './NewAdPreviewCard';
import PaymentInformationCard from '../payment/PaymentInformationCard';
import EmailValidationCard from '../payment/EmailValidationCard';
import UnifiedSquarePaymentCard from './UnifiedSquarePaymentCard';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useSquarePayment } from '@/hooks/useSquarePayment';

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
  isSubscription?: boolean;
  producerId?: string | null;
}

const PaymentLayout = ({ classified, customer, isSubscription = false, producerId }: PaymentLayoutProps) => {
  const { classifiedId } = useParams<{ classifiedId: string }>();

  // Initialize Square payment once at the layout level
  const {
    cardContainerRef,
    payments,
    card,
    error: squareError,
    setError: setSquareError
  } = useSquarePayment();

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

  const handleBillingInfoUpdate = React.useCallback((contact: any, address: any, emailValidationToken: string) => {
    setBillingInfo({ contact, address, emailValidationToken });
  }, []);

  const handleEmailValidationTokenChange = (value: string) => {
    setBillingInfo(prev => ({ ...prev, emailValidationToken: value }));
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
        <EmailValidationCard
          emailValidationToken={billingInfo.emailValidationToken}
          onChange={handleEmailValidationTokenChange}
          emailAddress={customer?.emailAddress}
          helperText="A verified email address is required before placing your classified ad"
        />
        <PaymentInformationCard 
          classified={classified}
          customer={customer}
          onBillingInfoChange={handleBillingInfoUpdate}
        />
        <UnifiedSquarePaymentCard
          billingContact={billingInfo.contact}
          billingAddress={billingInfo.address}
          emailValidationToken={billingInfo.emailValidationToken}
          cardContainerRef={cardContainerRef}
          payments={payments}
          card={card}
          squareError={squareError}
          setSquareError={setSquareError}
          paymentType={isSubscription ? 'subscription' : 'classified'}
          producerId={producerId || undefined}
        />
      </div>
    </div>
  );
};

export default PaymentLayout;
