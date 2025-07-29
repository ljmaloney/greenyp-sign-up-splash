
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

export const validatePaymentFields = (
  billingContact: BillingContactData,
  billingAddress: BillingAddressData
): string | null => {
  if (!billingContact.firstName.trim()) {
    return 'First name is required';
  }
  
  if (!billingContact.lastName.trim()) {
    return 'Last name is required';
  }
  
  if (!billingContact.email.trim()) {
    return 'Email is required';
  }
  
  if (!billingAddress.address.trim()) {
    return 'Address is required';
  }
  
  if (!billingAddress.city.trim()) {
    return 'City is required';
  }
  
  if (!billingAddress.state.trim()) {
    return 'State is required';
  }
  
  if (!billingAddress.zipCode.trim()) {
    return 'ZIP code is required';
  }
  
  return null;
};
