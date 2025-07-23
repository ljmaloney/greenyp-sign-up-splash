
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { usePaymentInformation } from '@/hooks/usePaymentInformation';
import BillingContactForm from './BillingContactForm';
import BillingAddressForm from './BillingAddressForm';

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
  emailValidationToken?: string;
  isEmailValidated?: boolean;
}

const PaymentInformationCard = ({ 
  classified, 
  customer, 
  onBillingInfoChange,
  emailValidationToken = '',
  isEmailValidated = false 
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
    isValidated: isEmailValidated
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Information</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFromCustomer}
            disabled={!isEmailValidated}
            className="text-xs"
            title={!isEmailValidated ? "Email must be validated before copying customer information" : "Copy customer information to payment form"}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy from Ad
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BillingContactForm
          billingContact={billingContact}
          onChange={handleContactChange}
          disabled={!isEmailValidated}
        />
        
        <BillingAddressForm
          billingAddress={billingAddress}
          onChange={handleAddressChange}
          disabled={!isEmailValidated}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentInformationCard;
