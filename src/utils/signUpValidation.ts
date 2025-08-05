
import { z } from 'zod';

// Phone number formatting utility
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (phoneNumber.length >= 6) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{0,4})/, '($1) $2-$3');
  } else if (phoneNumber.length >= 3) {
    return phoneNumber.replace(/(\d{3})(\d{0,3})/, '($1) $2');
  }
  
  return phoneNumber;
};

// Validation schema
export const signUpFormSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  lineOfBusinessId: z.string().min(1, 'Line of business is required'),
  subscriptionId: z.string().min(1, 'Subscription plan is required'),
  websiteUrl: z.string().optional(),
  keywords: z.string()
    .regex(/^[A-Za-z0-9 ,]*$/, 'Keywords can only contain letters, numbers, spaces, and commas')
    .optional()
    .or(z.literal('')),
  narrative: z.string().optional(),
  signupCode: z.string()
    .regex(/^[A-Za-z0-9]*$/, 'Sign up code must be alphanumeric with no spaces')
    .min(8, 'Sign up code must be at least 8 characters')
    .max(20, 'Sign up code must be at most 20 characters')
    .optional()
    .or(z.literal('')),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string()
    .min(1, 'Business phone is required')
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter a valid US phone number'),
  cellPhoneNumber: z.string()
    .min(1, 'Cell phone is required')
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter a valid US phone number'),
  emailAddress: z.string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  genericContactName: z.string().optional(),
  title: z.string().optional(),
  displayContactType: z.string().min(1, 'Contact display type is required'),
  locationName: z.string().optional(),
  locationDisplayType: z.string().min(1, 'Location display type is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  userName: z.string().min(1, 'Username is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .regex(
      /^(?=.*?[A-Za-z0-9#?!@$%^&*-]).{8,}$/,
      'Password must contain at least one letter, number, or special character (#?!@$%^&*-)'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => {
  // Conditional validation based on displayContactType
  if (data.displayContactType === 'GENERIC_NAME_PHONE_EMAIL') {
    return data.genericContactName && data.genericContactName.trim().length > 0;
  } else {
    return data.firstName && data.firstName.trim().length > 0 && 
           data.lastName && data.lastName.trim().length > 0;
  }
}, {
  message: "Please provide the required contact information based on your display type selection",
  path: ["displayContactType"],
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
