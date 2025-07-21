
import { useState, useEffect, useCallback } from 'react';

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
  onBillingInfoChange?: (contact: BillingContactData, address: BillingAddressData, emailValidationToken: string) => void;
  emailValidationToken?: string;
  onEmailValidationTokenChange?: (token: string) => void;
  isValidated?: boolean;
}

export const usePaymentInformation = ({
  customer,
  onBillingInfoChange,
  emailValidationToken = '',
  onEmailValidationTokenChange,
  isValidated = false
}: UsePaymentInformationProps) => {
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

  // Initialize from customer data
  useEffect(() => {
    if (customer) {
      console.log('📋 usePaymentInformation: Initializing from customer data:', customer);
      
      setBillingContact({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.emailAddress || '',
        phone: customer.phoneNumber || ''
      });

      setBillingAddress({
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zipCode: customer.postalCode || ''
      });
    }
  }, [customer]);

  // Notify parent of changes
  useEffect(() => {
    if (onBillingInfoChange) {
      console.log('📋 usePaymentInformation: Notifying parent of billing info change:', {
        contact: billingContact,
        address: billingAddress,
        emailValidationToken
      });
      onBillingInfoChange(billingContact, billingAddress, emailValidationToken);
    }
  }, [billingContact, billingAddress, emailValidationToken, onBillingInfoChange]);

  const handleCopyFromCustomer = useCallback(() => {
    if (customer) {
      console.log('📋 usePaymentInformation: Copying from customer data');
      
      setBillingContact({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.emailAddress || '',
        phone: customer.phoneNumber || ''
      });

      setBillingAddress({
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zipCode: customer.postalCode || ''
      });
    }
  }, [customer]);

  const handleContactChange = useCallback((field: string, value: string) => {
    console.log('📋 usePaymentInformation: Contact field changed:', { field, value });
    setBillingContact(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleAddressChange = useCallback((field: string, value: string) => {
    console.log('📋 usePaymentInformation: Address field changed:', { field, value });
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  return {
    billingContact,
    billingAddress,
    handleCopyFromCustomer,
    handleContactChange,
    handleAddressChange
  };
};
