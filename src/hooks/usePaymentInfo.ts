
import { useState } from 'react';
import { formatPhoneNumber, formatPhoneAsUserTypes } from '@/utils/phoneFormatting';

interface CustomerData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
}

interface PaymentInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const usePaymentInfo = (customer: CustomerData) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    email: customer.emailAddress || '',
    phone: formatPhoneNumber(customer.phoneNumber || '')
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      const formatted = formatPhoneAsUserTypes(value);
      setPaymentInfo(prev => ({ ...prev, [field]: formatted }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  return {
    paymentInfo,
    handleInputChange
  };
};
