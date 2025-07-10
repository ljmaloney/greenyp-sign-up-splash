
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

interface UsePaymentInformationProps {
  customer?: CustomerData;
  onBillingInfoChange?: (contact: BillingContactData, address: BillingAddressData) => void;
}

export const usePaymentInformation = ({ customer, onBillingInfoChange }: UsePaymentInformationProps = {}) => {
  const { toast } = useToast();
  
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

  // Notify parent component of billing info changes
  useEffect(() => {
    onBillingInfoChange?.(billingContact, billingAddress);
  }, [billingContact, billingAddress, onBillingInfoChange]);

  const handleCopyFromCustomer = () => {
    if (!customer) return;
    
    const newContact: BillingContactData = {
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.emailAddress || '',
      phone: customer.phoneNumber || ''
    };
    
    const newAddress: BillingAddressData = {
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zipCode: customer.postalCode || ''
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

  return {
    billingContact,
    billingAddress,
    handleCopyFromCustomer,
    handleContactChange,
    handleAddressChange
  };
};
