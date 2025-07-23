
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePaymentInformation } from '@/hooks/usePaymentInformation';
import BillingContactForm from './BillingContactForm';
import BillingAddressForm from './BillingAddressForm';
import PaymentInformationHeader from './PaymentInformationHeader';

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
  classified?: ClassifiedData;
  customer?: CustomerData;
  onBillingInfoChange?: (contact: any, address: any, emailValidationToken: string) => void;
  emailValidationToken?: string;
  onEmailValidationTokenChange?: (token: string) => void;
  isValidated?: boolean;
}

const PaymentInformationCard = ({ 
  classified, 
  customer, 
  onBillingInfoChange,
  emailValidationToken,
  onEmailValidationTokenChange,
  isValidated = false
}: PaymentInformationCardProps) => {
  const {
    billingContact,
    billingAddress,
    handleCopyFromCustomer,
    handleContactChange,
    handleAddressChange
  } = usePaymentInformation({ 
    customer, 
    onBillingInfoChange,
    emailValidationToken,
    onEmailValidationTokenChange,
    isValidated
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <PaymentInformationHeader 
            onCopyFromCustomer={handleCopyFromCustomer}
            isValidated={isValidated}
          />
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
      </CardContent>
    </Card>
  );
};

export default PaymentInformationCard;
