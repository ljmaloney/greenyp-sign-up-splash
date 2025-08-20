
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { signUpFormSchema, SignUpFormSchema } from '@/utils/signUpValidation';

export const useSignUpFormConfig = (selectedPlan: string) => {
  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      businessName: '',
      lineOfBusinessId: '',
      subscriptionId: selectedPlan,
      websiteUrl: '',
      narrative: '',
      signupCode: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      cellPhoneNumber: '',
      emailAddress: '',
      genericContactName: '',
      title: '',
      displayContactType: 'FULL_NAME_PHONE_EMAIL',
      locationName: '',
      locationDisplayType: 'CITY_STATE_ZIP',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      userName: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Removed auto-population of userName field

  return form;
};
