
import React from 'react';
import NewOrderSummaryCard from './NewOrderSummaryCard';
import NewAdPreviewCard from './NewAdPreviewCard';
import PaymentInformationCard from './PaymentInformationCard';
import EmailValidationCard from './EmailValidationCard';
import SquarePaymentMethodCard from './SquarePaymentMethodCard';
import SquareSignUpPaymentCard from '@/components/subscribers/SquareSignUpPaymentCard';
import { useParams } from 'react-router-dom';
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
  isSubscription?: boolean;
  producerId?: string | null;
}

const PaymentLayout = ({ classified, customer, isSubscription = false, producerId }: PaymentLayoutProps) => {
  const { classifiedId } = useParams<{ classifiedId: string }>();

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
        <PaymentInformationCard 
          classified={classified}
          customer={customer}
          onBillingInfoChange={handleBillingInfoUpdate}
        />
        <EmailValidationCard
          emailValidationToken={billingInfo.emailValidationToken}
          onChange={handleEmailValidationTokenChange}
        />
        {isSubscription && producerId ? (
          <SquareSignUpPaymentCard
            producerId={producerId}
            billingContact={billingInfo.contact}
            billingAddress={billingInfo.address}
            emailValidationToken={billingInfo.emailValidationToken}
          />
        ) : (
          <SquarePaymentMethodCard
            billingContact={billingInfo.contact}
            billingAddress={billingInfo.address}
            emailValidationToken={billingInfo.emailValidationToken}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentLayout;
