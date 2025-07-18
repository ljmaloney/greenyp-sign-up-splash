
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
  onBillingInfoChange?: (contact: BillingContactData, address: BillingAddressData, emailValidationToken: string) => void;
  emailValidationToken?: string;
  onEmailValidationTokenChange?: (token: string) => void;
  isValidated?: boolean;
}

export const usePaymentInformation = ({ 
  customer, 
  onBillingInfoChange,
  emailValidationToken: externalEmailValidationToken,
  onEmailValidationTokenChange,
  isValidated = false
}: UsePaymentInformationProps = {}) => {
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

  const [emailValidationToken, setEmailValidationToken] = useState<string>(externalEmailValidationToken || '');

  // Sync external email validation token
  useEffect(() => {
    if (externalEmailValidationToken !== undefined) {
      setEmailValidationToken(externalEmailValidationToken);
    }
  }, [externalEmailValidationToken]);

  // Notify parent component of billing info changes
  useEffect(() => {
    onBillingInfoChange?.(billingContact, billingAddress, emailValidationToken);
  }, [billingContact, billingAddress, emailValidationToken, onBillingInfoChange]);

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
    
    // Conditionally handle email validation token based on validation state
    if (isValidated) {
      // If email is validated, preserve the token and validation state
      toast({
        title: "Information Copied",
        description: "Payment information has been copied from customer information. Email validation has been preserved.",
      });
    } else {
      // If email is not validated, clear the token (original behavior)
      const newToken = '';
      setEmailValidationToken(newToken);
      onEmailValidationTokenChange?.(newToken);
      
      toast({
        title: "Information Copied",
        description: "Payment information has been copied from customer information. Email validation token has been cleared.",
      });
    }
  };

  const handleContactChange = (field: string, value: string) => {
    setBillingContact(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailValidationTokenChange = (value: string) => {
    setEmailValidationToken(value);
    onEmailValidationTokenChange?.(value);
  };

  return {
    billingContact,
    billingAddress,
    emailValidationToken,
    handleCopyFromCustomer,
    handleContactChange,
    handleAddressChange,
    handleEmailValidationTokenChange
  };
};
