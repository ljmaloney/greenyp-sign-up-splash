
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
  // Validate billing contact fields
  if (!billingContact.firstName?.trim()) {
    return 'First name is required';
  }
  if (!billingContact.lastName?.trim()) {
    return 'Last name is required';
  }
  if (!billingContact.email?.trim()) {
    return 'Email address is required';
  }
  if (!billingContact.phone?.trim()) {
    return 'Phone number is required';
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(billingContact.email.trim())) {
    return 'Please enter a valid email address';
  }

  // Validate billing address fields
  if (!billingAddress.address?.trim()) {
    return 'Address is required';
  }
  if (!billingAddress.city?.trim()) {
    return 'City is required';
  }
  if (!billingAddress.state?.trim()) {
    return 'State is required';
  }
  if (!billingAddress.zipCode?.trim()) {
    return 'ZIP code is required';
  }

  // Validate ZIP code format (basic US ZIP code validation)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(billingAddress.zipCode.trim())) {
    return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
  }

  return null; // All validations passed
};
