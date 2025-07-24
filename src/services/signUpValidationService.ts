
import { SignUpFormSchema } from '@/utils/signUpValidation';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateSignUpForm = (data: SignUpFormSchema): ValidationResult => {
  console.log('🔍 Step 1: Validating form data');
  
  const errors: string[] = [];

  // Required business information
  if (!data.businessName?.trim()) {
    errors.push('Business name is required');
  }
  if (!data.lineOfBusinessId?.trim()) {
    errors.push('Line of business is required');
  }
  if (!data.subscriptionId?.trim()) {
    errors.push('Subscription plan is required');
  }

  // Required contact information
  if (!data.emailAddress?.trim()) {
    errors.push('Email address is required');
  }
  if (!data.phoneNumber?.trim()) {
    errors.push('Phone number is required');
  }
  if (!data.cellPhoneNumber?.trim()) {
    errors.push('Cell phone number is required');
  }

  // Required location information
  if (!data.addressLine1?.trim()) {
    errors.push('Address is required');
  }
  if (!data.city?.trim()) {
    errors.push('City is required');
  }
  if (!data.state?.trim()) {
    errors.push('State is required');
  }
  if (!data.postalCode?.trim()) {
    errors.push('Postal code is required');
  }

  // Required credentials
  if (!data.userName?.trim()) {
    errors.push('Username is required');
  }
  if (!data.password?.trim()) {
    errors.push('Password is required');
  }
  if (data.password !== data.confirmPassword) {
    errors.push('Passwords do not match');
  }

  // Contact type specific validation
  if (data.displayContactType === 'GENERIC_NAME_PHONE_EMAIL') {
    if (!data.genericContactName?.trim()) {
      errors.push('Generic contact name is required for this display type');
    }
  } else {
    if (!data.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!data.lastName?.trim()) {
      errors.push('Last name is required');
    }
  }

  console.log('📋 Form validation result:', {
    isValid: errors.length === 0,
    errorCount: errors.length,
    errors
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
