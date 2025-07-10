
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePaymentInformation } from '@/hooks/usePaymentInformation';
import BillingContactForm from './BillingContactForm';
import BillingAddressForm from './BillingAddressForm';
import PaymentInformationHeader from './PaymentInformationHeader';
import EmailValidationTokenForm from './EmailValidationTokenForm';

interface ClassifiedData {
  address: string;
  city: string;
  state: string;
  postalCode: string;
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

interface PaymentInformationCardProps {
  classified: ClassifiedData;
  customer: CustomerData;
  onBillingInfoChange?: (contact: any, address: any, emailValidationToken: string) => void;
}

const PaymentInformationCard = ({ classified, customer, onBillingInfoChange }: PaymentInformationCardProps) => {
  const {
    billingContact,
    billingAddress,
    emailValidationToken,
    handleCopyFromCustomer,
    handleContactChange,
    handleAddressChange,
    handleEmailValidationTokenChange
  } = usePaymentInformation({ customer, onBillingInfoChange });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <PaymentInformationHeader onCopyFromCustomer={handleCopyFromCustomer} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <BillingContactForm
          billingContact={billingContact}
          onChange={handleContactChange}
        />
        <BillingAddressForm
          billingAddress={billingAddress}
          onChange={handleAddressChange}
        />
        <EmailValidationTokenForm
          emailValidationToken={emailValidationToken}
          onChange={handleEmailValidationTokenChange}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentInformationCard;
