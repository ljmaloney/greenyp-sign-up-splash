
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BillingContactForm from '@/components/payment/BillingContactForm';
import BillingAddressForm from '@/components/payment/BillingAddressForm';

interface BillingContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BillingAddressData {
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface DashboardPaymentInformationCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  onBillingInfoChange: (contact: BillingContactData, address: BillingAddressData) => void;
}

const PaymentInformationCard = ({
  billingContact,
  billingAddress,
  onBillingInfoChange
}: DashboardPaymentInformationCardProps) => {
  const handleContactChange = (field: string, value: string) => {
    const updatedContact = { ...billingContact, [field]: value };
    onBillingInfoChange(updatedContact, billingAddress);
  };

  const handleAddressChange = (field: string, value: string) => {
    const updatedAddress = { ...billingAddress, [field]: value };
    onBillingInfoChange(billingContact, updatedAddress);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
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
