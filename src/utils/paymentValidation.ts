
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
  console.log('🔍 Validating payment fields:', {
    contact: billingContact,
    address: billingAddress
  });

  // Validate required contact fields
  if (!billingContact.firstName?.trim()) {
    return 'First name is required for billing';
  }

  if (!billingContact.lastName?.trim()) {
    return 'Last name is required for billing';
  }

  if (!billingContact.email?.trim()) {
    return 'Email address is required for billing';
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(billingContact.email)) {
    return 'Please enter a valid email address';
  }

  if (!billingContact.phone?.trim()) {
    return 'Phone number is required for billing';
  }

  // Validate required address fields
  if (!billingAddress.address?.trim()) {
    return 'Billing address is required';
  }

  if (!billingAddress.city?.trim()) {
    return 'City is required for billing address';
  }

  if (!billingAddress.state?.trim()) {
    return 'State is required for billing address';
  }

  if (!billingAddress.zipCode?.trim()) {
    return 'ZIP code is required for billing address';
  }

  // Basic ZIP code validation (US format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(billingAddress.zipCode)) {
    return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
  }

  console.log('✅ Payment fields validation passed');
  return null;
};

export const validateSquareConfiguration = (): string | null => {
  const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
  
  if (!appId) {
    return 'Square Application ID is not configured';
  }
  
  if (!locationId) {
    return 'Square Location ID is not configured';
  }
  
  return null;
};
