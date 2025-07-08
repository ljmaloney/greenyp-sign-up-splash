
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneNumber } from '@/utils/phoneFormatting';
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

interface NewPaymentInformationCardProps {
  classified: ClassifiedData;
  customer: CustomerData;
  onBillingInfoChange?: (contact: any, address: any) => void;
}

const NewPaymentInformationCard = ({ classified, customer, onBillingInfoChange }: NewPaymentInformationCardProps) => {
  const { toast } = useToast();
  
  const [billingContact, setBillingContact] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.emailAddress || '',
    phone: formatPhoneNumber(customer?.phoneNumber || '')
  });

  const [billingAddress, setBillingAddress] = useState({
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    zipCode: customer?.postalCode || ''
  });

  // Notify parent component of billing info changes
  useEffect(() => {
    onBillingInfoChange?.(billingContact, billingAddress);
  }, [billingContact, billingAddress, onBillingInfoChange]);

  const handleCopyFromCustomer = () => {
    const newContact = {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.emailAddress || '',
      phone: formatPhoneNumber(customer?.phoneNumber || '')
    };
    
    const newAddress = {
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      zipCode: customer?.postalCode || ''
    };
    
    setBillingContact(newContact);
    setBillingAddress(newAddress);
    
    toast({
      title: "Information Copied",
      description: "Payment information has been copied from customer information.",
    });
  };

  const handleContactChange = (field: string, value: string) => {
    setBillingContact(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

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
      </CardContent>
    </Card>
  );
};

export default NewPaymentInformationCard;
