
import { useState, useCallback } from 'react';

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
  onBillingInfoChange?: (contact: any, address: any, emailValidationToken: string) => void;
  emailValidationToken?: string;
  onEmailValidationTokenChange?: (token: string) => void;
  isValidated?: boolean;
}

export const usePaymentInformation = ({
  customer,
  onBillingInfoChange,
  emailValidationToken,
  onEmailValidationTokenChange,
  isValidated
}: UsePaymentInformationProps) => {
  const [billingContact, setBillingContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [billingAddress, setBillingAddress] = useState({
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleCopyFromCustomer = useCallback(() => {
    if (!customer || !isValidated) return;

    const newContact = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.emailAddress,
      phone: customer.phoneNumber
    };

    const newAddress = {
      address: customer.address,
      address2: '',
      city: customer.city,
      state: customer.state,
      zipCode: customer.postalCode
    };

    setBillingContact(newContact);
    setBillingAddress(newAddress);

    if (onBillingInfoChange) {
      onBillingInfoChange(newContact, newAddress, emailValidationToken || '');
    }
  }, [customer, isValidated, onBillingInfoChange, emailValidationToken]);

  const handleContactChange = useCallback((field: string, value: string) => {
    setBillingContact(prev => {
      const updated = { ...prev, [field]: value };
      if (onBillingInfoChange) {
        onBillingInfoChange(updated, billingAddress, emailValidationToken || '');
      }
      return updated;
    });
  }, [billingAddress, onBillingInfoChange, emailValidationToken]);

  const handleAddressChange = useCallback((field: string, value: string) => {
    setBillingAddress(prev => {
      const updated = { ...prev, [field]: value };
      if (onBillingInfoChange) {
        onBillingInfoChange(billingContact, updated, emailValidationToken || '');
      }
      return updated;
    });
  }, [billingContact, onBillingInfoChange, emailValidationToken]);

  return {
    billingContact,
    billingAddress,
    handleCopyFromCustomer,
    handleContactChange,
    handleAddressChange
  };
};
